import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { openMatchRedirect } from '../services/redirectService';

import { useTheme } from '../hooks/useTheme';
import type { MatchStatus } from '../types/domain/match';
import { Text } from './Text';

export type ScheduledMatchRowProps = {
  t1: string;
  t2: string;
  time: string;
  status?: MatchStatus;
  score1?: string;
  score2?: string;
  clock?: string;
};

export const ScheduledMatchRow: React.FC<ScheduledMatchRowProps> = ({
  t1,
  t2,
  time,
  status,
  score1,
  score2,
  clock,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isFinished = status === 'finished';
  const isLive = status === 'live' || status === 'halftime';
  const isScheduled = status === 'scheduled';

  const statusLabel = isFinished
    ? t('match.finished').toUpperCase()
    : isLive
      ? t('match.live')
      : time;
  const statusColor = isFinished
    ? colors.textMuted
    : isLive
      ? colors.accent
      : colors.primary;

  const showScores = isFinished || isLive;

  return (
    <View
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.statusContainer}>
        <Text
          variant="caption"
          weight="bold"
          color={statusColor}
          style={styles.statusText}>
          {statusLabel}
        </Text>
        {isLive && clock && (
          <Text
            variant="caption"
            weight="bold"
            color={statusColor}
            style={styles.clockText}>
            {clock}
          </Text>
        )}
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamRow}>
          <Text
            variant="body"
            weight="bold"
            color={isFinished ? colors.textSecondary : colors.textPrimary}
            numberOfLines={1}
            style={styles.teamName}>
            {t1}
          </Text>
          {showScores && (
            <Text
              variant="body"
              weight="bold"
              color={isFinished ? colors.textSecondary : colors.textPrimary}
              style={styles.score}>
              {score1}
            </Text>
          )}
        </View>
        <View style={styles.teamRow}>
          <Text
            variant="body"
            color={isFinished ? colors.textSecondary : colors.textPrimary}
            numberOfLines={1}
            style={styles.teamName}>
            {t2}
          </Text>
          {showScores && (
            <Text
              variant="body"
              weight="bold"
              color={isFinished ? colors.textSecondary : colors.textPrimary}
              style={styles.score}>
              {score2}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => openMatchRedirect()}
        style={[styles.tvButton, { borderColor: colors.primary }]}>
        <Image style={styles.tvIcon} source={require('../assets/images/tvIcon.png')} />
        <Text variant="label" weight="bold" color={colors.primary} style={styles.voirLabel}>
          {t('match.watch')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  statusContainer: {
    minWidth: 70,
    marginRight: 12,
  },
  statusText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  clockText: {
    fontSize: 11,
    marginTop: 2,
  },
  teamsContainer: {
    flex: 1,
    marginRight: 12,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamName: {
    flex: 1,
    marginRight: 8,
  },
  score: {
    fontSize: 16,
    minWidth: 20,
    textAlign: 'right',
  },
  tvButton: {
    width: 65,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvIcon: {
    width: 28,
    height: 28,
  },
  voirLabel: { marginTop: 2, fontSize: 10, letterSpacing: 0.5 },
});
