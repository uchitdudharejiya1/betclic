import React, {useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import type {LeagueMatch} from '../constants/leagueMatches';
import {useTheme} from '../hooks/useTheme';
import {ExpandedMatchRow} from './ExpandedMatchRow';
import {Text} from './Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type CollapsibleLeagueCardProps = {
  league: string;
  matches: LeagueMatch[];
};

export const CollapsibleLeagueCard: React.FC<CollapsibleLeagueCardProps> = ({
  league,
  matches,
}) => {
  const {colors} = useTheme();
  const [expanded, setExpanded] = useState(false);

  const liveCount = matches.filter(m => m.status === 'live').length;
  const totalCount = matches.length;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(p => !p);
  };

  return (
    <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
      <TouchableOpacity activeOpacity={0.85} onPress={toggle} style={styles.headerRow}>
        <Text variant="body" weight="bold" color={colors.textPrimary} numberOfLines={1} style={styles.title}>
          {league}
        </Text>

        {liveCount > 0 ? (
          <View style={[styles.liveBadge, {backgroundColor: 'rgba(225,0,20,0.18)'}]}>
            <Text variant="label" weight="bold" color={colors.primary}>
              {liveCount} EN DIRECT
            </Text>
          </View>
        ) : null}

        <Text variant="caption" color={colors.textMuted} style={styles.count}>
          {totalCount} match{totalCount > 1 ? 's' : ''}
        </Text>

        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={[styles.body, {borderTopColor: colors.border}]}>
          {matches.map((m, i) => (
            <ExpandedMatchRow key={i} match={m} isLast={i === matches.length - 1} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  title: {flex: 1, marginRight: 8},
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  count: {marginRight: 8},
  body: {
    borderTopWidth: 1,
  },
});
