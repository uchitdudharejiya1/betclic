import {useQuery} from '@tanstack/react-query';
import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {matchRepository} from '../../api/repositories/matchRepository';
import {BottomSheet} from '../../components/BottomSheet';
import {Button} from '../../components/Button';
import {CalendarComponent} from '../../components/CalendarComponent';
import {CollapsibleLeagueCard} from '../../components/CollapsibleLeagueCard';
import {Header} from '../../components/Header';
import {Pill} from '../../components/Pill';
import {SportRow} from '../../components/SportRow';
import {Text} from '../../components/Text';
import { openSeeAllMatchesRedirect } from '../../services/redirectService';
import {SportKey, isSportAvailable} from '../../config/sports';
import {todayKey, type DayItem} from '../../constants/days';
import {SPORT_MENU} from '../../constants/sportMenu';
import {SPORTS, type SportId} from '../../constants/sports';
import type {LeagueMatch, LeagueMatchStatus} from '../../constants/leagueMatches';
import {useFixtures} from '../../hooks/useFixtures';
import {useTheme} from '../../hooks/useTheme';
import type {Match, MatchStatus} from '../../types/domain/match';

type DetailSport = Exclude<SportId, 'live'>;

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  volleyball: '🏐',
  hockey: '🏒',
  martial: '🥊',
};

const mapStatus = (s: MatchStatus): LeagueMatchStatus => {
  if (s === 'live' || s === 'halftime') return 'live';
  if (s === 'finished') return 'finished';
  return 'scheduled';
};

const matchToLeagueRow = (m: Match): LeagueMatch => ({
  status: mapStatus(m.status),
  t1: m.home.name,
  t2: m.away.name,
  s1: m.score.home,
  s2: m.score.away,
  min: m.clock,
  time: new Date(m.startsAtMs).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
});

export const Sports: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [selectedDayKey, setSelectedDayKey] = useState<DayItem['key']>(todayKey());
  const [selectedSport, setSelectedSport] = useState<SportId>('football');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [detailSport, setDetailSport] = useState<DetailSport | null>(null);

  const {data: liveAll} = useQuery<Match[]>({
    queryKey: ['matches', 'live', 'live'],
    queryFn: ({signal}) => matchRepository.allLive(signal),
    enabled: false,
  });

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, {backgroundColor: colors.bg}]}>
      <Header
        selectedDayKey={selectedDayKey}
        onSelectDay={setSelectedDayKey}
        onCalendarPress={() => setCalendarOpen(true)}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.railScroll}
        contentContainerStyle={styles.rail}>
        {SPORTS.filter(s => s.id !== 'live').map(sport => (
          <Pill
            key={sport.id}
            icon={sport.id !== 'live' ? sport.icon : undefined}
            variant={sport.id === 'live' ? 'live' : 'sport'}
            label={t(sport.labelKey)}
            count={sport.id === 'live' ? (liveAll?.length ?? 0) : sport.count}
            selected={sport.id === selectedSport}
            onPress={() => setSelectedSport(sport.id)}
          />
        ))}
      </ScrollView>

      {detailSport ? (
        <DetailContent
          sportId={detailSport}
          date={selectedDayKey}
          onBack={() => setDetailSport(null)}
        />
      ) : (
        <ListContent date={selectedDayKey} onPickSport={setDetailSport} />
      )}

      <BottomSheet visible={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <CalendarComponent onClose={() => setCalendarOpen(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
};

const ListContent: React.FC<{
  date: string;
  onPickSport: (id: DetailSport) => void;
}> = ({date, onPickSport}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
    const {data: allToday} = useFixtures(date, 'live');
  const leagueCountsBySport = useMemo(() => {
    if (!allToday) return new Map<string, number>();
    const perSport = new Map<string, Set<string>>();
    for (const m of allToday) {
      const set = perSport.get(m.sport) ?? new Set<string>();
      const leagueKey = m.league.id || m.league.name;
      set.add(leagueKey);
      perSport.set(m.sport, set);
    }
    const counts = new Map<string, number>();
    perSport.forEach((set, sport) => counts.set(sport, set.size));
    return counts;
  }, [allToday]);

  return (
    <ScrollView contentContainerStyle={styles.list}>
      <Text variant="caption" weight="bold" color={colors.textMuted} style={styles.sectionTitle}>
        {t('ui.sportsTitle')}
      </Text>
      {SPORT_MENU.map(item => (
        <SportRow
          key={item.id}
          icon={item.icon}
          label={t(item.labelKey)}
          count={leagueCountsBySport.get(item.id) ?? 0}
          onPress={() => onPickSport(item.id)}
        />
      ))}
      <Button
        variant="primary"
        label={t('actions.seeAllMatches')}
        style={styles.cta}
        onPress={() => openSeeAllMatchesRedirect()}
      />
    </ScrollView>
  );
};

const DetailContent: React.FC<{
  sportId: DetailSport;
  date: string;
  onBack: () => void;
}> = ({sportId, date, onBack}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const sportKey = sportId as SportKey;
  const available = isSportAvailable(sportKey);
  const {data, isLoading, error} = useFixtures(date, sportId);

  const grouped = useMemo(() => {
    if (!data) return [] as {league: string; matches: LeagueMatch[]}[];
    const map = new Map<string, LeagueMatch[]>();
    for (const m of data) {
      const list = map.get(m.league.name) ?? [];
      list.push(matchToLeagueRow(m));
      map.set(m.league.name, list);
    }
    return Array.from(map.entries()).map(([league, matches]) => ({league, matches}));
  }, [data]);

  return (
    <View style={styles.detail}>
      <View style={[styles.titleRow, {borderBottomColor: colors.border}]}>
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="title" style={styles.titleEmoji}>
          {SPORT_EMOJI[sportId] ?? '•'}
        </Text>
        <Text variant="title" weight="bold" color={colors.textPrimary}>
          {t(`sports.${sportId}`)}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.detailList}>
        {!available ? (
          <Text variant="body" color={colors.textMuted} align="center" style={styles.notice}>
            {t('errors.providerNotConfigured', {sport: sportId})}
          </Text>
        ) : isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.notice} />
        ) : error ? (
          <Text variant="body" color={colors.textSecondary} align="center" style={styles.notice}>
            {t('errors.loadingError')}
          </Text>
        ) : grouped.length === 0 ? (
          <Text variant="body" color={colors.textMuted} align="center" style={styles.notice}>
            {t('errors.noDataAvailable')}
          </Text>
        ) : (
          grouped.map(g => (
            <CollapsibleLeagueCard key={g.league} league={g.league} matches={g.matches} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  railScroll: {flexGrow: 0, flexShrink: 0},
  rail: {paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center'},
  list: {paddingHorizontal: 16, paddingBottom: 16},
  sectionTitle: {
    letterSpacing: 1.2,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 12,
  },
  cta: {paddingVertical: 14, alignSelf: 'stretch', marginTop: 8},
  detail: {flex: 1},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {marginRight: 12},
  titleEmoji: {marginRight: 10, fontSize: 22, lineHeight: 26},
  detailList: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24},
  notice: {marginVertical: 32},
});

export default Sports;
