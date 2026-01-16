import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, SIZES, GAMIFICATION} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Badge Component for Gamification
 * Displays user achievements and levels
 */
export const Badge = ({type, level, title, description, earned, size = 'medium'}) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'beginner':
        return GAMIFICATION.badges.beginner;
      case 'active':
        return GAMIFICATION.badges.active;
      case 'superstar':
        return GAMIFICATION.badges.superstar;
      case 'legend':
        return GAMIFICATION.badges.legend;
      default:
        return COLORS.textTertiary;
    }
  };

  const getBadgeIcon = () => {
    switch (type) {
      case 'beginner':
        return 'star-border';
      case 'active':
        return 'star-half';
      case 'superstar':
        return 'star';
      case 'legend':
        return 'military-tech';
      default:
        return 'emoji-events';
    }
  };

  const sizeStyle = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  return (
    <View style={[styles.badge, !earned && styles.locked]}>
      <View
        style={[
          styles.iconCircle,
          sizeStyle,
          {backgroundColor: getBadgeColor() + '20'},
        ]}>
        <Icon
          name={getBadgeIcon()}
          size={size === 'small' ? 24 : size === 'large' ? 48 : 32}
          color={earned ? getBadgeColor() : COLORS.textTertiary}
        />
      </View>
      {title && (
        <Text style={[styles.title, !earned && styles.lockedText]}>{title}</Text>
      )}
      {description && (
        <Text style={[styles.description, !earned && styles.lockedText]}>
          {description}
        </Text>
      )}
      {level && (
        <View style={[styles.levelBadge, {backgroundColor: getBadgeColor()}]}>
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>
      )}
    </View>
  );
};

/**
 * XP Progress Bar
 */
export const XPProgressBar = ({current, target, level}) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpHeader}>
        <Text style={styles.xpLabel}>Level {level}</Text>
        <Text style={styles.xpValue}>
          {current} / {target} XP
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
      </View>
    </View>
  );
};

/**
 * Achievement Notification
 */
export const AchievementUnlocked = ({title, icon, points}) => {
  return (
    <View style={styles.achievement}>
      <View style={styles.achievementIcon}>
        <Icon name={icon || 'emoji-events'} size={32} color={COLORS.accent} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
        <Text style={styles.achievementSubtitle}>{title}</Text>
        {points && (
          <Text style={styles.achievementPoints}>+{points} XP</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.cardBackground,
    margin: SIZES.sm,
    width: 120,
  },
  locked: {
    opacity: 0.4,
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius.full,
    marginBottom: SIZES.sm,
  },
  small: {
    width: 48,
    height: 48,
  },
  medium: {
    width: 64,
    height: 64,
  },
  large: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: SIZES.text.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: SIZES.xs,
  },
  description: {
    fontSize: SIZES.text.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  lockedText: {
    color: COLORS.textTertiary,
  },
  levelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radius.sm,
  },
  levelText: {
    fontSize: SIZES.text.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  xpContainer: {
    padding: SIZES.md,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius.lg,
    ...SIZES.shadow.small,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  xpLabel: {
    fontSize: SIZES.text.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  xpValue: {
    fontSize: SIZES.text.sm,
    color: COLORS.textSecondary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius.full,
  },
  achievement: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    padding: SIZES.md,
    borderRadius: SIZES.radius.lg,
    ...SIZES.shadow.medium,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  achievementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: SIZES.text.sm,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: SIZES.text.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  achievementPoints: {
    fontSize: SIZES.text.sm,
    color: COLORS.textSecondary,
  },
});

export default Badge;
