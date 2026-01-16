import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClubService from '../../services/ClubService';

const ManageMembersScreen = ({route}) => {
  const {clubId} = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    const result = await ClubService.getClubMembers(clubId);
    if (result.success) {
      setMembers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, [clubId]);

  const handleRemoveMember = (memberId, memberName) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the club?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const result = await ClubService.leaveClub(clubId, memberId);
            if (result.success) {
              Alert.alert('Success', 'Member removed');
              loadMembers();
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ],
    );
  };

  const renderMemberItem = ({item}) => (
    <View style={styles.memberCard}>
      <View style={styles.memberIcon}>
        <Icon name="person" size={24} color="#2196F3" />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMember(item.id, item.name)}>
        <Icon name="remove-circle-outline" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {members.length} {members.length === 1 ? 'Member' : 'Members'}
        </Text>
      </View>

      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No members yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  listContent: {
    padding: 15,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  memberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});

export default ManageMembersScreen;
