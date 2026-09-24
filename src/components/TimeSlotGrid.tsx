import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';
import { TimeSlot, Booking } from '../types';
import { TIME_SLOTS, getNext7Days, DayOption } from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from 'lucide-react-native';

interface TimeSlotGridProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  roomId: string;
  currentUserId: string;
  // Conflict and state checkers from Zustand store
  getSlotOccupant: (roomId: string, date: string, slotId: string) => Booking | undefined;
  getUserSlotBooking: (date: string, slotId: string, userId?: string) => Booking | undefined;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedDate,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  roomId,
  currentUserId,
  getSlotOccupant,
  getUserSlotBooking,
}) => {
  const next7Days = getNext7Days();

  return (
    <View style={styles.container}>
      {/* 7-Day Date Picker Strip */}
      <View style={styles.sectionHeader}>
        <Calendar size={16} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Chọn ngày đặt phòng (7 ngày tới)</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScroll}
      >
        {next7Days.map((day: DayOption) => {
          const isSelected = selectedDate === day.dateString;
          return (
            <TouchableOpacity
              key={day.dateString}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                day.isToday && !isSelected && styles.dayCardToday,
              ]}
              onPress={() => onSelectDate(day.dateString)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  isSelected && styles.dayOfWeekTextSelected,
                ]}
              >
                {day.isToday ? 'H.nay' : day.dayOfWeek}
              </Text>
              <Text
                style={[
                  styles.dayNumberText,
                  isSelected && styles.dayNumberTextSelected,
                ]}
              >
                {day.dayOfMonth}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  isSelected && styles.monthTextSelected,
                ]}
              >
                Th{day.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Slots Matrix */}
      <View style={[styles.sectionHeader, { marginTop: 20 }]}>
        <Clock size={16} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Khung giờ học (Ca 2 tiếng)</Text>
      </View>

      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot: TimeSlot) => {
          const roomBooking = getSlotOccupant(roomId, selectedDate, slot.id);
          const userOtherBooking = getUserSlotBooking(selectedDate, slot.id, currentUserId);

          // 1. Is this room booked by current user?
          const isMyBookingForThisRoom =
            roomBooking && roomBooking.userId === currentUserId;

          // 2. Is this room booked by someone else?
          const isBookedByOther =
            roomBooking && roomBooking.userId !== currentUserId;

          // 3. Does current user already have ANOTHER room booked at this exact time?
          const isUserConflictOtherRoom =
            !roomBooking && userOtherBooking && userOtherBooking.roomId !== roomId;

          // 4. Is this slot selected right now?
          const isSelected = selectedSlotId === slot.id;

          // Disabled if booked by anyone or user has conflict
          const isDisabled =
            Boolean(roomBooking) || Boolean(isUserConflictOtherRoom);

          let statusTag = {
            label: 'Còn trống',
            bg: Colors.successLight,
            text: Colors.successDark,
            icon: null as React.ReactNode,
          };

          if (isMyBookingForThisRoom) {
            statusTag = {
              label: 'Lịch của bạn',
              bg: Colors.successLight,
              text: Colors.successDark,
              icon: <UserCheck size={12} color={Colors.successDark} />,
            };
          } else if (isBookedByOther) {
            statusTag = {
              label: `Đã đặt (${roomBooking.userName.split(' ').slice(-1)[0]})`,
              bg: Colors.surface,
              text: Colors.textMuted,
              icon: <Lock size={12} color={Colors.textMuted} />,
            };
          } else if (isUserConflictOtherRoom) {
            statusTag = {
              label: 'Trùng lịch phòng khác',
              bg: Colors.warningLight,
              text: Colors.warningDark,
              icon: <AlertTriangle size={12} color={Colors.warningDark} />,
            };
          }

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isDisabled && styles.slotCardDisabled,
                isMyBookingForThisRoom && styles.slotCardMyBooking,
                isUserConflictOtherRoom && styles.slotCardConflict,
              ]}
              disabled={isDisabled}
              onPress={() => onSelectSlot(slot.id)}
              activeOpacity={0.8}
            >
              <View style={styles.slotHeader}>
                <Text
                  style={[
                    styles.slotTimeText,
                    isSelected && styles.slotTimeTextSelected,
                    isDisabled && styles.slotTimeTextDisabled,
                  ]}
                >
                  {slot.label}
                </Text>
                {isSelected && (
                  <CheckCircle2 size={16} color={Colors.primary} />
                )}
              </View>

              <View
                style={[
                  styles.slotStatusPill,
                  { backgroundColor: statusTag.bg },
                ]}
              >
                {statusTag.icon}
                <Text
                  style={[
                    styles.slotStatusText,
                    { color: statusTag.text },
                  ]}
                  numberOfLines={1}
                >
                  {statusTag.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  daysScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  dayCard: {
    width: 62,
    height: 80,
    borderRadius: 14,
    backgroundColor: Colors.cardBg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  dayCardToday: {
    borderColor: Colors.primaryLight,
    backgroundColor: '#FAF5FF',
  },
  dayCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayOfWeekText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayOfWeekTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
  },
  monthText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  monthTextSelected: {
    color: '#E0E7FF',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotCard: {
    width: '48%',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 74,
  },
  slotCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  slotCardDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
    opacity: 0.7,
  },
  slotCardMyBooking: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
    opacity: 1,
  },
  slotCardConflict: {
    backgroundColor: Colors.warningLight,
    borderColor: Colors.warning,
    opacity: 0.85,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  slotTimeTextSelected: {
    color: Colors.primaryDark,
  },
  slotTimeTextDisabled: {
    color: Colors.textSecondary,
  },
  slotStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  slotStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
