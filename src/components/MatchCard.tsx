import React from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import { useTheme } from '../hooks/useTheme';
import { useMatchSubscription } from '../sockets/hooks/useMatchSubscription';
import type { Match } from '../types/domain/match';
import {useCountrySpecificUrls} from '../utils/urlRedirection';
import { LiveOddsBadge } from './LiveOddsBadge';
import { StatusChip } from './StatusChip';
import { Text } from './Text';

export type MatchCardProps = {
  match: Match;
  onPress?: (matchId: string) => void;
  onWatch?: (matchId: string) => void;
};

const isLiveStatus = (match: Match): boolean =>
  match.status === 'live' || match.status === 'halftime';

const formatKickoff = (ms: number): string =>
  new Date(ms).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

const MatchCardImpl: React.FC<MatchCardProps> = ({ match, onPress, onWatch }) => {
  const { colors } = useTheme();
  const {t} = useTranslation();
  const {openMatch} = useCountrySpecificUrls();
  useMatchSubscription(isLiveStatus(match) ? match.id : []);

  const isLive = isLiveStatus(match);
  const isFinished = match.status === 'finished';
  const isScheduled = match.status === 'scheduled';

  const score1Tokens = match.score.home.split(/\s+/);
  const score2Tokens = match.score.away.split(/\s+/);
  const status = match.clock ?? '';

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={openMatch}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        {isLive ? (
          <StatusChip variant="live" label={t('ui.liveBadge')} />
        ) : isFinished ? (
          <StatusChip variant="period" label={t('match.finished').toUpperCase()} />
        ) : null}
        <Text
          variant="caption"
          weight="medium"
          color={colors.textSecondary}
          numberOfLines={1}
          style={styles.comp}>
          {match.competition}
        </Text>
        {isLive && status ? (
          <Text variant="caption" weight="bold" color={colors.accent}>
            {status}
          </Text>
        ) : null}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.mainRow}>
        <View style={styles.teams}>
          <Text
            variant="body"
            weight="bold"
            color={colors.textPrimary}
            numberOfLines={1}
            style={styles.team1}>
            {match.home.name}
          </Text>
          <Text
            variant="body"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.team2}>
            {match.away.name}
          </Text>
        </View>

        {isScheduled ? (
          <View style={styles.scoresCol}>
            <Text weight="bold" color={colors.primary} style={styles.kickoff}>
              {formatKickoff(match.startsAtMs)}
            </Text>
          </View>
        ) : (
          <View style={styles.scoresCol}>
            <View style={styles.scoreLine}>
              {score1Tokens.map((tok, i) => (
                <Text
                  key={`s1-${i}`}
                  weight="bold"
                  color={isFinished ? colors.textSecondary : colors.textPrimary}
                  style={styles.scoreCell}>
                  {tok}
                </Text>
              ))}
            </View>
            <View style={[styles.scoreLine, styles.scoreLineSecond]}>
              {score2Tokens.map((tok, i) => (
                <Text
                  key={`s2-${i}`}
                  weight="bold"
                  color={isFinished ? colors.textSecondary : colors.textPrimary}
                  style={styles.scoreCell}>
                  {tok}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* {match.hasMedia ? ( */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Linking.openURL('https://betclic.onelink.me/oTcP/10zx84uj')
          }}
          style={[styles.voirBtn, { borderColor: colors.primary }]}>
            <Image style={styles.tvIcon} source={require('../assets/images/tvIcon.png')} />
          {/* <MaterialCommunityIcons name="play-box-outline" size={22} color={colors.primary} /> */}
          <Text variant="label" weight="bold" color={colors.primary} style={styles.voirLabel}>
            {t('match.watch')}
          </Text>
        </TouchableOpacity>
        {/* ) : (
          <View style={[styles.searchPlaceholder, {borderColor: colors.border}]}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
          </View>
        )} */}
      </View>

      <LiveOddsBadge matchId={match.id} />
    </TouchableOpacity>
  );
};

export const MatchCard = React.memo(MatchCardImpl);
MatchCard.displayName = 'MatchCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginBottom: 10,
    marginHorizontal: -14,
  },
  searchPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comp: { flex: 1, marginLeft: 8, marginRight: 8 },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teams: { flex: 1, marginRight: 8 },
  team1: { fontSize: 16, lineHeight: 20 },
  team2: { fontSize: 15, lineHeight: 19, marginTop: 6 },
  scoresCol: { marginRight: 12 },
  scoreLine: { flexDirection: 'row' },
  scoreLineSecond: { marginTop: 6 },
  scoreCell: {
    fontSize: 22,
    lineHeight: 24,
    minWidth: 22,
    textAlign: 'center',
    marginLeft: 6,
  },
  kickoff: {
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    minWidth: 60,
  },
  voirBtn: {
    width: 65,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tvIcon:{
    width: 28,
    height: 28,
  },
  voirLabel: { marginTop: 2, fontSize: 10, letterSpacing: 0.5 },
});
