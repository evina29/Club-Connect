import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {COLORS, SIZES} from '../../utils/constants';
import LinearGradient from '../../components/LinearGradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Join Clubs',
    description: 'Discover and join clubs that match your interests and passions',
    icon: 'group-add',
    color: COLORS.primary,
  },
  {
    key: '2',
    title: 'Stay Connected',
    description: 'Never miss an event with real-time notifications and updates',
    icon: 'notifications-active',
    color: COLORS.secondary,
  },
  {
    key: '3',
    title: 'Grow Together',
    description: 'Track your participation, earn badges, and become a leader',
    icon: 'trending-up',
    color: COLORS.accent,
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderSlide = ({item, index}) => (
    <View style={[styles.slide, {width}]}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            {backgroundColor: item.color + '20'},
          ]}>
          <Icon name={item.icon} size={80} color={item.color} />
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        const scale = scrollX.interpolate({
          inputRange: [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity,
                transform: [{scale}],
                backgroundColor:
                  index === currentIndex ? COLORS.primary : COLORS.textTertiary,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Club Connect</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        keyExtractor={item => item.key}
      />

      {renderDots()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Icon name="arrow-forward" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.lg,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: SIZES.text.base,
    color: COLORS.white,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding.xl,
  },
  iconContainer: {
    marginBottom: 60,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footer: {
    paddingHorizontal: SIZES.padding.lg,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SIZES.shadow.large,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
});

export default OnboardingScreen;
