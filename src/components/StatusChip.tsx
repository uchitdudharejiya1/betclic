import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type StatusChipVariant = 'live' | 'period' | 'count';

export type StatusChipProps = {
  variant: StatusChipVariant;
  label: string;
};

export const StatusChip: React.FC<StatusChipProps> = ({variant, label}) => {
  const {colors} = useTheme();

  let bg = colors.cardAlt;
  let fg = colors.textPrimary;

  if (variant === 'live') {
    bg = colors.primary;
    fg = '#fff';
  } else if (variant === 'count') {
    bg = colors.primary;
    fg = '#fff';
  } else if (variant === 'period') {
    bg = colors.cardAlt;
    fg = colors.accent;
  }

  return (
    <View style={[styles.chip, {backgroundColor: bg}]}>
      <Text variant="label" weight="bold" color={fg}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
});
