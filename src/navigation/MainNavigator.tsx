import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Search, CalendarDays, User as UserIcon, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { HomeScreen } from '../screens/HomeScreen';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { NotificationService } from '../services/notificationService';

type Tab = 'EXPLORE' | 'MY_BOOKINGS' | 'PROFILE';

export const MainNavigator: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('EXPLORE');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const currentUser = useBookingStore(state => state.currentUser);
  const isAuthenticated = useBookingStore(state => state.isAuthenticated);
  const bookings = useBookingStore(state => state.bookings);
  const initFirebaseSync = useBookingStore(state => state.initFirebaseSync);

  // Request notification permissions and initialize Firebase Sync on app mount
  useEffect(() => {
    NotificationService.requestPermissions();
    initFirebaseSync();
  }, []);

  const activeBookingsCount = bookings.filter(
    b => b.userId === currentUser.id && (b.status === 'CONFIRMED' || b.status === 'CHECKED_IN')
  ).length;

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBackToExplore = () => {
    setSelectedRoom(null);
  };

  const handleBookingSuccessNavigate = () => {
    setSelectedRoom(null);
    setCurrentTab('MY_BOOKINGS');
  };

  // If not authenticated, display login & registration screen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    if (selectedRoom) {
      return (
        <RoomDetailScreen
          room={selectedRoom}
          onBack={handleBackToExplore}
          onBookingSuccessNavigate={handleBookingSuccessNavigate}
        />
      );
    }

    switch (currentTab) {
      case 'EXPLORE':
        return (
          <HomeScreen
            onSelectRoom={handleSelectRoom}
            onNavigateBookings={() => setCurrentTab('MY_BOOKINGS')}
          />
        );
      case 'MY_BOOKINGS':
        return <MyBookingsScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Content */}
      <View style={styles.screenContainer}>{renderContent()}</View>

      {/* Bottom Navigation Bar (Hidden when inside Room Detail to give full immersion) */}
      {!selectedRoom && (
        <View style={styles.bottomNav}>
          {/* Tab 1: Explore */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('EXPLORE')}
            activeOpacity={0.8}
          >
            <Search
              size={20}
              color={currentTab === 'EXPLORE' ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'EXPLORE' && styles.navLabelActive,
              ]}
            >
              Phòng học
            </Text>
          </TouchableOpacity>

          {/* Tab 2: My Bookings */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('MY_BOOKINGS')}
            activeOpacity={0.8}
          >
            <View style={styles.iconBadgeWrapper}>
              <CalendarDays
                size={20}
                color={currentTab === 'MY_BOOKINGS' ? Colors.primary : Colors.textMuted}
              />
              {activeBookingsCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{activeBookingsCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.navLabel,
                currentTab === 'MY_BOOKINGS' && styles.navLabelActive,
              ]}
            >
              Lịch của tôi
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Profile */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('PROFILE')}
            activeOpacity={0.8}
          >
            <UserIcon
              size={20}
              color={currentTab === 'PROFILE' ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'PROFILE' && styles.navLabelActive,
              ]}
            >
              Hồ sơ SV
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  iconBadgeWrapper: {
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
