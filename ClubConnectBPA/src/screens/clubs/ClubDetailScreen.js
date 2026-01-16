import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import ClubService from '../../services/ClubService';
import EventService from '../../services/EventService';
import AnnouncementService from '../../services/AnnouncementService';

const ClubDetailScreen = ({route, navigation}) => {
  const {clubId} = route.params;
  const {user, userProfile} = useAuth();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadClubData = async () => {
    setLoading(true);

    // Load club details
    const clubResult = await ClubService.getClubById(clubId);
    if (clubResult.success) {
      setClub(clubResult.data);
    }

    // Load events
    const eventsResult = await EventService.getClubEvents(clubId);
    if (eventsResult.success) {
      setEvents(eventsResult.data);
    }

    // Load announcements
    const announcementsResult =
      await AnnouncementService.getClubAnnouncements(clubId);
    if (announcementsResult.success) {
      setAnnouncements(announcementsResult.data);
    }

    // Check membership
    const userClubsResult = await ClubService.getUserClubs(user.uid);
    if (userClubsResult.success) {
      const joined = userClubsResult.data.some(c => c.id === clubId);
      setIsMember(joined);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadClubData();
  }, [clubId]);

  const handleJoinLeave = async () => {
    setActionLoading(true);

    let result;
    if (isMember) {
      result = await ClubService.leaveClub(clubId, user.uid);
    } else {
      result = await ClubService.joinClub(clubId, user.uid);
    }

    setActionLoading(false);

    if (result.success) {
      setIsMember(!isMember);
      Alert.alert('Success', isMember ? 'Left club' : 'Joined club!');
      loadClubData();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const isAdmin = club?.adminId === user.uid || userProfile?.role === 'admin';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.clubIconLarge}>
          <Icon name="group" size={48} color="#2196F3" />
        </View>
        <Text style={styles.clubName}>{club?.name}</Text>
        <Text style={styles.memberCount}>
          {club?.memberCount || 0} members
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, isMember && styles.buttonSecondary]}
          onPress={handleJoinLeave}
          disabled={actionLoading}>
          {actionLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon
                name={isMember ? 'check' : 'add'}
                size={20}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {isMember ? 'Joined' : 'Join Club'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() =>
              navigation.navigate('AdminDashboard', {clubId: clubId})
            }>
            <Icon name="settings" size={20} color="#2196F3" />
            <Text style={styles.adminButtonText}>Manage</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {club?.description || 'No description available'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming events</Text>
        ) : (
          events.slice(0, 3).map((event, index) => (
            <View key={index} style={styles.eventCard}>
              <Icon name="event" size={20} color="#2196F3" />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.startDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>
        {announcements.length === 0 ? (
          <Text style={styles.emptyText}>No announcements</Text>
        ) : (
          announcements.slice(0, 3).map((announcement, index) => (
            <View key={index} style={styles.announcementCard}>
              <Text style={styles.announcementTitle}>
                {announcement.title}
              </Text>
              <Text style={styles.announcementContent}>
                {announcement.content}
              </Text>
              <Text style={styles.announcementDate}>
                {new Date(
                  announcement.createdAt?.toDate(),
                ).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clubIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  adminButton: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 5,
  },
  adminButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventInfo: {
    marginLeft: 10,
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  announcementCard: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  announcementContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  announcementDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ClubDetailScreen;
