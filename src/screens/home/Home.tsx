import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {matchRepository} from '../../api/repositories/matchRepository';
import {BottomSheet} from '../../components/BottomSheet';
import {CalendarComponent} from '../../components/CalendarComponent';
import {Header} from '../../components/Header';
import {MatchCard} from '../../components/MatchCard';
import {Pill} from '../../components/Pill';
import {Text} from '../../components/Text';
import {todayKey, type DayItem} from '../../constants/days';
import {SPORTS, type SportId} from '../../constants/sports';
import {useFixtures} from '../../hooks/useFixtures';
import {useTheme} from '../../hooks/useTheme';
import {useLiveMatches} from '../../hooks/useLiveMatches';
import type {RootStackParamList} from '../../navigation/RootNavigator';
import type {Match} from '../../types/domain/match';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CARD_HEIGHT = 130;
const renderItemLayout = (_: unknown, index: number) => ({
  length: CARD_HEIGHT,
  offset: CARD_HEIGHT * index,
  index,
});

export const Home: React.FC = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation<Nav>();
  const [selectedDayKey, setSelectedDayKey] = useState<DayItem['key']>(todayKey());
  const [selectedSport, setSelectedSport] = useState<SportId>('football');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isToday = selectedDayKey === todayKey();
  const liveQuery = useLiveMatches(selectedSport, {enabled: isToday});
  const dateQuery = useFixtures(selectedDayKey, selectedSport, {
    enabled: !isToday,
  });
  const activeQuery = isToday ? liveQuery : dateQuery;
  const {data, isLoading, isRefetching, refetch, error} = activeQuery;

  const {data: liveAll} = useQuery<Match[]>({
    queryKey: ['matches', 'live', 'live'],
    queryFn: ({signal}) => matchRepository.allLive(signal),
    enabled: false,
  });

  const handlePress = useCallback(
    (matchId: string) => {
      const match = data?.find(m => m.id === matchId);
      if (!match) return;
      navigation.navigate('MatchDetails', {matchId, sport: match.sport});
    },
    [data, navigation],
  );

  const keyExtractor = useCallback((m: Match) => m.id, []);
  const renderItem = useCallback(
    ({item}: {item: Match}) => <MatchCard match={item} onPress={handlePress} />,
    [handlePress],
  );

  const emptyState = (() => {
    if (isLoading) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.empty}>
          <Text variant="body" color={colors.textSecondary} align="center">
            {t('errors.unknownError')}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.empty}>
        <Text variant="body" color={colors.textMuted} align="center">
          {t('errors.noLiveMatches')}
        </Text>
      </View>
    );
  })();

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

      <FlatList
        data={data ?? []}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        getItemLayout={renderItemLayout}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={emptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
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
  list: {padding: 16, flexGrow: 1},
  empty: {
    flex: 1,
    paddingVertical: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
