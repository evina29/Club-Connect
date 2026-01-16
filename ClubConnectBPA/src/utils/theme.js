/**
 * 🎨 Theme Configuration
 * Modern Campus Minimalism Design System
 */

import {COLORS, SIZES} from './constants';

export const theme = {
  colors: COLORS,
  sizes: SIZES,
  
  // Typography Scale
  typography: {
    display: {
      fontSize: SIZES.text.display,
      fontWeight: '700',
      fontFamily: 'Poppins-Bold',
      color: COLORS.textPrimary,
      lineHeight: 48,
    },
    heading: {
      fontSize: SIZES.text.heading,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: COLORS.textPrimary,
      lineHeight: 40,
    },
    title: {
      fontSize: SIZES.text.title,
      fontWeight: '600',
      fontFamily: 'Poppins-SemiBold',
      color: COLORS.textPrimary,
      lineHeight: 36,
    },
    subtitle: {
      fontSize: SIZES.text.xl,
      fontWeight: '500',
      fontFamily: 'Poppins-Medium',
      color: COLORS.textPrimary,
      lineHeight: 28,
    },
    body: {
      fontSize: SIZES.text.base,
      fontWeight: '400',
      fontFamily: 'Inter-Regular',
      color: COLORS.textPrimary,
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: SIZES.text.lg,
      fontWeight: '400',
      fontFamily: 'Inter-Regular',
      color: COLORS.textPrimary,
      lineHeight: 28,
    },
    bodySmall: {
      fontSize: SIZES.text.sm,
      fontWeight: '400',
      fontFamily: 'Inter-Regular',
      color: COLORS.textSecondary,
      lineHeight: 20,
    },
    caption: {
      fontSize: SIZES.text.xs,
      fontWeight: '400',
      fontFamily: 'Inter-Regular',
      color: COLORS.textSecondary,
      lineHeight: 16,
    },
    button: {
      fontSize: SIZES.text.base,
      fontWeight: '600',
      fontFamily: 'Poppins-Medium',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  },
  
  // Component Styles
  components: {
    button: {
      primary: {
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: SIZES.radius.md,
        ...SIZES.shadow.medium,
      },
      secondary: {
        backgroundColor: COLORS.secondary,
        color: COLORS.white,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: SIZES.radius.md,
        ...SIZES.shadow.medium,
      },
      outline: {
        backgroundColor: COLORS.transparent,
        borderWidth: 2,
        borderColor: COLORS.primary,
        color: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: SIZES.radius.md,
      },
      ghost: {
        backgroundColor: COLORS.transparent,
        color: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
      },
    },
    card: {
      default: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.cardRadius,
        padding: SIZES.cardPadding,
        ...SIZES.shadow.small,
      },
      elevated: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.cardRadius,
        padding: SIZES.cardPadding,
        ...SIZES.shadow.large,
      },
      flat: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius.lg,
        padding: SIZES.padding.md,
      },
    },
    input: {
      default: {
        backgroundColor: COLORS.cardBackground,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radius.md,
        padding: SIZES.padding.md,
        fontSize: SIZES.text.base,
        color: COLORS.textPrimary,
      },
      focused: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        ...SIZES.shadow.small,
      },
      error: {
        borderColor: COLORS.error,
        borderWidth: 2,
      },
    },
  },
  
  // Animation Timings
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  // Layout
  layout: {
    container: {
      paddingHorizontal: SIZES.padding.lg,
      paddingVertical: SIZES.padding.md,
    },
    screen: {
      backgroundColor: COLORS.background,
    },
  },
};

// Utility function to create gradient
export const createGradient = (colors, angle = 135) => ({
  colors: colors,
  start: {x: 0, y: 0},
  end: {x: 1, y: 1},
  angle: angle,
});

// Gamification Colors
export const GAMIFICATION = {
  xp: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
  },
  badges: {
    beginner: '#94A3B8',
    active: '#22C55E',
    superstar: '#F59E0B',
    legend: '#8B5CF6',
  },
};

export default theme;
