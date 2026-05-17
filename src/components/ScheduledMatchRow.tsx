import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useTheme} from '../hooks/useTheme';
import type {MatchStatus} from '../types/domain/match';
import {Text} from './Text';

export type ScheduledMatchRowProps = {
  t1: string;
  t2: string;
  time: string;
  status?: MatchStatus;
};

export const ScheduledMatchRow: React.FC<ScheduledMatchRowProps> = ({
  t1,
  t2,
  time,
  status,
}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const isFinished = status === 'finished';
  const isLive = status === 'live' || status === 'halftime';

  const centerLabel = isFinished
    ? t('match.finished')
    : isLive
    ? t('match.live')
    : time;
  const centerColor = isFinished
    ? colors.textMuted
    : isLive
    ? colors.accent
    : colors.primary;

  return (
    <View
      style={[styles.row, {backgroundColor: colors.card, borderColor: colors.border}]}>
      <Text
        variant="body"
        weight="bold"
        color={isFinished ? colors.textSecondary : colors.textPrimary}
        numberOfLines={1}
        style={styles.left}>
        {t1}
      </Text>
      <Text variant="body" weight="bold" color={centerColor} style={styles.time}>
        {centerLabel}
      </Text>
      <Text
        variant="body"
        color={isFinished ? colors.textSecondary : colors.textPrimary}
        numberOfLines={1}
        style={styles.right}>
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
