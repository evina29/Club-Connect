import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import ClubService from '../../services/ClubService';

const AdminDashboardScreen = ({route, navigation}) => {
  const {clubId} = route.params || {};
  const {user} = useAuth();
  const [club, setClub] = useState(null);
  const [adminClubs, setAdminClubs] = useState([]);

  const loadAdminData = async () => {
    if (clubId) {
      const result = await ClubService.getClubById(clubId);
      if (result.success) {
        setClub(result.data);
      }
    } else {
      // Load all clubs where user is admin
      const allClubsResult = await ClubService.getAllClubs();
      if (allClubsResult.success) {
        const userAdminClubs = allClubsResult.data.filter(
          c => c.adminId === user.uid,
        );
        setAdminClubs(userAdminClubs);
      }
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [clubId]);

  const AdminAction = ({icon, title, color, onPress}) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.actionIcon, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  if (!clubId && adminClubs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="admin-panel-settings" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Admin Access</Text>
        <Text style={styles.emptyText}>
          You don't have admin access to any clubs
        </Text>
      </View>
    );
  }

  if (!clubId) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Your Clubs</Text>
        {adminClubs.map(club => (
          <TouchableOpacity
            key={club.id}
            style={styles.clubCard}
            onPress={() =>
              navigation.push('AdminDashboard', {clubId: club.id})
            }>
            <Icon name="group" size={24} color="#2196F3" />
            <Text style={styles.clubName}>{club.name}</Text>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clubTitle}>{club?.name}</Text>
        <Text style={styles.clubSubtitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.actionGrid}>
        <AdminAction
          icon="people"
          title="Manage Members"
          color="#2196F3"
          onPress={() =>
            navigation.navigate('ManageMembers', {clubId: clubId})
          }
        />
        <AdminAction
          icon="campaign"
          title="New Announcement"
          color="#FF9800"
          onPress={() =>
            navigation.navigate('CreateAnnouncement', {clubId: clubId})
          }
        />
        <AdminAction
          icon="event"
          title="Create Event"
          color="#4CAF50"
          onPress={() => navigation.navigate('CreateEvent', {clubId: clubId})}
        />
        <AdminAction
          icon="edit"
          title="Edit Club"
          color="#9C27B0"
          onPress={() => {
            // TODO: Implement edit club
          }}
        />
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statCard}>
          <Icon name="people" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{club?.memberCount || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  clubTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  clubSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 5,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  statsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  clubName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
});

export default AdminDashboardScreen;
