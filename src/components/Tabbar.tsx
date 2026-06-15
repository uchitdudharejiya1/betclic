import type {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React, {useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useCountry} from '../hooks/useCountry';
import {useTheme} from '../hooks/useTheme';
import {useLiveMatches} from '../hooks/useLiveMatches';
import { openSeeMoreRedirect } from '../services/redirectService';
import {BottomSheet} from './BottomSheet';
import {Text} from './Text';

const ROUTE_ICON: Record<string, string> = {
  Sports: 'account-multiple',
  Live: 'clock-outline',
  Programme: 'calendar-blank-outline',
};

export const Tabbar: React.FC<BottomTabBarProps> = ({state, navigation}) => {
  const {colors} = useTheme();
  const {currentCountry} = useCountry();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const [seeAllOpen, setSeeAllOpen] = useState(false);
  const {data: liveAll} = useLiveMatches('live');
  const liveCount = liveAll?.length ?? 0;
  
  const labels: Record<string, string> = {
    Sports: t('nav.sports'),
    Live: t('nav.live'),
    Programme: t('nav.programme'),
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.nav,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}>
      {state.routes.map((route, idx) => {
        const isActive = state.index === idx;
        const iconColor = isActive ? colors.primary : colors.textSecondary;
        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            }}
            style={styles.tab}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={ROUTE_ICON[route.name] ?? 'circle-outline'}
                size={24}
                color={iconColor}
              />
              {route.name === 'Live' ? (
                <View style={[styles.badge, {backgroundColor: colors.primary}]}>
                  <Text variant="label" weight="bold" color="#fff" style={styles.badgeText}>
                    {liveCount}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              variant="label"
              weight={isActive ? 'bold' : 'medium'}
              color={iconColor}
              style={styles.tabLabel}>
              {labels[route.name] ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => openSeeMoreRedirect(currentCountry)}
        style={[styles.cta, {backgroundColor: colors.primary}]}>
        <MaterialCommunityIcons name="menu" size={20} color="#fff" />
        <Text variant="body" weight="bold" color="#fff" style={styles.ctaLabel}>
          {t('nav.seeAll')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {fontSize: 10, lineHeight: 12},
  tabLabel: {marginTop: 4},
  cta: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginLeft: 8,
  },
  ctaLabel: {marginLeft: 8},
  sheetTitle: {marginBottom: 8},
});
