import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Room, BuildingType } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { RoomCard, ROOM_CARD_HEIGHT, ROOM_CARD_MARGIN_BOTTOM } from '../components/RoomCard';
import { FilterHeader } from '../components/FilterHeader';
import { FilterModal } from '../components/FilterModal';
import { UserSwitcherModal } from '../components/UserSwitcherModal';
import { Users, Sparkles, Building2, SearchX } from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../navigation/types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp<'Explore'>>();
  const currentUser = useBookingStore(state => state.currentUser);
  const users = useBookingStore(state => state.users);
  const switchUser = useBookingStore(state => state.switchUser);
  const filters = useBookingStore(state => state.filters);
  const setSearchQuery = useBookingStore(state => state.setSearchQuery);
  const setSelectedBuilding = useBookingStore(state => state.setSelectedBuilding);
  const setStatusFilter = useBookingStore(state => state.setStatusFilter);
  const setCapacityRange = useBookingStore(state => state.setCapacityRange);
  const toggleAmenityFilter = useBookingStore(state => state.toggleAmenityFilter);
  const resetFilters = useBookingStore(state => state.resetFilters);
  const getRoomCurrentStatus = useBookingStore(state => state.getRoomCurrentStatus);
  const getFilteredRooms = useBookingStore(state => state.getFilteredRooms);
  const bookings = useBookingStore(state => state.bookings);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  // Active bookings count for current user
  const userActiveBookingsCount = useMemo(() => {
    return bookings.filter(
      b => b.userId === currentUser.id && (b.status === 'CONFIRMED' || b.status === 'CHECKED_IN')
    ).length;
  }, [bookings, currentUser.id]);

  const filteredRooms = getFilteredRooms();

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minCapacity > 2 || filters.maxCapacity < 20) count++;
    if (filters.selectedAmenities.length > 0) count += filters.selectedAmenities.length;
    return count;
  }, [filters]);

  // Optimized FlatList renderItem with useCallback
  const renderRoomItem = useCallback(
    ({ item }: { item: Room }) => {
      const currentStatus = getRoomCurrentStatus(item.id);
      return (
        <RoomCard
          room={item}
          currentStatus={currentStatus}
          onPress={(room) => navigation.navigate('RoomDetail', { room })}
        />
      );
    },
    [getRoomCurrentStatus, navigation]
  );

  // Optimized keyExtractor
  const keyExtractor = useCallback((item: Room) => item.id, []);

  // Fixed getItemLayout for 60 FPS smooth scrolling
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROOM_CARD_HEIGHT + ROOM_CARD_MARGIN_BOTTOM,
      offset: (ROOM_CARD_HEIGHT + ROOM_CARD_MARGIN_BOTTOM) * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBg} />

      {/* Top App Bar with User Header */}
      <View style={styles.topHeader}>
        <View style={styles.appTitleCol}>
          <View style={styles.brandRow}>
            <Building2 size={20} color={Colors.primary} />
            <Text style={styles.brandTitle}>SmartCampus</Text>
            <View style={styles.betaBadge}>
              <Text style={styles.betaBadgeText}>ROOMS</Text>
            </View>
          </View>
          <Text style={styles.greetingText}>
            Xin chào, <Text style={styles.greetingName}>{currentUser.name}</Text>
          </Text>
        </View>

        {/* User Switcher Pill & Avatar */}
        <TouchableOpacity
          style={styles.userProfilePill}
          onPress={() => setIsUserSwitcherOpen(true)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
          <View style={styles.userPillTextCol}>
            <Text style={styles.userPillName} numberOfLines={1}>
              {currentUser.studentId}
            </Text>
            <Text style={styles.userPillRole}>Đổi TK</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Header with Search, Building Pills, and Status Filter */}
      <FilterHeader
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        selectedBuilding={filters.selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        statusFilter={filters.statusFilter}
        onSelectStatusFilter={setStatusFilter}
        activeFilterCount={activeFilterCount}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
      />

      {/* Room Count & Fast Access Banner */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          Tìm thấy <Text style={styles.countHighlight}>{filteredRooms.length}</Text> phòng học phù hợp
        </Text>

        {userActiveBookingsCount > 0 && (
          <TouchableOpacity
            style={styles.activeBookingsChip}
            onPress={() => navigation.navigate('MyBookings')}
            activeOpacity={0.8}
          >
            <Sparkles size={12} color={Colors.primaryDark} />
            <Text style={styles.activeBookingsChipText}>
              {userActiveBookingsCount} lịch của bạn
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 60 FPS Optimized FlatList */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoomItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={7}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <SearchX size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptyDesc}>
              Thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={resetFilters}
            >
              <Text style={styles.resetFilterBtnText}>Đặt lại bộ lọc</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modals */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        minCapacity={filters.minCapacity}
        maxCapacity={filters.maxCapacity}
        selectedAmenities={filters.selectedAmenities}
        onApply={({ minCapacity, maxCapacity, selectedAmenities }) => {
          setCapacityRange(minCapacity, maxCapacity);
          // Set amenities
          useBookingStore.setState(state => ({
            filters: { ...state.filters, selectedAmenities },
          }));
        }}
        onReset={resetFilters}
      />

      <UserSwitcherModal
        visible={isUserSwitcherOpen}
        onClose={() => setIsUserSwitcherOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUser={switchUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.cardBg,
  },
  appTitleCol: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  betaBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  betaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  greetingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  greetingName: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 4,
    paddingRight: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userPillTextCol: {},
  userPillName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  userPillRole: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
  },
  countBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  countHighlight: {
    fontWeight: '700',
    color: Colors.primary,
  },
  activeBookingsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeBookingsChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  resetFilterBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
