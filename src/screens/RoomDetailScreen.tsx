import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Edit3,
  Monitor,
  Wind,
  Zap,
  VolumeX,
  Video,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { Room, TimeSlot, Booking } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { Badge } from '../components/Badge';
import { TimeSlotGrid } from '../components/TimeSlotGrid';
import { BookingConfirmModal } from '../components/BookingConfirmModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { TIME_SLOTS, getTodayString, formatVietnameseDate } from '../utils/dateUtils';
import { AMENITIES_LIST } from '../data/mockRooms';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { RootStackNavigationProp } from '../navigation/types';

interface RouteParams {
  params: {
    room: Room;
  };
}

const renderAmenityIcon = (type: string, size = 16, color = Colors.primary) => {
  switch (type) {
    case 'projector':
      return <Tv size={size} color={color} />;
    case 'whiteboard':
      return <Edit3 size={size} color={color} />;
    case 'high_spec_pc':
      return <Monitor size={size} color={color} />;
    case 'air_conditioner':
      return <Wind size={size} color={color} />;
    case 'power_sockets':
      return <Zap size={size} color={color} />;
    case 'soundproof':
      return <VolumeX size={size} color={color} />;
    case 'video_conferencing':
      return <Video size={size} color={color} />;
    default:
      return <Sparkles size={size} color={color} />;
  }
};

const getAmenityLabel = (type: string): string => {
  const found = AMENITIES_LIST.find(a => a.id === type);
  return found ? found.label : type;
};

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<RootStackNavigationProp<'RoomDetail'>>();
  const room = route.params.room;
  const currentUser = useBookingStore(state => state.currentUser);
  const isSlotOccupied = useBookingStore(state => state.isSlotOccupied);
  const getUserSlotBooking = useBookingStore(state => state.getUserSlotBooking);
  const createBooking = useBookingStore(state => state.createBooking);
  const checkInBooking = useBookingStore(state => state.checkInBooking);

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activeCreatedBooking, setActiveCreatedBooking] = useState<Booking | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const selectedSlot = TIME_SLOTS.find(s => s.id === selectedSlotId);

  const handleOpenConfirm = () => {
    if (!selectedSlotId) {
      Alert.alert('Chưa chọn ca học', 'Vui lòng chọn một khung giờ 2 tiếng còn trống để đặt phòng.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleBookingConfirm = async (payload: {
    purpose: string;
    attendeeCount: number;
  }) => {
    if (!selectedSlotId) {
      return { success: false, error: 'Chưa chọn khung giờ' };
    }

    return await createBooking({
      roomId: room.id,
      date: selectedDate,
      slotId: selectedSlotId,
      purpose: payload.purpose,
      attendeeCount: payload.attendeeCount,
    });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setActiveCreatedBooking(booking);
    setIsQRModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Scrollable Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Cover Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />

          {/* Top Bar Navigation */}
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Badge
              label={`Tòa ${room.building} • Tầng ${room.floor}`}
              variant="neutral"
              style={styles.buildingBadge}
              textStyle={{ color: '#FFFFFF', fontWeight: '700' }}
            />
          </View>

          {/* Bottom Overlay Info */}
          <View style={styles.imageBottomInfo}>
            <Text style={styles.heroTitle}>{room.name}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaItem}>
                <Users size={14} color="#E2E8F0" />
                <Text style={styles.heroMetaText}>Sức chứa: {room.capacity} sinh viên</Text>
              </View>
              <View style={styles.heroMetaItem}>
                <Clock size={14} color="#E2E8F0" />
                <Text style={styles.heroMetaText}>{room.openHours}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Room Details Section */}
        <View style={styles.bodyContent}>
          {/* Description */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Giới thiệu không gian</Text>
            <Text style={styles.descriptionText}>{room.description}</Text>
          </Animated.View>

          {/* Amenities Grid */}
          <Animated.View entering={FadeIn.delay(200)} style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Trang thiết bị & Tiện nghi</Text>
            <View style={styles.amenitiesGrid}>
              {room.amenities.map(amenity => (
                <View key={amenity} style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    {renderAmenityIcon(amenity, 16, Colors.primary)}
                  </View>
                  <Text style={styles.amenityLabel}>{getAmenityLabel(amenity)}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Interactive Date & 2-Hour Time Slot Matrix */}
          <Animated.View entering={FadeIn.delay(300)} style={styles.sectionCard}>
            <TimeSlotGrid
              selectedDate={selectedDate}
              onSelectDate={date => {
                setSelectedDate(date);
                setSelectedSlotId(null);
              }}
              selectedSlotId={selectedSlotId}
              onSelectSlot={slotId => setSelectedSlotId(slotId)}
              roomId={room.id}
              currentUserId={currentUser.id}
              getSlotOccupant={isSlotOccupied}
              getUserSlotBooking={getUserSlotBooking}
            />
          </Animated.View>

          {/* Campus Room Booking Rules Callout */}
          <Animated.View entering={FadeIn.delay(400)} style={styles.rulesBox}>
            <ShieldCheck size={20} color={Colors.primary} />
            <View style={styles.rulesTextCol}>
              <Text style={styles.rulesTitle}>Quy định sử dụng phòng học</Text>
              <Text style={styles.rulesDesc}>
                • Vui lòng check-in bằng mã QR tại cửa phòng khi đến.{'\n'}
                • Giữ gìn vệ sinh và tắt thiết bị điện khi kết thúc ca.{'\n'}
                • Hủy đặt chỗ trước tối thiểu 30 phút nếu không sử dụng.
              </Text>
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Bottom Booking Action Bar */}
      <Animated.View entering={SlideInDown.delay(500)} style={styles.bottomBar}>
        <View style={styles.bottomInfoCol}>
          <Text style={styles.bottomDateText}>
            {formatVietnameseDate(selectedDate)}
          </Text>
          <Text style={styles.bottomSlotText}>
            {selectedSlot ? selectedSlot.label : 'Chưa chọn ca học'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            !selectedSlotId && styles.actionButtonDisabled,
          ]}
          onPress={handleOpenConfirm}
          disabled={!selectedSlotId}
          activeOpacity={0.85}
        >
          <CheckCircle2 size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>
            {selectedSlotId ? 'Đặt phòng ngay' : 'Chọn ca học'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Confirmation Modal */}
      {selectedSlot && (
        <BookingConfirmModal
          visible={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          room={room}
          selectedDate={selectedDate}
          slot={selectedSlot}
          studentName={currentUser.name}
          studentId={currentUser.studentId}
          onConfirm={handleBookingConfirm}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* QR Code Pass Modal on Success */}
      <QRCodeModal
        visible={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          navigation.navigate('MainTabs', { screen: 'MyBookings' });
        }}
        booking={activeCreatedBooking}
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
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  navBar: {
    position: 'absolute',
    top: 44,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },
  imageBottomInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  bodyContent: {
    padding: 16,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  amenityIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rulesBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  rulesTextCol: {
    flex: 1,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  rulesDesc: {
    fontSize: 12,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomInfoCol: {
    flex: 1,
  },
  bottomDateText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bottomSlotText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
