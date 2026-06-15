import React, {useMemo, useState} from 'react';
import {Image, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {buildCenteredWeek, type DayItem} from '../constants/days';
import {useCountry} from '../hooks/useCountry';
import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';
import {useTranslation} from 'react-i18next';
import { IMAGES } from '../assets';
import type { CountryCode } from '../services/redirectService';

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
  const {currentCountry, changeCountry} = useCountry();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [showCountrySheet, setShowCountrySheet] = useState(false);
  const days = useMemo(() => buildCenteredWeek(), []);

  const countries = [
    { code: 'CI' as CountryCode, name: "Côte d'Ivoire", flag: '🇨🇮' },
    { code: 'CM' as CountryCode, name: 'Cameroun', flag: '🇨🇲' },
    { code: 'PL' as CountryCode, name: 'Polska', flag: '🇵🇱' },
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.primary, paddingTop: insets.top}]}>
      <View style={styles.topRow}>
        {/* <View style={styles.logoPill}> */}
          <Image style={{width: 130, height: 44, borderRadius: 6}} source={require('../assets/images/logo.png')}  />
        {/* </View> */}

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCountrySheet(true)}
            style={[styles.circleBtn, {backgroundColor: 'rgba(255, 255, 255, 0.62)'}]}>
            <Text style={styles.languageFlag}>
              {countries.find(country => country.code === currentCountry)?.flag || '🇨🇮'}
            </Text>
          </TouchableOpacity>
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
        {days.map(day => {
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
                {t(`days.${day.weekdayKey}`).toUpperCase()}
              </Text>
              <Text
                weight={selected ? 'bold' : 'semibold'}
                color="#fff"
                style={[styles.dayNumber, selected && styles.dayNumberSelected]}>
                {String(day.date).padStart(2, '0')}
              </Text>
              {selected ? (
                <View style={styles.underline} />
              ) : (
                <View style={styles.underlinePlaceholder} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
            <Modal
        visible={showCountrySheet}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCountrySheet(false)}>
        <View style={[styles.modalOverlay, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
          <View style={[styles.modalContent, {backgroundColor: colors.card, borderColor: colors.border}]}>
            <Text variant="title" weight="semibold" style={[styles.modalTitle, {color: colors.textPrimary}]}>
              {t('header.selectCountry')}
            </Text>
            <View style={styles.languageList}>
              {countries.map(country => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.languageItem,
                    {backgroundColor: colors.cardAlt, borderColor: colors.border},
                    currentCountry === country.code && [styles.languageItemSelected, {backgroundColor: colors.primary + '20', borderColor: colors.primary}],
                  ]}
                  onPress={() => {
                    changeCountry(country.code);
                    setShowCountrySheet(false);
                  }}>
                  <Text style={styles.flagText}>{country.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      {color: colors.textPrimary},
                      currentCountry === country.code && [styles.languageNameSelected, {color: colors.primary}],
                    ]}>
                    {country.name}
                  </Text>
                  {currentCountry === country.code && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.closeButton, {backgroundColor: colors.cardAlt}]}
              onPress={() => setShowCountrySheet(false)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 12,
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
  languageFlag: {
    fontSize: 18,
    lineHeight: 22,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  languageItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  flagText: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  languageNameSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
