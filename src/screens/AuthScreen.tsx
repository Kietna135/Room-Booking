import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Building2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { useBookingStore } from '../store/useBookingStore';
import { MOCK_USERS } from '../data/mockRooms';

const DEPARTMENTS = [
  'Khoa Công nghệ Thông tin & AI',
  'Viện Kinh tế & Quản lý Đổi mới',
  'Viện Điện tử Viễn thông & IoT',
  'Khoa Khoa học Máy tính',
  'Viện Cơ khí & Tự động hóa',
  'Khoa Ngoại ngữ & Truyền thông',
];

export const AuthScreen: React.FC = () => {
  const login = useBookingStore(state => state.login);
  const register = useBookingStore(state => state.register);
  const quickLoginWithDemo = useBookingStore(state => state.quickLoginWithDemo);
  const users = useBookingStore(state => state.users);

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('20210045');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState(DEPARTMENTS[0]);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = () => {
    setErrorMessage(null);
    const result = login(loginIdentifier, loginPassword);
    if (!result.success) {
      setErrorMessage(result.error || 'Đăng nhập thất bại.');
    }
  };

  const handleRegister = () => {
    setErrorMessage(null);

    if (!regName.trim() || !regStudentId.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ các trường bắt buộc.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    const result = register({
      name: regName,
      studentId: regStudentId,
      email: regEmail,
      department: regDepartment,
      password: regPassword,
      role: 'student',
    });

    if (result.success) {
      Alert.alert('🎉 Đăng ký thành công', 'Chào mừng bạn đến với hệ thống SmartCampus!');
    } else {
      setErrorMessage(result.error || 'Đăng ký thất bại.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Hero Header */}
          <View style={styles.heroSection}>
            <View style={styles.brandBadge}>
              <Building2 size={24} color="#FFFFFF" />
              <Text style={styles.brandTitle}>SmartCampus</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Hệ thống đặt phòng học & không gian nghiên cứu thông minh
            </Text>

            {/* Segmented Mode Switcher */}
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentedBtn,
                  mode === 'LOGIN' && styles.segmentedBtnActive,
                ]}
                onPress={() => {
                  setMode('LOGIN');
                  setErrorMessage(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    mode === 'LOGIN' && styles.segmentedTextActive,
                  ]}
                >
                  Đăng nhập
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentedBtn,
                  mode === 'REGISTER' && styles.segmentedBtnActive,
                ]}
                onPress={() => {
                  setMode('REGISTER');
                  setErrorMessage(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentedText,
                    mode === 'REGISTER' && styles.segmentedTextActive,
                  ]}
                >
                  Đăng ký tài khoản
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.cardSection}>
            {/* Error Callout */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={Colors.danger} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {mode === 'LOGIN' ? (
              /* LOGIN FORM */
              <View style={styles.formContainer}>
                <Text style={styles.formHeaderTitle}>Đăng nhập sinh viên / cán bộ</Text>
                <Text style={styles.formHeaderDesc}>
                  Sử dụng MSSV hoặc Email trường để truy cập hệ thống
                </Text>

                {/* Input: Student ID or Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mã số SV hoặc Email</Text>
                  <View style={styles.inputWrapper}>
                    <GraduationCap size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="VD: 20210045 hoặc an.nv@sis.edu.vn"
                      placeholderTextColor={Colors.textMuted}
                      value={loginIdentifier}
                      onChangeText={setLoginIdentifier}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Input: Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mật khẩu (Mặc định: 123456)</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu..."
                      placeholderTextColor={Colors.textMuted}
                      value={loginPassword}
                      onChangeText={setLoginPassword}
                      secureTextEntry={!showLoginPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff size={18} color={Colors.textMuted} />
                      ) : (
                        <Eye size={18} color={Colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleLogin}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Đăng nhập ngay</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* 1-Tap Quick Demo Login Section */}
                <View style={styles.demoSection}>
                  <View style={styles.demoDividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.demoDividerText}>
                      HOẶC ĐĂNG NHẬP NHANH TÀI KHOẢN MẪU
                    </Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.demoUserList}>
                    {users.slice(0, 3).map(u => (
                      <TouchableOpacity
                        key={u.id}
                        style={styles.demoUserCard}
                        onPress={() => quickLoginWithDemo(u.id)}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: u.avatar }} style={styles.demoAvatar} />
                        <View style={styles.demoInfo}>
                          <Text style={styles.demoName}>{u.name}</Text>
                          <Text style={styles.demoMeta}>
                            {u.studentId} • {u.department.split(' ')[1] || 'SV'}
                          </Text>
                        </View>
                        <View style={styles.loginPill}>
                          <Text style={styles.loginPillText}>Chọn</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              /* REGISTER FORM */
              <View style={styles.formContainer}>
                <Text style={styles.formHeaderTitle}>Đăng ký tài khoản mới</Text>
                <Text style={styles.formHeaderDesc}>
                  Tạo tài khoản để bắt đầu đặt phòng học & không gian nhóm
                </Text>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Họ và tên sinh viên *</Text>
                  <View style={styles.inputWrapper}>
                    <UserIcon size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="VD: Nguyễn Văn Nam"
                      placeholderTextColor={Colors.textMuted}
                      value={regName}
                      onChangeText={setRegName}
                    />
                  </View>
                </View>

                {/* Student ID */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mã số sinh viên (MSSV) *</Text>
                  <View style={styles.inputWrapper}>
                    <GraduationCap size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="VD: 20234589"
                      placeholderTextColor={Colors.textMuted}
                      value={regStudentId}
                      onChangeText={setRegStudentId}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* University Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email trường đại học *</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="VD: nam.nv20234589@sis.edu.vn"
                      placeholderTextColor={Colors.textMuted}
                      value={regEmail}
                      onChangeText={setRegEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                {/* Department Select */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Khoa / Viện đào tạo</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.deptScroll}
                  >
                    {DEPARTMENTS.map(dept => {
                      const isSel = regDepartment === dept;
                      return (
                        <TouchableOpacity
                          key={dept}
                          style={[
                            styles.deptChip,
                            isSel && styles.deptChipSelected,
                          ]}
                          onPress={() => setRegDepartment(dept)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.deptChipText,
                              isSel && styles.deptChipTextSelected,
                            ]}
                          >
                            {dept}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mật khẩu (Tối thiểu 6 ký tự) *</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu..."
                      placeholderTextColor={Colors.textMuted}
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry={!showRegPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowRegPassword(!showRegPassword)}
                    >
                      {showRegPassword ? (
                        <EyeOff size={18} color={Colors.textMuted} />
                      ) : (
                        <Eye size={18} color={Colors.textMuted} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu *</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={18} color={Colors.textMuted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập lại mật khẩu..."
                      placeholderTextColor={Colors.textMuted}
                      value={regConfirmPassword}
                      onChangeText={setRegConfirmPassword}
                      secureTextEntry={!showRegPassword}
                    />
                  </View>
                </View>

                {/* Register Submit Button */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Tạo tài khoản & Bắt đầu</Text>
                  <CheckCircle2 size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 18,
    marginBottom: 20,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 4,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentedBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  segmentedTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  cardSection: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  formHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  formHeaderDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.dangerDark,
    fontWeight: '600',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  deptScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  deptChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deptChipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  deptChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  deptChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  demoSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 16,
  },
  demoDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  demoDividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  demoUserList: {
    gap: 8,
  },
  demoUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  demoAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  demoInfo: {
    flex: 1,
  },
  demoName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  demoMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  loginPill: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  loginPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
