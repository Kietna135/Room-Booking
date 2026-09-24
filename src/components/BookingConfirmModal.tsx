import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Bell,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Room, TimeSlot, Booking } from '../types';
import { formatVietnameseDate } from '../utils/dateUtils';

interface BookingConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  room: Room;
  selectedDate: string;
  slot: TimeSlot;
  studentName: string;
  studentId: string;
  onConfirm: (payload: {
    purpose: string;
    attendeeCount: number;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  onSuccess: (booking: Booking) => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  visible,
  onClose,
  room,
  selectedDate,
  slot,
  studentName,
  studentId,
  onConfirm,
  onSuccess,
}) => {
  const [purpose, setPurpose] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBooking = async () => {
    setLoading(true);
    setErrorMessage(null);

    const result = await onConfirm({
      purpose: purpose.trim() || 'Học nhóm & Nghiên cứu đồ án',
      attendeeCount,
    });

    setLoading(false);

    if (result.success && result.booking) {
      onClose();
      onSuccess(result.booking);
    } else {
      setErrorMessage(result.error || 'Đã xảy ra lỗi khi đặt phòng.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Xác nhận đặt phòng</Text>
              <Text style={styles.subtitle}>Kiểm tra thông tin trước khi giữ chỗ</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Details Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.roomName}>{room.name}</Text>
            
            <View style={styles.detailRow}>
              <MapPin size={14} color={Colors.primary} />
              <Text style={styles.detailText}>
                Tòa {room.building} • Tầng {room.floor} • Phòng {room.roomNumber}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Calendar size={14} color={Colors.primary} />
              <Text style={styles.detailText}>
                Ngày: {formatVietnameseDate(selectedDate)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Clock size={14} color={Colors.primary} />
              <Text style={styles.detailText}>
                Khung giờ: {slot?.label} (2 tiếng)
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Users size={14} color={Colors.primary} />
              <Text style={styles.detailText}>
                Người đặt: {studentName} ({studentId})
              </Text>
            </View>
          </View>

          {/* Purpose Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mục đích sử dụng phòng</Text>
            <TextInput
              style={styles.textInput}
              placeholder="VD: Học nhóm Đồ án Tốt nghiệp, Làm bài tập lớn..."
              placeholderTextColor={Colors.textMuted}
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>

          {/* Attendees Selector */}
          <View style={styles.inputGroup}>
            <View style={styles.attendeeHeader}>
              <Text style={styles.inputLabel}>Số lượng sinh viên tham gia</Text>
              <Text style={styles.attendeeCountText}>{attendeeCount} / {room.capacity} SV</Text>
            </View>
            <View style={styles.attendeeCounterRow}>
              {[2, 4, 6, 8, Math.min(room.capacity, 12)].filter((v, i, a) => v <= room.capacity && a.indexOf(v) === i).map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numChip,
                    attendeeCount === num && styles.numChipSelected,
                  ]}
                  onPress={() => setAttendeeCount(num)}
                >
                  <Text
                    style={[
                      styles.numChipText,
                      attendeeCount === num && styles.numChipTextSelected,
                    ]}
                  >
                    {num} người
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Local Notification Notice */}
          <View style={styles.noticeBox}>
            <Bell size={16} color={Colors.primary} />
            <Text style={styles.noticeText}>
              Hệ thống sẽ gửi thông báo check-in trước giờ học <Text style={{ fontWeight: '700' }}>15 phút</Text> tới thiết bị của bạn.
            </Text>
          </View>

          {/* Error Message if Conflict Detected */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={Colors.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Quay lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, loading && styles.btnDisabled]}
              onPress={handleBooking}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Xác nhận đặt ngay</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  attendeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attendeeCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  attendeeCounterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  numChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  numChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  numChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  numChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.dangerDark,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
