import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import type {OddsSelection} from '../types/domain/odds';
import {Text} from './Text';

export type OddsRowProps = {
  marketName: string;
  selections: OddsSelection[];
};

export const OddsRow: React.FC<OddsRowProps> = React.memo(
  ({marketName, selections}) => {
    const {colors} = useTheme();
    return (
      <View style={styles.row}>
        <Text
          variant="caption"
          weight="medium"
          color={colors.textSecondary}
          numberOfLines={1}
          style={styles.market}>
          {marketName}
        </Text>
        <View style={styles.cells}>
          {selections.slice(0, 3).map((s, i) => (
            <View
              key={`${marketName}-${i}-${s.label}`}
              style={[styles.cell, {borderColor: colors.border, backgroundColor: colors.card}]}>
              <Text
                variant="label"
                weight="medium"
                color={colors.textMuted}
                numberOfLines={1}>
                {s.label}
              </Text>
              <Text variant="body" weight="bold" color={colors.textPrimary}>
                {s.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  },
);

OddsRow.displayName = 'OddsRow';

const styles = StyleSheet.create({
  row: {marginBottom: 8},
  market: {marginBottom: 4},
  cells: {flexDirection: 'row', gap: 6},
  cell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});
