import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import LinearGradient from '../../components/LinearGradient';

const SplashScreen = ({onFinish}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // Bounce animation after fade in
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        // Navigate to onboarding after animations
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1000);
      });
    });
  }, []);

  return (
    <LinearGradient colors={['#4F46E5', '#22C55E']} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}>
        {/* Logo - Two interlocking circles forming CC */}
        <View style={styles.logoContainer}>
          <View style={[styles.circle, styles.circleLeft]} />
          <View style={[styles.circle, styles.circleRight]} />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Club Connect</Text>

        {/* Subtext */}
        <Text style={styles.subtext}>Your all-in-one student hub</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 80,
    position: 'relative',
    marginBottom: 24,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    position: 'absolute',
  },
  circleLeft: {
    left: 0,
    top: 10,
  },
  circleRight: {
    right: 0,
    top: 10,
  },
  appName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default SplashScreen;
