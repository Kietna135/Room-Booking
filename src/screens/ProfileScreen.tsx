import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import {
  User as UserIcon,
  Bell,
  Clock,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Building,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useBookingStore } from '../store/useBookingStore';
import { UserSwitcherModal } from '../components/UserSwitcherModal';

export const ProfileScreen: React.FC = () => {
  const currentUser = useBookingStore(state => state.currentUser);
  const users = useBookingStore(state => state.users);
  const switchUser = useBookingStore(state => state.switchUser);
  const logout = useBookingStore(state => state.logout);
  const bookings = useBookingStore(state => state.bookings);
  const resetFilters = useBookingStore(state => state.resetFilters);

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const userBookings = bookings.filter(b => b.userId === currentUser.id);
  const activeBookingsCount = userBookings.filter(
    b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBg} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.studentId}>MSSV: {currentUser.studentId}</Text>
            <Text style={styles.department}>{currentUser.department}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.switchUserButton}
            onPress={() => setIsSwitcherOpen(true)}
            activeOpacity={0.8}
          >
            <RotateCcw size={14} color={Colors.primaryDark} />
            <Text style={styles.switchUserButtonText}>Đổi tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* Academic Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.statValue}>
              {(currentUser.totalStudyHours || 20) + userBookings.length * 2}h
            </Text>
            <Text style={styles.statLabel}>Giờ tự học / Lab</Text>
          </View>

          <View style={styles.statBox}>
            <BookOpen size={20} color={Colors.success} />
            <Text style={styles.statValue}>{userBookings.length}</Text>
            <Text style={styles.statLabel}>Lượt đặt phòng</Text>
          </View>

          <View style={styles.statBox}>
            <Sparkles size={20} color={Colors.warning} />
            <Text style={styles.statValue}>{activeBookingsCount}</Text>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
          </View>
        </View>

        {/* Settings & System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Cài đặt thông báo & Nhắc nhở</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={18} color={Colors.primary} />
              <View>
                <Text style={styles.settingTitle}>Nhắc nhở trước 15 phút</Text>
                <Text style={styles.settingDesc}>
                  Gửi thông báo cục bộ kèm mã QR trước khi bắt đầu ca học
                </Text>
              </View>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        {/* Rules & Guidelines */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quy chế Smart Campus</Text>

          <View style={styles.guidelineCard}>
            <ShieldCheck size={20} color={Colors.primary} />
            <View style={styles.guidelineTextCol}>
              <Text style={styles.guidelineTitle}>
                Hệ thống phòng tự học & Hội thảo
              </Text>
              <Text style={styles.guidelineDesc}>
                • Giới hạn mỗi sinh viên đặt tối đa 2 ca học/ngày.{'\n'}
                • Check-in hợp lệ trong khoảng 15 phút trước hoặc sau giờ bắt đầu.{'\n'}
                • Hủy đặt phòng không phạt nếu thực hiện trước 30 phút.
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              'Đăng xuất tài khoản?',
              'Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại không?',
              [
                { text: 'Hủy', style: 'cancel' },
                {
                  text: 'Đăng xuất',
                  style: 'destructive',
                  onPress: () => logout(),
                },
              ]
            );
          }}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>
            Smart Campus Study Space Reservation v1.0.0{'\n'}
            React Native Expo • Zustand Engine • 60 FPS FlatList
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Switcher Modal */}
      <UserSwitcherModal
        visible={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
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
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  studentId: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  department: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  email: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  switchUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 14,
  },
  switchUserButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  guidelineCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    alignItems: 'flex-start',
  },
  guidelineTextCol: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  guidelineDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dangerDark,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  appInfoText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
