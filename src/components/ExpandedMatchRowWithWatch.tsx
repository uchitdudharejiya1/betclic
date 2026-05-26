import React from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import type {LeagueMatch} from '../constants/leagueMatches';
import {useTheme} from '../hooks/useTheme';
import {useLanguageSpecificUrls} from '../utils/urlRedirection';
import {Text} from './Text';

export type ExpandedMatchRowWithWatchProps = {
  match: LeagueMatch;
  isLast?: boolean;
};

export const ExpandedMatchRowWithWatch: React.FC<ExpandedMatchRowWithWatchProps> = ({
  match,
  isLast,
}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {openMatch} = useLanguageSpecificUrls();

  let leftNode: React.ReactNode = null;
  if (match.status === 'live') {
    leftNode = (
      <View style={styles.leftStack}>
        <Text variant="label" weight="bold" color={colors.primary}>
          DIRECT
        </Text>
        {match.min || match.set ? (
          <Text variant="label" weight="bold" color={colors.accent} style={styles.subStatus}>
            {match.min ?? match.set}
          </Text>
        ) : null}
      </View>
    );
  } else if (match.status === 'scheduled') {
    leftNode = (
      <Text variant="body" weight="bold" color={colors.primary}>
        {match.time}
      </Text>
    );
  } else {
    leftNode = (
      <Text variant="label" weight="bold" color={colors.textMuted}>
        TERMINÉ
      </Text>
    );
  }

  const showScores =
    (match.status === 'live' || match.status === 'finished') && (match.s1 || match.s2);

  return (
    <TouchableOpacity
      onPress={openMatch}
      style={[styles.row, !isLast && {borderBottomColor: colors.border, borderBottomWidth: 1}]}> 
      <View style={styles.left}>{leftNode}</View>
      <View style={styles.middle}>
        <Text variant="body" weight="semibold" color={colors.textPrimary} numberOfLines={1}>
          {match.t1}
        </Text>
        <Text variant="body" color={colors.textSecondary} numberOfLines={1} style={styles.t2}>
          {match.t2}
        </Text>
      </View>
      <View style={styles.rightGroup}>
        {showScores ? (
          <View style={styles.right}>
            <Text variant="body" weight="bold" color={colors.textPrimary}>
              {match.s1}
            </Text>
            <Text variant="body" weight="bold" color={colors.textPrimary} style={styles.t2}>
              {match.s2}
            </Text>
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Linking.openURL('https://betclic.onelink.me/oTcP/10zx84uj');
          }}
          style={[styles.voirBtn, {borderColor: colors.primary}]}
        >
          <Image style={styles.tvIcon} source={require('../assets/images/tvIcon.png')} />
          <Text variant="label" weight="bold" color={colors.primary} style={styles.voirLabel}>
            {t('match.watch')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  left: {width: 80},
  leftStack: {alignItems: 'flex-start'},
  subStatus: {marginTop: 2},
  middle: {flex: 1, marginRight: 10},
  t2: {marginTop: 2},
  rightGroup: {flexDirection: 'row', alignItems: 'center'},
  right: {alignItems: 'flex-end', marginRight: 12},
  voirBtn: {
    width: 58,
    height: 46,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvIcon: {
    width: 24,
    height: 24,
  },
  voirLabel: { fontSize: 10, letterSpacing: 0.5},
});
