import React from 'react';
import {StyleSheet, View} from 'react-native';

import type {LeagueMatch} from '../constants/leagueMatches';
import {useTheme} from '../hooks/useTheme';
import {Text} from './Text';

export type ExpandedMatchRowProps = {
  match: LeagueMatch;
  isLast?: boolean;
};

export const ExpandedMatchRow: React.FC<ExpandedMatchRowProps> = ({match, isLast}) => {
  const {colors} = useTheme();

  let leftNode: React.ReactNode = null;
  if (match.status === 'live') {
    leftNode = (
      <View style={styles.leftStack}>
        <Text variant="label" weight="bold" color={colors.primary}>
          DIRECT
        </Text>
        {(match.min || match.set) ? (
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
    <View style={[styles.row, !isLast && {borderBottomColor: colors.border, borderBottomWidth: 1}]}>
      <View style={styles.left}>{leftNode}</View>
      <View style={styles.middle}>
        <Text variant="body" weight="semibold" color={colors.textPrimary} numberOfLines={1}>
          {match.t1}
        </Text>
        <Text variant="body" color={colors.textSecondary} numberOfLines={1} style={styles.t2}>
          {match.t2}
        </Text>
      </View>
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
    </View>
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
  right: {alignItems: 'flex-end'},
});
