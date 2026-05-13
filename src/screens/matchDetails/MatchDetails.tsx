import {useRoute, type RouteProp} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import React, {useMemo} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {MatchStatsPanel} from '../../components/MatchStatsPanel';
import {OddsRow} from '../../components/OddsRow';
import {Text} from '../../components/Text';
import type {SportKey} from '../../config/sports';
import {useTheme} from '../../hooks/useTheme';
import {useMatchOdds} from '../../hooks/useMatchDetails';
import {useLiveOdds} from '../../sockets/hooks/useLiveOdds';
import {useMatchSubscription} from '../../sockets/hooks/useMatchSubscription';
import type {RootStackParamList} from '../../navigation/RootNavigator';
import type {Match} from '../../types/domain/match';

type MatchDetailsRoute = RouteProp<RootStackParamList, 'MatchDetails'>;

export const MatchDetails: React.FC = () => {
  const {colors} = useTheme();
  const route = useRoute<MatchDetailsRoute>();
  const {matchId, sport} = route.params;
  const sportKey = sport as SportKey;

  const queryClient = useQueryClient();
  const match = useMemo<Match | undefined>(() => {
    const caches = queryClient.getQueriesData<Match[]>({queryKey: ['matches']});
    for (const [, list] of caches) {
      const found = list?.find(m => m.id === matchId);
      if (found) return found;
    }
    return undefined;
  }, [queryClient, matchId]);

  useMatchSubscription(matchId);

  const {data: restOdds, isLoading: oddsLoading, error: oddsError} = useMatchOdds(sportKey, matchId);
  const liveOdds = useLiveOdds(matchId);
  const odds = liveOdds ?? restOdds ?? null;

  return (
    <SafeAreaView edges={['bottom']} style={[styles.safe, {backgroundColor: colors.bg}]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {match ? (
          <MatchStatsPanel match={match} />
        ) : (
          <View style={[styles.placeholder, {borderColor: colors.border}]}>
            <Text variant="body" color={colors.textMuted}>
              Match #{matchId}
            </Text>
          </View>
        )}

        <Text variant="caption" weight="bold" color={colors.textMuted} style={styles.section}>
          ODDS
        </Text>

        {oddsLoading && !odds ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : oddsError && !odds ? (
          <Text variant="body" color={colors.textSecondary}>
            {(oddsError as Error).message}
          </Text>
        ) : !odds || odds.markets.length === 0 ? (
          <Text variant="body" color={colors.textMuted}>
            No odds available yet.
          </Text>
        ) : (
          odds.markets
            .slice(0, 8)
            .map(m => (
              <OddsRow key={m.id} marketName={m.name} selections={m.selections} />
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MatchDetails;

const styles = StyleSheet.create({
  safe: {flex: 1},
  scroll: {padding: 16},
  section: {marginTop: 8, marginBottom: 12, letterSpacing: 1.2},
  loader: {marginVertical: 16},
  placeholder: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
});
