import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type CompetitionGroupHeaderProps = {
  icon: string;
  label: string;
};

export const CompetitionGroupHeader: React.FC<CompetitionGroupHeaderProps> = ({
  icon,
  label,
}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, {backgroundColor: colors.cardAlt}]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text variant="caption" weight="medium" color={colors.textSecondary}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {fontSize: 12},
});
