import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  CheckCircle2,
  Users,
  Inbox,
  AlertCircle,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Booking, BookingStatus } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { Badge } from '../components/Badge';
import { QRCodeModal } from '../components/QRCodeModal';
import { formatVietnameseDate } from '../utils/dateUtils';

type TabType = 'UPCOMING' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export const MyBookingsScreen: React.FC = () => {
  const currentUser = useBookingStore(state => state.currentUser);
  const bookings = useBookingStore(state => state.bookings);
  const cancelBooking = useBookingStore(state => state.cancelBooking);
  const checkInBooking = useBookingStore(state => state.checkInBooking);

  const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
  const [selectedQRBooking, setSelectedQRBooking] = useState<Booking | null>(null);

  // Filter bookings for current logged-in student
  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  const filteredBookings = userBookings.filter(b => {
    switch (activeTab) {
      case 'UPCOMING':
        return b.status === 'CONFIRMED';
      case 'CHECKED_IN':
        return b.status === 'CHECKED_IN';
      case 'COMPLETED':
        return b.status === 'COMPLETED';
      case 'CANCELLED':
        return b.status === 'CANCELLED';
      default:
        return true;
    }
  });

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Hủy đặt phòng?',
      `Bạn có chắc chắn muốn hủy lịch đặt ${booking.roomName} (${booking.slotLabel}) ngày ${formatVietnameseDate(booking.date)} không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Đồng ý hủy',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelBooking(booking.id);
            if (success) {
              Alert.alert('Đã hủy đặt phòng', 'Khung giờ này đã được giải phóng cho các bạn sinh viên khác.');
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge label="Đã xác nhận" variant="primary" size="sm" />;
      case 'CHECKED_IN':
        return <Badge label="Đang sử dụng" variant="success" size="sm" />;
      case 'COMPLETED':
        return <Badge label="Đã hoàn thành" variant="neutral" size="sm" />;
      case 'CANCELLED':
        return <Badge label="Đã hủy" variant="danger" size="sm" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cardBg} />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch đặt của tôi</Text>
        <Text style={styles.headerSubtitle}>
          Sinh viên: {currentUser.name} ({currentUser.studentId})
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'UPCOMING' && styles.tabBtnActive]}
          onPress={() => setActiveTab('UPCOMING')}
        >
          <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.tabTextActive]}>
            Sắp tới ({userBookings.filter(b => b.status === 'CONFIRMED').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'CHECKED_IN' && styles.tabBtnActive]}
          onPress={() => setActiveTab('CHECKED_IN')}
        >
          <Text style={[styles.tabText, activeTab === 'CHECKED_IN' && styles.tabTextActive]}>
            Đã vào ({userBookings.filter(b => b.status === 'CHECKED_IN').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'CANCELLED' && styles.tabBtnActive]}
          onPress={() => setActiveTab('CANCELLED')}
        >
          <Text style={[styles.tabText, activeTab === 'CANCELLED' && styles.tabTextActive]}>
            Đã hủy ({userBookings.filter(b => b.status === 'CANCELLED').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Inbox size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có lịch đặt phòng nào</Text>
            <Text style={styles.emptyDesc}>
              Khám phá các phòng học và chọn ca học phù hợp với nhóm của bạn
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            {/* Top Bar of Card */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.bookingIdText}>Mã: {item.id}</Text>
                <Text style={styles.roomName}>{item.roomName}</Text>
              </View>
              {getStatusBadge(item.status)}
            </View>

            {/* Details */}
            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <MapPin size={14} color={Colors.primary} />
                <Text style={styles.detailText}>
                  Tòa {item.building} • Phòng {item.roomNumber}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Calendar size={14} color={Colors.primary} />
                <Text style={styles.detailText}>
                  {formatVietnameseDate(item.date)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Clock size={14} color={Colors.primary} />
                <Text style={styles.detailText}>
                  {item.slotLabel} (Ca 2 tiếng)
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Users size={14} color={Colors.primary} />
                <Text style={styles.detailText}>
                  Số lượng: {item.attendeeCount} sinh viên
                </Text>
              </View>
            </View>

            {/* Purpose */}
            {item.purpose ? (
              <View style={styles.purposeBox}>
                <Text style={styles.purposeLabel}>Mục đích:</Text>
                <Text style={styles.purposeText} numberOfLines={2}>
                  {item.purpose}
                </Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View style={styles.cardActions}>
              {item.status !== 'CANCELLED' && (
                <TouchableOpacity
                  style={styles.qrPassButton}
                  onPress={() => setSelectedQRBooking(item)}
                  activeOpacity={0.8}
                >
                  <QrCode size={16} color="#FFFFFF" />
                  <Text style={styles.qrPassButtonText}>
                    {item.status === 'CHECKED_IN' ? 'Xem Thẻ QR' : 'Mở Mã QR Check-in'}
                  </Text>
                </TouchableOpacity>
              )}

              {item.status === 'CONFIRMED' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item)}
                  activeOpacity={0.8}
                >
                  <XCircle size={16} color={Colors.danger} />
                  <Text style={styles.cancelButtonText}>Hủy ca</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* QR Code Pass Modal */}
      <QRCodeModal
        visible={Boolean(selectedQRBooking)}
        onClose={() => setSelectedQRBooking(null)}
        booking={selectedQRBooking}
        onCheckIn={checkInBooking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 14,
  },
  bookingCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 10,
    marginBottom: 10,
  },
  bookingIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  cardDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  purposeBox: {
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  purposeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  purposeText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  qrPassButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  qrPassButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.dangerLight,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dangerDark,
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
});
