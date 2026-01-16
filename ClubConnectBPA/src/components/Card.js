import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, SIZES} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Modern Card Component
 * Supports different variants and interactive states
 */
export const Card = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  onPress,
  style,
  headerAction,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevated];
      case 'flat':
        return [styles.card, styles.flat];
      case 'outline':
        return [styles.card, styles.outline];
      default:
        return styles.card;
    }
  };

  const CardContent = (
    <View style={[...getCardStyle(), style]}>
      {(title || icon || headerAction) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon && (
              <View style={styles.iconContainer}>
                <Icon name={icon} size={24} color={COLORS.primary} />
              </View>
            )}
            <View>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          {headerAction}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.cardRadius,
    padding: SIZES.cardPadding,
    marginBottom: SIZES.md,
    ...SIZES.shadow.small,
  },
  elevated: {
    ...SIZES.shadow.large,
  },
  flat: {
    backgroundColor: COLORS.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  outline: {
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.md,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  title: {
    fontSize: SIZES.text.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: SIZES.text.sm,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
});

export default Card;
