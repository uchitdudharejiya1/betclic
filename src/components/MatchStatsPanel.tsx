import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import type {Match} from '../types/domain/match';
import {Text} from './Text';

export type MatchStatsPanelProps = {
  match: Match;
};

export const MatchStatsPanel: React.FC<MatchStatsPanelProps> = React.memo(
  ({match}) => {
    const {colors} = useTheme();
    return (
      <View
        style={[
          styles.card,
          {backgroundColor: colors.card, borderColor: colors.border},
        ]}>
        <Text variant="caption" weight="bold" color={colors.textMuted}>
          {match.competition.toUpperCase()}
        </Text>
        <View style={styles.row}>
          <Text variant="title" weight="bold" color={colors.textPrimary} style={styles.team}>
            {match.home.name}
          </Text>
          <Text variant="display" weight="bold" color={colors.textPrimary}>
            {match.score.home} – {match.score.away}
          </Text>
          <Text variant="title" weight="bold" color={colors.textPrimary} style={styles.team}>
            {match.away.name}
          </Text>
        </View>
        {match.clock ? (
          <Text variant="caption" color={colors.textSecondary} align="center">
            {match.clock}
          </Text>
        ) : null}
      </View>
    );
  },
);

MatchStatsPanel.displayName = 'MatchStatsPanel';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  team: {flex: 1},
});
