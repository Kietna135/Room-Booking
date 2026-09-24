import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { BuildingType } from '../types';

interface FilterHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBuilding: BuildingType;
  onSelectBuilding: (building: BuildingType) => void;
  statusFilter: 'ALL' | 'AVAILABLE_NOW' | 'OCCUPIED';
  onSelectStatusFilter: (status: 'ALL' | 'AVAILABLE_NOW' | 'OCCUPIED') => void;
  activeFilterCount: number;
  onOpenFilterModal: () => void;
}

const BUILDINGS: { id: BuildingType; label: string; desc: string }[] = [
  { id: 'ALL', label: 'Tất cả tòa', desc: 'Toàn campus' },
  { id: 'A', label: 'Tòa A', desc: 'AI & Tech' },
  { id: 'B', label: 'Tòa B', desc: 'Thư viện' },
  { id: 'C', label: 'Tòa C', desc: 'Creative' },
  { id: 'V', label: 'Tòa V', desc: 'Venture' },
];

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedBuilding,
  onSelectBuilding,
  statusFilter,
  onSelectStatusFilter,
  activeFilterCount,
  onOpenFilterModal,
}) => {
  return (
    <View style={styles.container}>
      {/* Search & Filter Button Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên phòng, mã phòng, tòa nhà..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Modal Trigger */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilterCount > 0 && styles.filterButtonActive,
          ]}
          onPress={onOpenFilterModal}
          activeOpacity={0.8}
        >
          <SlidersHorizontal
            size={18}
            color={activeFilterCount > 0 ? '#FFFFFF' : Colors.textPrimary}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Buildings Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buildingScroll}
      >
        {BUILDINGS.map(b => {
          const isSelected = selectedBuilding === b.id;
          return (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.buildingPill,
                isSelected && styles.buildingPillSelected,
              ]}
              onPress={() => onSelectBuilding(b.id)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.buildingPillText,
                  isSelected && styles.buildingPillTextSelected,
                ]}
              >
                {b.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Real-time Status Chips */}
      <View style={styles.statusChipsRow}>
        <TouchableOpacity
          style={[
            styles.statusChip,
            statusFilter === 'ALL' && styles.statusChipActive,
          ]}
          onPress={() => onSelectStatusFilter('ALL')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.statusChipText,
              statusFilter === 'ALL' && styles.statusChipTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusChip,
            statusFilter === 'AVAILABLE_NOW' && styles.statusChipSuccess,
          ]}
          onPress={() =>
            onSelectStatusFilter(
              statusFilter === 'AVAILABLE_NOW' ? 'ALL' : 'AVAILABLE_NOW'
            )
          }
          activeOpacity={0.8}
        >
          <View style={styles.dotGreen} />
          <Text
            style={[
              styles.statusChipText,
              statusFilter === 'AVAILABLE_NOW' && styles.statusChipTextActive,
            ]}
          >
            Còn trống ngay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusChip,
            statusFilter === 'OCCUPIED' && styles.statusChipDanger,
          ]}
          onPress={() =>
            onSelectStatusFilter(
              statusFilter === 'OCCUPIED' ? 'ALL' : 'OCCUPIED'
            )
          }
          activeOpacity={0.8}
        >
          <View style={styles.dotRed} />
          <Text
            style={[
              styles.statusChipText,
              statusFilter === 'OCCUPIED' && styles.statusChipTextActive,
            ]}
          >
            Đang có người
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterButton: {
    width: 42,
    height: 42,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  buildingScroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  buildingPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buildingPillSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  buildingPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  buildingPillTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  statusChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 4,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    gap: 6,
  },
  statusChipActive: {
    backgroundColor: Colors.textPrimary,
  },
  statusChipSuccess: {
    backgroundColor: Colors.successDark,
  },
  statusChipDanger: {
    backgroundColor: Colors.dangerDark,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statusChipTextActive: {
    color: '#FFFFFF',
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  dotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.danger,
  },
});
