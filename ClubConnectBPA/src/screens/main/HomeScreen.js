import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from '../../components/LinearGradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import EventService from '../../services/EventService';
import ClubService from '../../services/ClubService';
import GamificationService from '../../services/GamificationService';
import {COLORS, SIZES} from '../../utils/constants';
import {Card} from '../../components/Card';
import {XPProgressBar} from '../../components/Badge';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const {user, userProfile} = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollY = new Animated.Value(0);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);

    // Load user's clubs
    const clubsResult = await ClubService.getUserClubs(user.uid);
    if (clubsResult.success) {
      setMyClubs(clubsResult.data.slice(0, 5));
    }

    // Load upcoming events
    const eventsResult = await EventService.getUpcomingEvents(user.uid);
    if (eventsResult.success) {
      setUpcomingEvents(eventsResult.data.slice(0, 5));
    }

    // Load user progress (XP & level)
    const progressResult = await GamificationService.getUserProgress(user.uid);
    if (progressResult.success) {
      setUserProgress(progressResult.data);
    }

    // Check daily login bonus
    await GamificationService.checkDailyLogin(user.uid);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDashboardData} />
        }>
        {/* Gradient Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>
          <Animated.View style={[styles.headerContent, {opacity: headerOpacity}]}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{userProfile?.name || 'Student'}! 👋</Text>
            </View>
            
            {/* XP Progress */}
            {userProgress && (
              <View style={styles.xpContainer}>
                <View style={styles.xpHeader}>
                  <View style={styles.levelBadge}>
                    <Icon name="star" size={16} color={COLORS.accent} />
                    <Text style={styles.levelText}>Level {userProgress.level}</Text>
                  </View>
                  <Text style={styles.xpText}>
                    {userProgress.progressInLevel} / {userProgress.nextLevelXP} XP
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(userProgress.progressInLevel / userProgress.nextLevelXP) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </Animated.View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="group" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{myClubs.length}</Text>
            <Text style={styles.statLabel}>My Clubs</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="event" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="emoji-events" size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>{userProgress?.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* My Clubs Carousel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Clubs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyClubs')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          {myClubs.length === 0 ? (
            <Card variant="flat" style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Icon name="group-add" size={48} color={COLORS.textTertiary} />
                <Text style={styles.emptyTitle}>No Clubs Yet</Text>
                <Text style={styles.emptyText}>Join clubs to see them here</Text>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => navigation.navigate('Clubs')}>
                  <Text style={styles.joinButtonText}>Browse Clubs</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clubsCarousel}>
              {myClubs.map((club, index) => (
                <TouchableOpacity
                  key={club.id}
                  style={styles.clubCard}
                  onPress={() =>
                    navigation.navigate('ClubDetail', {clubId: club.id})
                  }>
                  <View style={styles.clubIconLarge}>
                    <Icon name="group" size={32} color={COLORS.primary} />
                  </View>
                  <Text style={styles.clubName} numberOfLines={2}>
                    {club.name}
                  </Text>
                  <View style={styles.clubMeta}>
                    <Icon name="people" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.clubMembers}>{club.memberCount || 0}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Upcoming Events Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {upcomingEvents.length > 0 && (
              <Icon name="calendar-today" size={20} color={COLORS.primary} />
            )}
          </View>

          {upcomingEvents.length === 0 ? (
            <Card variant="flat" style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Icon name="event-available" size={48} color={COLORS.textTertiary} />
                <Text style={styles.emptyTitle}>No Events Scheduled</Text>
                <Text style={styles.emptyText}>Join clubs to see their events</Text>
              </View>
            </Card>
          ) : (
            upcomingEvents.map((event, index) => (
              <Card key={event.id} style={styles.eventCard}>
                <View style={styles.eventContent}>
                  <View style={styles.eventDateBadge}>
                    <Text style={styles.eventDay}>
                      {new Date(event.startDate).getDate()}
                    </Text>
                    <Text style={styles.eventMonth}>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </Text>
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <View style={styles.eventMeta}>
                      <Icon name="access-time" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.eventTime}>
                        {new Date(event.startDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    {event.location && (
                      <View style={styles.eventMeta}>
                        <Icon name="place" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.eventLocation} numberOfLines={1}>
                          {event.location}
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity style={styles.eventAction}>
                    <Icon name="chevron-right" size={24} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Clubs')}>
              <View style={[styles.actionIcon, {backgroundColor: COLORS.primary + '20'}]}>
                <Icon name="search" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionText}>Browse Clubs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('MyClubs')}>
              <View style={[styles.actionIcon, {backgroundColor: COLORS.secondary + '20'}]}>
                <Icon name="favorite" size={28} color={COLORS.secondary} />
              </View>
              <Text style={styles.actionText}>My Clubs</Text>
            </TouchableOpacity>

            {userProfile?.role === 'admin' && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('AdminDashboard')}>
                <View style={[styles.actionIcon, {backgroundColor: COLORS.accent + '20'}]}>
                  <Icon name="dashboard" size={28} color={COLORS.accent} />
                </View>
                <Text style={styles.actionText}>Admin Panel</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}>
              <View style={[styles.actionIcon, {backgroundColor: COLORS.info + '20'}]}>
                <Icon name="emoji-events" size={28} color={COLORS.info} />
              </View>
              <Text style={styles.actionText}>My Badges</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Clubs')}
        activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.fabGradient}>
          <Icon name="add" size={28} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    width: '100%',
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: SIZES.font,
    color: COLORS.white,
    opacity: 0.9,
    fontFamily: 'Inter',
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
    fontFamily: 'Poppins',
  },
  xpContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.cardRadius,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  levelText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  xpText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    padding: 16,
    alignItems: 'center',
    ...SIZES.shadow,
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    fontFamily: 'Poppins',
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'Poppins',
  },
  seeAllText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
    fontWeight: '600',
  },
  clubsCarousel: {
    paddingRight: 20,
  },
  clubCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    ...SIZES.shadow,
  },
  clubIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  clubName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 40,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clubMembers: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  emptyCard: {
    marginVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.buttonRadius,
    marginTop: 8,
  },
  joinButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.font,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDateBadge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Poppins',
  },
  eventMonth: {
    fontSize: 12,
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventTime: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  eventLocation: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    flex: 1,
  },
  eventAction: {
    padding: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    padding: 20,
    alignItems: 'center',
    ...SIZES.shadow,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...SIZES.shadow,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
