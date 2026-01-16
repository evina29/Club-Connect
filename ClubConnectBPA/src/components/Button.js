import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {COLORS, SIZES} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Modern Button Component
 * Supports primary, secondary, outline, and ghost variants
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    switch (variant) {
      case 'outline':
        return [...baseTextStyle, styles.outlineText];
      case 'ghost':
        return [...baseTextStyle, styles.ghostText];
      default:
        return [...baseTextStyle, styles.whiteText];
    }
  };

  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon
              name={icon}
              size={20}
              color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
              style={styles.iconLeft}
            />
          )}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon
              name={icon}
              size={20}
              color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius.md,
    ...SIZES.shadow.medium,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: COLORS.transparent,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: SIZES.text.base,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  whiteText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
