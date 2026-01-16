import React from 'react';
import {View} from 'react-native';

// Simple gradient replacement for Expo Go
// Uses the first color as a solid background
// For production, use expo-linear-gradient or react-native-linear-gradient with custom dev client
const LinearGradient = ({colors, style, children, start, end, ...props}) => (
  <View style={[style, {backgroundColor: colors[0] || '#4F46E5'}]} {...props}>
    {children}
  </View>
);

export default LinearGradient;
