import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Animated,
} from 'react-native';
import LinearGradient from '../../components/LinearGradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClubService from '../../services/ClubService';
import {Card} from '../../components/Card';
import {COLORS, SIZES} from '../../utils/constants';

const ClubListScreen = ({navigation}) => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Academic', 'Sports', 'Arts', 'Service', 'Social'];

  const loadClubs = async () => {
    setLoading(true);
    const result = await ClubService.getAllClubs();
    if (result.success) {
      setClubs(result.data);
      setFilteredClubs(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    let filtered = clubs;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        club =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(club => club.category === selectedCategory);
    }

    setFilteredClubs(filtered);
  }, [searchQuery, selectedCategory, clubs]);

  const renderCategoryChip = ({item}) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item)}>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderClubItem = ({item}) => (
    <Card style={styles.clubCard}>
      <TouchableOpacity
        style={styles.clubCardContent}
        onPress={() => navigation.navigate('ClubDetail', {clubId: item.id})}
        activeOpacity={0.7}>
        <View style={styles.clubIconWrapper}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.clubIconGradient}>
            <Icon name="group" size={32} color={COLORS.white} />
          </LinearGradient>
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Icon name="star" size={12} color={COLORS.accent} />
            </View>
          )}
        </View>
        
        <View style={styles.clubInfo}>
          <Text style={styles.clubName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
          )}
          <Text style={styles.clubDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.clubMeta}>
            <View style={styles.metaItem}>
              <Icon name="people" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>
                {item.memberCount || 0} members
              </Text>
            </View>
            {item.meetingDay && (
              <View style={styles.metaItem}>
                <Icon name="event" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>{item.meetingDay}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.clubAction}>
          <Icon name="chevron-right" size={24} color={COLORS.textTertiary} />
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Gradient Header with Search */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}>
        <Text style={styles.headerTitle}>Discover Clubs</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryChip}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Clubs List */}
      <FlatList
        data={filteredClubs}
        renderItem={renderClubItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadClubs}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon 
              name={searchQuery ? "search-off" : "group-add"} 
              size={64} 
              color={COLORS.textTertiary} 
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No Results Found' : 'No Clubs Yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Clubs will appear here once created'}
            </Text>
          </View>
        }
      />
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SIZES.buttonRadius,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.text,
    padding: 0,
  },
  categoryContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  clubCard: {
    marginBottom: 16,
  },
  clubCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubIconWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  clubIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SIZES.shadow,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: SIZES.tiny,
    color: COLORS.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clubDescription: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: SIZES.tiny,
    color: COLORS.textSecondary,
  },
  clubAction: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});

export default ClubListScreen;
