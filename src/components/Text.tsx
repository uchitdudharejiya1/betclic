import React from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import {FONTS} from '../assets';
import {useTheme} from '../hooks/useTheme';

type Variant =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

export type TextProps = RNTextProps & {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  align?: TextStyle['textAlign'];
};

const FONT_BY_WEIGHT: Record<Weight, string> = {
  regular: FONTS.LATO_REGULAR,
  medium: FONTS.LATO_MEDIUM,
  semibold: FONTS.LATO_SEMIBOLD,
  bold: FONTS.LATO_BOLD,
  black: FONTS.LATO_BLACK,
};

const VARIANT_STYLE: Record<Variant, TextStyle> = {
  display: {fontSize: 28, lineHeight: 34},
  title: {fontSize: 18, lineHeight: 24},
  subtitle: {fontSize: 15, lineHeight: 20},
  body: {fontSize: 14, lineHeight: 20},
  caption: {fontSize: 12, lineHeight: 16},
  label: {fontSize: 11, lineHeight: 14},
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color,
  align,
  style,
  children,
  ...rest
}) => {
  const {colors} = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        VARIANT_STYLE[variant],
        {fontFamily: FONT_BY_WEIGHT[weight], color: color ?? colors.textPrimary, textAlign: align},
        style,
      ]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
