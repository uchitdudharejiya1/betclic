import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {SCHEDULED_GAMES, type ScheduledGame} from '../constants/scheduledGames';
import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type CalendarProps = {
  onClose?: () => void;
  onSelectGame?: (game: ScheduledGame) => void;
};

export const CalendarComponent: React.FC<CalendarProps> = ({onClose, onSelectGame}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text variant="title" style={styles.titleEmoji}>
            📅
          </Text>
          <Text variant="title" weight="bold" color={colors.textPrimary}>
            Calendar
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {SCHEDULED_GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            activeOpacity={0.85}
            onPress={() => onSelectGame?.(game)}
            style={[styles.row, {backgroundColor: colors.cardAlt, borderColor: colors.border}]}>
            <Text variant="body" weight="bold" color={colors.primary} style={styles.time}>
              {game.time}
            </Text>
            <View style={styles.info}>
              <Text variant="caption" color={colors.textMuted} numberOfLines={1} style={styles.comp}>
                {game.comp}
              </Text>
              <Text variant="body" color={colors.textPrimary}>
                <Text variant="body" weight="bold" color={colors.textPrimary}>
                  {game.t1}
                </Text>
                <Text variant="body" color={colors.textSecondary}>
                  {' '}vs{' '}
                </Text>
                <Text variant="body" weight="bold" color={colors.textPrimary}>
                  {game.t2}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
