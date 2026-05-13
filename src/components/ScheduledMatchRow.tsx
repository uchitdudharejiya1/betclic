import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type ScheduledMatchRowProps = {
  t1: string;
  t2: string;
  time: string;
};

export const ScheduledMatchRow: React.FC<ScheduledMatchRowProps> = ({t1, t2, time}) => {
  const {colors} = useTheme();
  return (
    <View style={[styles.row, {backgroundColor: colors.card, borderColor: colors.border}]}>
      <Text variant="body" weight="bold" color={colors.textPrimary} numberOfLines={1} style={styles.left}>
        {t1}
      </Text>
      <Text variant="body" weight="bold" color={colors.primary} style={styles.time}>
        {time}
      </Text>
      <Text variant="body" color={colors.textPrimary} numberOfLines={1} style={styles.right}>
        {t2}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  left: {flex: 1},
  time: {minWidth: 60, textAlign: 'center'},
  right: {flex: 1, textAlign: 'right'},
});
