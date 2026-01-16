import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
import ClubService from '../../services/ClubService';

const MyClubsScreen = ({navigation}) => {
  const {user} = useAuth();
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMyClubs = async () => {
    setLoading(true);
    const result = await ClubService.getUserClubs(user.uid);
    if (result.success) {
      setMyClubs(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMyClubs();
  }, []);

  const renderClubItem = ({item}) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => navigation.navigate('ClubDetail', {clubId: item.id})}>
      <View style={styles.clubIcon}>
        <Icon name="group" size={32} color="#E91E63" />
      </View>
      <View style={styles.clubInfo}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.clubDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.clubMeta}>
          <Icon name="people" size={16} color="#666" />
          <Text style={styles.memberCount}>
            {item.memberCount || 0} members
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myClubs}
        renderItem={renderClubItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMyClubs} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="favorite-border" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Clubs Yet</Text>
            <Text style={styles.emptyText}>
              Join clubs to see them here
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Clubs')}>
              <Text style={styles.browseButtonText}>Browse Clubs</Text>
            </TouchableOpacity>
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
  listContent: {
    padding: 15,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clubIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
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
    marginTop: 5,
  },
  browseButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyClubsScreen;
