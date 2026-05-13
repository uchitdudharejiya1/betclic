import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type ButtonVariant = 'primary' | 'ghost' | 'watch';

export type ButtonProps = {
  label?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  icon,
  style,
}) => {
  const {colors} = useTheme();

  const isWatch = variant === 'watch';
  const bg =
    variant === 'ghost'
      ? 'transparent'
      : isWatch
      ? colors.accent
      : colors.primary;
  const fg = isWatch ? '#000' : '#fff';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : 1,
          borderColor:
            variant === 'ghost' ? colors.border : 'transparent',
          borderWidth: variant === 'ghost' ? 1 : 0,
          paddingHorizontal: isWatch ? 10 : 14,
          paddingVertical: isWatch ? 6 : 10,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Text variant="caption" weight="bold" color={fg} style={styles.icon}>
              {icon}
            </Text>
          ) : null}
          {label ? (
            <Text variant="caption" weight="bold" color={fg}>
              {label}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {marginRight: 6},
});
