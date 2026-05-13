import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type PillVariant = 'live' | 'sport';

export type PillProps = {
  label: string;
  icon?: string;
  variant?: PillVariant;
  selected?: boolean;
  count?: number;
  onPress?: () => void;
};

export const Pill: React.FC<PillProps> = ({
  label,
  icon,
  variant = 'sport',
  selected = false,
  count,
  onPress,
}) => {
  const {colors} = useTheme();

  const isLive = variant === 'live';
  const bg = selected ? colors.primary : colors.card;
  const fg = selected ? '#fff' : colors.textPrimary;
  const dotColor = selected ? '#fff' : colors.liveText;
  const countBg = selected ? 'rgba(0,0,0,0.28)' : colors.cardAlt;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.base, isLive ? styles.live : styles.sport, {backgroundColor: bg}]}>
      {isLive ? (
        <View style={[styles.dot, {backgroundColor: dotColor}]} />
      ) : icon ? (
        <Text variant="title" style={styles.icon}>
          {icon}
        </Text>
      ) : null}
      <Text variant="body" weight="semibold" color={fg}>
        {label}
      </Text>
      {typeof count === 'number' ? (
        <View style={[styles.countOval, {backgroundColor: countBg}]}>
          <Text variant="caption" weight="bold" color={fg}>
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const PILL_HEIGHT = 44;

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    marginRight: 10,
  },
  live: {
    paddingHorizontal: 18,
  },
  sport: {
    paddingHorizontal: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  countOval: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 8,
    minWidth: 28,
    alignItems: 'center',
  },
});
