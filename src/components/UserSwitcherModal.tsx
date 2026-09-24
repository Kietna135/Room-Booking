import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { X, Check, UserCheck, Shield } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { User } from '../types';

interface UserSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onSelectUser: (userId: string) => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  visible,
  onClose,
  users,
  currentUser,
  onSelectUser,
}) => {
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
              <Text style={styles.title}>Chuyển đổi tài khoản Demo</Text>
              <Text style={styles.subtitle}>
                Dễ dàng kiểm tra xung đột đặt phòng giữa nhiều sinh viên
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* User List */}
          <View style={styles.userList}>
            {users.map(user => {
              const isSelected = user.id === currentUser.id;
              return (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userCard,
                    isSelected && styles.userCardSelected,
                  ]}
                  onPress={() => {
                    onSelectUser(user.id);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  
                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {user.role === 'club_lead' && (
                        <View style={styles.roleBadge}>
                          <Shield size={10} color={Colors.accentPurple} />
                          <Text style={styles.roleText}>Trưởng nhóm</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.userMeta}>
                      MSSV: {user.studentId} • {user.department}
                    </Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <Check size={12} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
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
  userList: {
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  userCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    color: Colors.accentPurple,
    fontWeight: '700',
  },
  userMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
