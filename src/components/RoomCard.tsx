import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Room } from '../types';
import { Colors } from '../theme/colors';
import { Badge } from './Badge';
import { AMENITIES_LIST } from '../data/mockRooms';
import {
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Tv,
  Edit3,
  Monitor,
  Wind,
  Zap,
  VolumeX,
  Video,
} from 'lucide-react-native';

export const ROOM_CARD_HEIGHT = 300;
export const ROOM_CARD_MARGIN_BOTTOM = 16;

interface RoomCardProps {
  room: Room;
  currentStatus: 'AVAILABLE_NOW' | 'OCCUPIED';
  onPress: (room: Room) => void;
}

const renderAmenityIcon = (type: string, size = 13, color = Colors.textSecondary) => {
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
      return null;
  }
};

const getAmenityLabel = (type: string): string => {
  const found = AMENITIES_LIST.find(a => a.id === type);
  return found ? found.label : type;
};

export const RoomCard: React.FC<RoomCardProps> = React.memo(
  ({ room, currentStatus, onPress }) => {
    const isAvailable = currentStatus === 'AVAILABLE_NOW';

    const handlePress = () => {
      onPress(room);
    };

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.85}
        onPress={handlePress}
      >
        {/* Cover Image with Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Top Left: Building and Floor */}
          <View style={styles.topLeftBadges}>
            <Badge
              label={`Tòa ${room.building} • Tầng ${room.floor}`}
              variant="neutral"
              style={styles.buildingBadge}
              textStyle={styles.buildingBadgeText}
              icon={<MapPin size={12} color="#FFFFFF" />}
            />
            {room.isPopular && (
              <Badge
                label="Ưa thích"
                variant="warning"
                style={styles.popularBadge}
                icon={<Sparkles size={11} color={Colors.warningDark} />}
              />
            )}
          </View>

          {/* Top Right: Live Real-time Status */}
          <View style={styles.topRightBadge}>
            <Badge
              label={isAvailable ? 'Còn trống ngay' : 'Đang có người'}
              variant={isAvailable ? 'success' : 'danger'}
              size="sm"
              style={styles.statusBadge}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Header Row: Room Name & Capacity */}
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.roomName} numberOfLines={1}>
                {room.name}
              </Text>
              <Text style={styles.roomNumber}>Mã phòng: {room.roomNumber}</Text>
            </View>
            <View style={styles.capacityBadge}>
              <Users size={14} color={Colors.primary} />
              <Text style={styles.capacityText}>{room.capacity} SV</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {room.description}
          </Text>

          {/* Amenities Row */}
          <View style={styles.amenitiesRow}>
            {room.amenities.slice(0, 3).map(amenity => (
              <View key={amenity} style={styles.amenityChip}>
                {renderAmenityIcon(amenity, 12, Colors.textSecondary)}
                <Text style={styles.amenityText} numberOfLines={1}>
                  {getAmenityLabel(amenity).split(' ')[0]}
                </Text>
              </View>
            ))}
            {room.amenities.length > 3 && (
              <View style={styles.moreAmenityChip}>
                <Text style={styles.moreAmenityText}>
                  +{room.amenities.length - 3}
                </Text>
              </View>
            )}
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <View style={styles.hoursCol}>
              <Text style={styles.hoursLabel}>Giờ mở cửa</Text>
              <Text style={styles.hoursValue}>{room.openHours}</Text>
            </View>

            <TouchableOpacity
              style={styles.bookButton}
              activeOpacity={0.8}
              onPress={handlePress}
            >
              <Text style={styles.bookButtonText}>Chọn ca & Đặt</Text>
              <ArrowRight size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.room.id === nextProps.room.id &&
      prevProps.currentStatus === nextProps.currentStatus
    );
  }
);

const styles = StyleSheet.create({
  cardContainer: {
    height: ROOM_CARD_HEIGHT,
    marginBottom: ROOM_CARD_MARGIN_BOTTOM,
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 125,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  topLeftBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  buildingBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },
  buildingBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  popularBadge: {
    backgroundColor: '#FEF3C7',
  },
  topRightBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statusBadge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roomNumber: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginVertical: 4,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  moreAmenityChip: {
    backgroundColor: Colors.surface,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  moreAmenityText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
  },
  hoursCol: {},
  hoursLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  hoursValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
