import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from './LinearGradient';
import {COLORS} from '../utils/constants';

/**
 * Gradient Background Component
 * Used for headers, cards, and backgrounds
 */
export const GradientBackground = ({
  children,
  colors = [COLORS.primary, COLORS.secondary],
  style,
  start = {x: 0, y: 0},
  end = {x: 1, y: 1},
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
