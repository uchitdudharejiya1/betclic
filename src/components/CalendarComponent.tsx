import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {todayKey} from '../constants/days';
import {useFixtures} from '../hooks/useFixtures';
import {useTheme} from '../hooks/useTheme';
import type {Match} from '../types/domain/match';
import {Text} from './Text';

export type CalendarProps = {
  onClose?: () => void;
  onSelectMatch?: (match: Match) => void;
};

const formatTime = (ms: number): string =>
  new Date(ms).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

export const CalendarComponent: React.FC<CalendarProps> = ({
  onClose,
  onSelectMatch,
}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {data, isLoading, error} = useFixtures(todayKey(), 'live');

  const upcoming = useMemo<Match[]>(() => {
    const now = Date.now();
    return (data ?? [])
      .filter(m => m.startsAtMs > now)
      .sort((a, b) => a.startsAtMs - b.startsAtMs)
      .slice(0, 30);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text variant="title" style={styles.titleEmoji}>
            📅
          </Text>
          <Text variant="title" weight="bold" color={colors.textPrimary}>
            {t('header.calendar')}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClose}
          style={styles.closeBtn}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {isLoading && upcoming.length === 0 ? (
        <View style={styles.state}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error && upcoming.length === 0 ? (
        <View style={styles.state}>
          <Text variant="body" color={colors.textSecondary} align="center">
            {t('errors.loadingError')}
          </Text>
        </View>
      ) : upcoming.length === 0 ? (
        <View style={styles.state}>
          <Text variant="body" color={colors.textMuted} align="center">
            {t('errors.noDataAvailable')}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {upcoming.map(match => (
            <TouchableOpacity
              key={match.id}
              activeOpacity={0.85}
              onPress={() => onSelectMatch?.(match)}
              style={[
                styles.row,
                {backgroundColor: colors.cardAlt, borderColor: colors.border},
              ]}>
              <Text
                variant="body"
                weight="bold"
                color={colors.primary}
                style={styles.time}>
                {formatTime(match.startsAtMs)}
              </Text>
              <View style={styles.info}>
                <Text
                  variant="caption"
                  color={colors.textMuted}
                  numberOfLines={1}
                  style={styles.comp}>
                  {match.competition || match.league.name}
                </Text>
                <Text variant="body" color={colors.textPrimary}>
                  <Text variant="body" weight="bold" color={colors.textPrimary}>
                    {match.home.name}
                  </Text>
                  <Text variant="body" color={colors.textSecondary}>
                    {' '}vs{' '}
                  </Text>
                  <Text variant="body" weight="bold" color={colors.textPrimary}>
                    {match.away.name}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  titleRow: {flexDirection: 'row', alignItems: 'center'},
  titleEmoji: {marginRight: 8, fontSize: 22, lineHeight: 26},
  closeBtn: {padding: 4},
  list: {},
  listContent: {paddingBottom: 16},
  state: {paddingVertical: 32, alignItems: 'center', justifyContent: 'center'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  time: {fontSize: 16, lineHeight: 20, minWidth: 64, marginRight: 8},
  info: {flex: 1},
  comp: {marginBottom: 4},
});
