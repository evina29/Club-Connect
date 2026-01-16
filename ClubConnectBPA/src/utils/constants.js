// 🌈 Modern Campus Minimalism Color Palette
export const COLORS = {
  // Primary Colors
  primary: '#4F46E5',        // Indigo 600 - Main buttons, highlights
  primaryDark: '#4338CA',    // Indigo 700
  primaryLight: '#818CF8',   // Indigo 400
  
  // Secondary Colors
  secondary: '#22C55E',      // Emerald 500 - Success, active states
  secondaryDark: '#16A34A',  // Emerald 600
  secondaryLight: '#4ADE80', // Emerald 400
  
  // Accent Colors
  accent: '#F59E0B',         // Amber 500 - Icons, badges, events
  accentDark: '#D97706',     // Amber 600
  accentLight: '#FCD34D',    // Amber 300
  
  // Status Colors
  success: '#22C55E',        // Emerald 500
  warning: '#F59E0B',        // Amber 500
  error: '#EF4444',          // Red 500
  info: '#3B82F6',           // Blue 500
  
  // Backgrounds
  background: '#F9FAFB',     // Gray 50 - App background
  cardBackground: '#FFFFFF', // White - Cards, containers
  surface: '#F3F4F6',        // Gray 100
  
  // Text Colors
  textPrimary: '#111827',    // Gray 900 - Headings
  textSecondary: '#6B7280',  // Gray 500 - Descriptions
  textTertiary: '#9CA3AF',   // Gray 400 - Subtle text
  textLight: '#D1D5DB',      // Gray 300
  
  // Borders & Dividers
  border: '#E5E7EB',         // Gray 200
  borderLight: '#F3F4F6',    // Gray 100
  
  // Dark Mode Support
  dark: {
    background: '#111827',
    cardBackground: '#1F2937',
    surface: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
  },
  
  // Gradients
  gradients: {
    primary: ['#4F46E5', '#22C55E'],
    sunset: ['#F59E0B', '#EF4444'],
    ocean: ['#3B82F6', '#8B5CF6'],
    card: ['#FFFFFF', '#F9FAFB'],
  },
  
  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// 📏 Design System Sizes
export const SIZES = {
  // Base
  base: 8,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Typography
  text: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    heading: 32,
    display: 40,
  },
  
  // Padding
  padding: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  
  // Border Radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Icons
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Buttons
  button: {
    height: 48,
    heightSmall: 36,
    heightLarge: 56,
  },
  
  // Cards
  cardPadding: 20,
  cardRadius: 24,
  
  // Shadows
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Firebase Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  CLUBS: 'clubs',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  ATTENDANCE: 'attendance',
  MEMBERSHIPS: 'memberships',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// Date Formatting
export const formatDate = date => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = date => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Validation
export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = password => {
  return password.length >= 6;
};
