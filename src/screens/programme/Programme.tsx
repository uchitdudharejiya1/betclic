import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {BottomSheet} from '../../components/BottomSheet';
import {CalendarComponent} from '../../components/CalendarComponent';
import {CompetitionGroupHeader} from '../../components/CompetitionGroupHeader';
import {Header} from '../../components/Header';
import {Pill} from '../../components/Pill';
import {ScheduledMatchRow} from '../../components/ScheduledMatchRow';
import {Text} from '../../components/Text';
import {Button} from '../../components/Button';
import {ENV} from '../../config/env';
import { openSeeAllMatchesRedirect } from '../../services/redirectService';
import {todayKey, type DayItem} from '../../constants/days';
import {SPORTS, type SportId} from '../../constants/sports';
import {useCountry} from '../../hooks/useCountry';
import {useFixtures} from '../../hooks/useFixtures';
import {useTheme} from '../../hooks/useTheme';
import type {Match} from '../../types/domain/match';

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  hockey: '🏒',
  martial: '🥊',
};

type Section = {
  title: string;
  icon: string;
  data: Array<{
    id: string;
    t1: string;
    t2: string;
    time: string;
    status: Match['status'];
    score1: string;
    score2: string;
    clock?: string;
  }>;
};

const buildSections = (matches: Match[]): Section[] => {
  const map = new Map<string, {sport: Match['sport']; data: Section['data']}>();
  for (const m of matches) {
    const key = m.competition;
    const time = new Date(m.startsAtMs).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const entry = map.get(key) ?? {sport: m.sport, data: []};
    entry.data.push({
      id: m.id,
      t1: m.home.name,
      t2: m.away.name,
      time,
      status: m.status,
      score1: m.score.home,
      score2: m.score.away,
      clock: m.clock,
    });
    map.set(key, entry);
  }
  return Array.from(map.entries()).map(([title, {sport, data}]) => ({
    title,
    icon: SPORT_EMOJI[sport] ?? '•',
    data,
  }));
};

export const Programme: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [selectedDayKey, setSelectedDayKey] = useState<DayItem['key']>(todayKey());
  const [selectedSport, setSelectedSport] = useState<SportId>('football');
  const [calendarOpen, setCalendarOpen] = useState(false);
    const {data, isLoading, error, refetch, isRefetching} = useFixtures(
    selectedDayKey,
    selectedSport,
  );
  const limited = useMemo(() => (data ?? []).slice(0, 10), [data]);
  const sections = useMemo(() => buildSections(limited), [limited]);

  const {currentCountry} = useCountry();

  const openAll = useCallback(() => {
    openSeeAllMatchesRedirect(currentCountry);
  }, [currentCountry]);

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
            count={sport.count}
            selected={sport.id === selectedSport}
            onPress={() => setSelectedSport(sport.id)}
          />
        ))}
      </ScrollView>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text
            variant="caption"
            weight="bold"
            color={colors.textMuted}
            style={styles.sectionTitle}>
            {t('ui.todayTitle')}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : error ? (
              <Text variant="body" color={colors.textSecondary} align="center">
                {t('errors.loadingError')}
              </Text>
            ) : (
              <Text variant="body" color={colors.textMuted} align="center">
                {t('errors.noDataAvailable')}
              </Text>
            )}
          </View>
        }
        renderSectionHeader={({section: {title, icon}}) => (
          <View style={{backgroundColor: colors.bg}}>
            <CompetitionGroupHeader icon={icon} label={title} />
          </View>
        )}
        renderItem={({item}) => (
          <ScheduledMatchRow
            t1={item.t1}
            t2={item.t2}
            time={item.time}
            status={item.status}
            score1={item.score1}
            score2={item.score2}
            clock={item.clock}
          />
        )}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          <Button
            variant="primary"
            label={t('actions.seeAllMatches')}
            onPress={openAll}
            style={{paddingVertical: 14, alignSelf: 'stretch', marginTop: 12}}
          />
        }
      />

      <BottomSheet visible={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <CalendarComponent onClose={() => setCalendarOpen(false)} />
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  railScroll: {flexGrow: 0, flexShrink: 0},
  rail: {paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center'},
  sectionTitle: {
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 4,
  },
  list: {paddingHorizontal: 16, paddingBottom: 12, flexGrow: 1},
  empty: {paddingVertical: 64, alignItems: 'center'},
});

export default Programme;
