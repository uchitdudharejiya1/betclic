import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {useThrottle} from '../hooks/useThrottle';
import {useLiveOdds} from '../sockets/hooks/useLiveOdds';
import {Text} from './Text';

export type LiveOddsBadgeProps = {
  matchId: string;
};

const LiveOddsBadgeImpl: React.FC<LiveOddsBadgeProps> = ({matchId}) => {
  const {colors} = useTheme();
  const odds = useLiveOdds(matchId);
  const throttled = useThrottle(odds, 250);

  const top = useMemo(() => {
    if (!throttled) return null;
    const market = throttled.markets[0];
    if (!market) return null;
    return market.selections.slice(0, 3);
  }, [throttled]);

  if (!top || top.length === 0) return null;

  return (
    <View style={styles.row}>
      {top.map((s, i) => (
        <View
          key={`${matchId}-odds-${i}`}
          style={[styles.cell, {backgroundColor: colors.card, borderColor: colors.border}]}>
          <Text variant="label" color={colors.textMuted} numberOfLines={1}>
            {s.label}
          </Text>
          <Text variant="caption" weight="bold" color={colors.accent}>
            {s.price.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const LiveOddsBadge = React.memo(LiveOddsBadgeImpl);
LiveOddsBadge.displayName = 'LiveOddsBadge';

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 6, marginTop: 10},
  cell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
});
