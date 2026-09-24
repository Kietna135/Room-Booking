import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = React.memo(({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: Colors.primaryLight,
          text: Colors.primaryDark,
          border: 'transparent',
        };
      case 'success':
        return {
          bg: Colors.successLight,
          text: Colors.successDark,
          border: 'transparent',
        };
      case 'warning':
        return {
          bg: Colors.warningLight,
          text: Colors.warningDark,
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: Colors.dangerLight,
          text: Colors.dangerDark,
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: Colors.textSecondary,
          border: Colors.border,
        };
      case 'neutral':
      default:
        return {
          bg: Colors.surface,
          text: Colors.textSecondary,
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          fontSize: 11,
          borderRadius: 4,
        };
      case 'lg':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          borderRadius: 8,
        };
      case 'md':
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
          borderRadius: 6,
        };
    }
  };

  const vStyle = getVariantStyles();
  const sStyle = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: vStyle.bg,
          borderColor: vStyle.border,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sStyle.paddingVertical,
          paddingHorizontal: sStyle.paddingHorizontal,
          borderRadius: sStyle.borderRadius,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.badgeText,
          { color: vStyle.text, fontSize: sStyle.fontSize },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '600',
  },
});
