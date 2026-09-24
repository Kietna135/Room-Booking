import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { X, CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Booking } from '../types';
import { formatVietnameseDate } from '../utils/dateUtils';

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  booking: Booking | null;
  onCheckIn: (bookingId: string) => boolean;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  booking,
  onCheckIn,
}) => {
  if (!booking) return null;

  const isCheckedIn = booking.status === 'CHECKED_IN';
  const isCancelled = booking.status === 'CANCELLED';

  const handleSimulateCheckIn = () => {
    const success = onCheckIn(booking.id);
    if (success) {
      Alert.alert(
        '🎉 Check-in thành công!',
        `Cửa phòng ${booking.roomName} đã được mở khóa tự động. Chúc bạn có buổi học hiệu quả!`
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ShieldCheck size={20} color={Colors.primary} />
              <Text style={styles.title}>Thẻ vào phòng điện tử</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Pass Body */}
          <View style={styles.passCard}>
            {/* Status Strip */}
            <View
              style={[
                styles.statusStrip,
                isCheckedIn && styles.statusStripCheckedIn,
                isCancelled && styles.statusStripCancelled,
              ]}
            >
              <Text style={styles.statusStripText}>
                {isCheckedIn
                  ? 'ĐÃ CHECK-IN • ĐANG SỬ DỤNG PHÒNG'
                  : isCancelled
                  ? 'ĐÃ HỦY ĐẶT CHỖ'
                  : 'MÃ HỢP LỆ • SẴN SÀNG QUÉT MÃ'}
              </Text>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrWrapper}>
              <QRCode
                value={booking.qrCodeData || `CAMPUS:${booking.id}`}
                size={180}
                color={isCheckedIn ? Colors.successDark : Colors.textPrimary}
                backgroundColor="#FFFFFF"
                logoSize={32}
                logoMargin={2}
                logoBorderRadius={16}
              />
              <Text style={styles.bookingCodeText}>Mã: {booking.id}</Text>
            </View>

            {/* Booking Details */}
            <View style={styles.infoSection}>
              <Text style={styles.roomName}>{booking.roomName}</Text>
              
              <View style={styles.metaRow}>
                <MapPin size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText}>
                  Tòa {booking.building} • Phòng {booking.roomNumber}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Clock size={13} color={Colors.textSecondary} />
                <Text style={styles.metaText}>
                  {booking.slotLabel} • {formatVietnameseDate(booking.date)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.studentInfoRow}>
                <View>
                  <Text style={styles.labelMuted}>Sinh viên đại diện</Text>
                  <Text style={styles.valueBold}>{booking.userName}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.labelMuted}>Mã số SV</Text>
                  <Text style={styles.valueBold}>{booking.studentId}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Button: Check In */}
          {!isCheckedIn && !isCancelled && (
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={handleSimulateCheckIn}
              activeOpacity={0.8}
            >
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.checkInButtonText}>
                Quét mã nhận phòng (Check-in ngay)
              </Text>
            </TouchableOpacity>
          )}

          {isCheckedIn && (
            <View style={styles.successNotice}>
              <Sparkles size={16} color={Colors.successDark} />
              <Text style={styles.successNoticeText}>
                Bạn đã check-in thành công vào lúc ca học bắt đầu!
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    alignItems: 'center',
  },
  statusStrip: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statusStripCheckedIn: {
    backgroundColor: Colors.success,
  },
  statusStripCancelled: {
    backgroundColor: Colors.danger,
  },
  statusStripText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bookingCodeText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  studentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelMuted: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  valueBold: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.success,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkInButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.successLight,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  successNoticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.successDark,
  },
});
