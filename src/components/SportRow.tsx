import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {useCountry} from '../hooks/useCountry';
import {useTheme} from '../hooks/useTheme';
import { openSeeAllMatchesRedirect } from '../services/redirectService';
import {Text} from './Text';

export type SportRowProps = {
  icon: string;
  label: string;
  count: number;
  onPress?: () => void;
};

export const SportRow: React.FC<SportRowProps> = ({icon, label, count, onPress}) => {
  const {colors} = useTheme();
  const {currentCountry} = useCountry();
  const {t} = useTranslation();
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      openSeeAllMatchesRedirect(currentCountry);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.row, {backgroundColor: colors.card, borderColor: colors.border}]}>
      <View style={[styles.iconCircle, {backgroundColor: colors.cardAlt}]}>
        <Text variant="title" style={styles.iconText}>
          {icon}
        </Text>
      </View>
      <Text variant="body" weight="bold" color={colors.textPrimary} style={styles.label}>
        {label}
      </Text>
      <Text variant="caption" color={colors.textMuted} style={styles.count}>
        {count} 
        {/* {t('ui.competitions')} */}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {fontSize: 20, lineHeight: 24},
  label: {flex: 1},
  count: {marginRight: 8},
});
