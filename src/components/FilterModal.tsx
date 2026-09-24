import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, Check, Users, Sparkles, RotateCcw } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { AmenityType } from '../types';
import { AMENITIES_LIST } from '../data/mockRooms';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  minCapacity: number;
  maxCapacity: number;
  selectedAmenities: AmenityType[];
  onApply: (params: {
    minCapacity: number;
    maxCapacity: number;
    selectedAmenities: AmenityType[];
  }) => void;
  onReset: () => void;
}

const CAPACITY_PRESETS = [
  { label: 'Tất cả (2 - 20 SV)', min: 2, max: 20 },
  { label: 'Nhóm nhỏ (2 - 4 SV)', min: 2, max: 4 },
  { label: 'Nhóm vừa (5 - 8 SV)', min: 5, max: 8 },
  { label: 'Nhóm lớn (9 - 15 SV)', min: 9, max: 15 },
  { label: 'Hội thảo (16 - 20 SV)', min: 16, max: 20 },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  minCapacity,
  maxCapacity,
  selectedAmenities,
  onApply,
  onReset,
}) => {
  const [localMinCap, setLocalMinCap] = useState(minCapacity);
  const [localMaxCap, setLocalMaxCap] = useState(maxCapacity);
  const [localAmenities, setLocalAmenities] = useState<AmenityType[]>(selectedAmenities);

  useEffect(() => {
    if (visible) {
      setLocalMinCap(minCapacity);
      setLocalMaxCap(maxCapacity);
      setLocalAmenities(selectedAmenities);
    }
  }, [visible, minCapacity, maxCapacity, selectedAmenities]);

  const toggleAmenity = (amenityId: AmenityType) => {
    if (localAmenities.includes(amenityId)) {
      setLocalAmenities(localAmenities.filter(a => a !== amenityId));
    } else {
      setLocalAmenities([...localAmenities, amenityId]);
    }
  };

  const handleApply = () => {
    onApply({
      minCapacity: localMinCap,
      maxCapacity: localMaxCap,
      selectedAmenities: localAmenities,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalMinCap(2);
    setLocalMaxCap(20);
    setLocalAmenities([]);
    onReset();
    onClose();
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
            <View>
              <Text style={styles.title}>Bộ lọc nâng cao</Text>
              <Text style={styles.subtitle}>Tùy chỉnh tiêu chí tìm phòng học</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Section 1: Sức chứa */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Users size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Sức chứa phòng học</Text>
              </View>
              <Text style={styles.sectionDesc}>
                Hiện tại: {localMinCap} - {localMaxCap} sinh viên
              </Text>

              <View style={styles.presetsGrid}>
                {CAPACITY_PRESETS.map((preset, index) => {
                  const isSelected =
                    localMinCap === preset.min && localMaxCap === preset.max;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.presetChip,
                        isSelected && styles.presetChipSelected,
                      ]}
                      onPress={() => {
                        setLocalMinCap(preset.min);
                        setLocalMaxCap(preset.max);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isSelected && styles.presetChipTextSelected,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 2: Tiện ích & Thiết bị */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Sparkles size={16} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Trang thiết bị & Tiện ích</Text>
              </View>
              <Text style={styles.sectionDesc}>
                Chọn các thiết bị bắt buộc phòng cần có
              </Text>

              <View style={styles.amenitiesList}>
                {AMENITIES_LIST.map(amenity => {
                  const isChecked = localAmenities.includes(amenity.id);
                  return (
                    <TouchableOpacity
                      key={amenity.id}
                      style={[
                        styles.amenityItem,
                        isChecked && styles.amenityItemSelected,
                      ]}
                      onPress={() => toggleAmenity(amenity.id)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.amenityItemLeft}>
                        <View
                          style={[
                            styles.checkbox,
                            isChecked && styles.checkboxChecked,
                          ]}
                        >
                          {isChecked && <Check size={12} color="#FFFFFF" />}
                        </View>
                        <Text
                          style={[
                            styles.amenityItemText,
                            isChecked && styles.amenityItemTextSelected,
                          ]}
                        >
                          {amenity.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <RotateCcw size={16} color={Colors.textSecondary} />
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Áp dụng bộ lọc</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  amenityItemSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  amenityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  amenityItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  amenityItemTextSelected: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
