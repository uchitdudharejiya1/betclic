import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {DAYS, type DayItem} from '../constants/days';
import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type HeaderProps = {
  selectedDayKey: DayItem['key'];
  onSelectDay: (key: DayItem['key']) => void;
  onCalendarPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  selectedDayKey,
  onSelectDay,
  onCalendarPress,
}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {backgroundColor: colors.primary, paddingTop: insets.top}]}>
      <View style={styles.topRow}>
        <View style={styles.logoPill}>
          <Text variant="title" weight="black" color={colors.primary} style={styles.logoText}>
            Betclic
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleTheme}
            style={styles.circleBtn}>
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCalendarPress}
            style={styles.circleBtn}>
            <Ionicons name="calendar-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dayRail}>
        {DAYS.map(day => {
          const selected = day.key === selectedDayKey;
          return (
            <TouchableOpacity
              key={day.key}
              onPress={() => onSelectDay(day.key)}
              activeOpacity={0.7}
              style={styles.dayCell}>
              <Text
                variant="caption"
                weight="semibold"
                color="rgba(255,255,255,0.85)"
                style={styles.dayLabel}>
                {{
                  mon: 'LUN',
                  tue: 'MAR',
                  wed: 'MER',
                  thu: 'JEU',
                  fri: 'VEN',
                  sat: 'SAM',
                  sun: 'DIM',
                }[day.key]}
              </Text>
              <Text
                weight={selected ? 'bold' : 'semibold'}
                color="#fff"
                style={[styles.dayNumber, selected && styles.dayNumberSelected]}>
                {String(day.date).padStart(2, '0')}
              </Text>
              {selected ? <View style={styles.underline} /> : <View style={styles.underlinePlaceholder} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  logoPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoText: {
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  dayRail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayLabel: {
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    lineHeight: 22,
  },
  dayNumberSelected: {
    fontSize: 22,
    lineHeight: 26,
  },
  underline: {
    width: 26,
    height: 2,
    backgroundColor: '#fff',
    marginTop: 6,
    borderRadius: 1,
  },
  underlinePlaceholder: {
    width: 26,
    height: 2,
    marginTop: 6,
  },
});
