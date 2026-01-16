import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';

const ProfileScreen = ({navigation}) => {
  const {user, userProfile, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const ProfileOption = ({icon, title, onPress, color = '#333'}) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Icon name={icon} size={24} color={color} />
      <Text style={[styles.optionText, {color}]}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={48} color="#2196F3" />
        </View>
        <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {userProfile?.role === 'admin' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ProfileOption
          icon="edit"
          title="Edit Profile"
          onPress={() => {
            // TODO: Implement edit profile
            Alert.alert('Coming Soon', 'Edit profile feature coming soon!');
          }}
        />
        <ProfileOption
          icon="lock"
          title="Change Password"
          onPress={() => {
            // TODO: Implement change password
            Alert.alert('Coming Soon', 'Change password feature coming soon!');
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <ProfileOption
          icon="event"
          title="My Attendance"
          onPress={() => {
            // TODO: Implement view attendance
            Alert.alert('Coming Soon', 'Attendance tracking coming soon!');
          }}
        />
        <ProfileOption
          icon="emoji-events"
          title="My Achievements"
          onPress={() => {
            // TODO: Implement achievements
            Alert.alert('Coming Soon', 'Achievements coming soon!');
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <ProfileOption
          icon="notifications"
          title="Notifications"
          onPress={() => {
            Alert.alert('Coming Soon', 'Notification settings coming soon!');
          }}
        />
        <ProfileOption
          icon="help"
          title="Help & Support"
          onPress={() => {
            Alert.alert('Help', 'Contact support@clubconnect.com for help');
          }}
        />
        <ProfileOption
          icon="info"
          title="About"
          onPress={() => {
            Alert.alert(
              'Club Connect',
              'Version 1.0.0\nStudent Organization Hub\n\nDeveloped for BPA Mobile Application Development',
            );
          }}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Club Connect v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 Student Organization Hub</Text>
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
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default ProfileScreen;
