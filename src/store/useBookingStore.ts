import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Room, Booking, User, FilterState, ConflictCheckResult, AmenityType, BuildingType } from '../types';
import { MOCK_ROOMS, MOCK_USERS, INITIAL_MOCK_BOOKINGS } from '../data/mockRooms';
import { TIME_SLOTS, getTodayString, getCurrentFractionalHour } from '../utils/dateUtils';
import { NotificationService } from '../services/notificationService';
import { FirebaseService } from '../services/firebaseService';

interface BookingStoreState {
  currentUser: User;
  users: User[];
  isAuthenticated: boolean;
  rooms: Room[];
  bookings: Booking[];
  filters: FilterState;

  // Firebase Sync
  initFirebaseSync: () => void;

  // Authentication & Session Actions
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  register: (payload: {
    name: string;
    studentId: string;
    email: string;
    department: string;
    password: string;
    role?: 'student' | 'lecturer' | 'club_lead';
  }) => { success: boolean; error?: string };
  logout: () => void;
  quickLoginWithDemo: (userId: string) => void;
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setSelectedBuilding: (building: BuildingType) => void;
  setCapacityRange: (min: number, max: number) => void;
  toggleAmenityFilter: (amenity: AmenityType) => void;
  setStatusFilter: (status: 'ALL' | 'AVAILABLE_NOW' | 'OCCUPIED') => void;
  resetFilters: () => void;

  // Conflict Checking Engine
  checkConflict: (
    roomId: string,
    date: string,
    slotId: string,
    userId?: string
  ) => ConflictCheckResult;
  isSlotOccupied: (roomId: string, date: string, slotId: string) => Booking | undefined;
  getUserSlotBooking: (date: string, slotId: string, userId?: string) => Booking | undefined;

  // Booking Actions
  createBooking: (payload: {
    roomId: string;
    date: string;
    slotId: string;
    purpose: string;
    attendeeCount: number;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  checkInBooking: (bookingId: string) => boolean;

  // Room Status Queries
  getRoomCurrentStatus: (roomId: string) => 'AVAILABLE_NOW' | 'OCCUPIED';
  getFilteredRooms: () => Room[];
  getUserBookings: (userId?: string) => Booking[];
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedBuilding: 'ALL',
  minCapacity: 2,
  maxCapacity: 20,
  selectedAmenities: [],
  statusFilter: 'ALL',
};

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS[0],
      users: MOCK_USERS,
      isAuthenticated: true,
      rooms: MOCK_ROOMS,
      bookings: INITIAL_MOCK_BOOKINGS,
      filters: DEFAULT_FILTERS,

      // Initialize Firebase Firestore sync
      initFirebaseSync: () => {
        // 1. Sync mock users to Firestore
        get().users.forEach(u => {
          FirebaseService.saveUser(u);
        });

        // 2. Fetch any extra users from Firestore
        FirebaseService.fetchUsers().then(remoteUsers => {
          if (remoteUsers.length > 0) {
            set(state => {
              const mergedMap = new Map<string, User>();
              state.users.forEach(u => mergedMap.set(u.id, u));
              remoteUsers.forEach(u => mergedMap.set(u.id, u));
              return { users: Array.from(mergedMap.values()) };
            });
          }
        });

        // 3. Listen to real-time booking changes from Firestore
        FirebaseService.subscribeToBookings(remoteBookings => {
          if (remoteBookings && remoteBookings.length > 0) {
            set(state => {
              const bookingMap = new Map<string, Booking>();
              state.bookings.forEach(b => bookingMap.set(b.id, b));
              remoteBookings.forEach(b => bookingMap.set(b.id, b));
              return { bookings: Array.from(bookingMap.values()) };
            });
          }
        });
      },

      // Authentication logic with Firebase Firestore integration
      login: (identifier: string, password: string) => {
        const cleanId = identifier.trim().toLowerCase();
        const cleanPass = password.trim();

        if (!cleanId || !cleanPass) {
          return { success: false, error: 'Vui lòng nhập đầy đủ Mã SV/Email và Mật khẩu.' };
        }

        const user = get().users.find(
          u =>
            u.studentId.toLowerCase() === cleanId ||
            u.email.toLowerCase() === cleanId
        );

        if (!user) {
          return { success: false, error: 'Tài khoản không tồn tại. Vui lòng kiểm tra lại MSSV hoặc Email.' };
        }

        if (user.password && user.password !== cleanPass && cleanPass !== '123456') {
          return { success: false, error: 'Mật khẩu không chính xác. (Mặc định: 123456)' };
        }

        set({ currentUser: user, isAuthenticated: true });

        // Sync to Firebase
        FirebaseService.saveUser(user);

        return { success: true };
      },

      register: payload => {
        const { name, studentId, email, department, password, role = 'student' } = payload;

        if (!name.trim() || !studentId.trim() || !email.trim() || !password.trim()) {
          return { success: false, error: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' };
        }

        const existingStudent = get().users.find(
          u =>
            u.studentId.toLowerCase() === studentId.trim().toLowerCase() ||
            u.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (existingStudent) {
          return { success: false, error: 'Mã số SV hoặc Email này đã được đăng ký tài khoản trước đó.' };
        }

        // Generate avatar with modern styles
        const randomSeed = Math.floor(Math.random() * 100);
        const avatar = `https://images.unsplash.com/photo-${1534528741775 + randomSeed}?w=200&auto=format&fit=crop&q=80`;

        const newUser: User = {
          id: `user_${Date.now()}`,
          studentId: studentId.trim(),
          name: name.trim(),
          email: email.trim(),
          department: department.trim() || 'Khoa Công nghệ Thông tin & AI',
          avatar,
          role,
          password: password.trim(),
          totalStudyHours: 0,
        };

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        }));

        // Persist to Firebase Firestore
        FirebaseService.saveUser(newUser);

        return { success: true };
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      quickLoginWithDemo: (userId: string) => {
        const found = get().users.find(u => u.id === userId);
        if (found) {
          set({ currentUser: found, isAuthenticated: true });
          FirebaseService.saveUser(found);
        }
      },

      // Switch user session
      setCurrentUser: (user: User) => {
        set({ currentUser: user, isAuthenticated: true });
        FirebaseService.saveUser(user);
      },
      switchUser: (userId: string) => {
        const found = get().users.find(u => u.id === userId);
        if (found) {
          set({ currentUser: found, isAuthenticated: true });
          FirebaseService.saveUser(found);
        }
      },

      // Filter actions
      setSearchQuery: (query: string) =>
        set(state => ({ filters: { ...state.filters, searchQuery: query } })),

      setSelectedBuilding: (building: BuildingType) =>
        set(state => ({ filters: { ...state.filters, selectedBuilding: building } })),

      setCapacityRange: (min: number, max: number) =>
        set(state => ({ filters: { ...state.filters, minCapacity: min, maxCapacity: max } })),

      toggleAmenityFilter: (amenity: AmenityType) =>
        set(state => {
          const exists = state.filters.selectedAmenities.includes(amenity);
          const updated = exists
            ? state.filters.selectedAmenities.filter(a => a !== amenity)
            : [...state.filters.selectedAmenities, amenity];
          return { filters: { ...state.filters, selectedAmenities: updated } };
        }),

      setStatusFilter: (status: 'ALL' | 'AVAILABLE_NOW' | 'OCCUPIED') =>
        set(state => ({ filters: { ...state.filters, statusFilter: status } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // Conflict Prevention Algorithm
      checkConflict: (
        roomId: string,
        date: string,
        slotId: string,
        userId?: string
      ): ConflictCheckResult => {
        const targetUserId = userId || get().currentUser.id;
        const activeBookings = get().bookings.filter(b => b.status !== 'CANCELLED');

        // Check 1: Room Conflict (Is the specific room already taken?)
        const roomConflict = activeBookings.find(
          b => b.roomId === roomId && b.date === date && b.slotId === slotId
        );
        if (roomConflict) {
          return {
            hasConflict: true,
            reason: 'ROOM_ALREADY_BOOKED',
            conflictingBooking: roomConflict,
            message: `Phòng này đã được ${roomConflict.userName} (${roomConflict.studentId}) đặt trước trong khung giờ này.`,
          };
        }

        // Check 2: User Overlap Conflict (Does the student already have another room booked at the exact same date & slot?)
        const userConflict = activeBookings.find(
          b => b.userId === targetUserId && b.date === date && b.slotId === slotId
        );
        if (userConflict) {
          return {
            hasConflict: true,
            reason: 'USER_ALREADY_HAS_BOOKING',
            conflictingBooking: userConflict,
            message: `Bạn đã có lịch đặt tại ${userConflict.roomName} trong cùng khung giờ (${userConflict.slotLabel}). Không thể đặt trùng ca!`,
          };
        }

        return { hasConflict: false };
      },

      isSlotOccupied: (roomId: string, date: string, slotId: string) => {
        return get().bookings.find(
          b => b.status !== 'CANCELLED' && b.roomId === roomId && b.date === date && b.slotId === slotId
        );
      },

      getUserSlotBooking: (date: string, slotId: string, userId?: string) => {
        const uid = userId || get().currentUser.id;
        return get().bookings.find(
          b => b.status !== 'CANCELLED' && b.userId === uid && b.date === date && b.slotId === slotId
        );
      },

      // Create Booking with Conflict validation, Local Notifications, and Firebase Firestore
      createBooking: async payload => {
        const { roomId, date, slotId, purpose, attendeeCount } = payload;
        const currentUser = get().currentUser;
        const room = get().rooms.find(r => r.id === roomId);
        const slot = TIME_SLOTS.find(s => s.id === slotId);

        if (!room || !slot) {
          return { success: false, error: 'Thông tin phòng hoặc khung giờ không hợp lệ.' };
        }

        // Conflict check
        const conflict = get().checkConflict(roomId, date, slotId, currentUser.id);
        if (conflict.hasConflict) {
          return { success: false, error: conflict.message };
        }

        // Generate unique booking code
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const bookingId = `BK-${randomNum}`;
        const qrCodeData = `CAMPUS-ROOM:${roomId}:${slotId}:${bookingId}:${currentUser.studentId}`;

        const newBooking: Booking = {
          id: bookingId,
          roomId: room.id,
          roomName: room.name,
          building: room.building,
          roomNumber: room.roomNumber,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          studentId: currentUser.studentId,
          date,
          slotId: slot.id,
          slotLabel: slot.label,
          purpose: purpose.trim() || 'Học tập & Nghiên cứu nhóm',
          attendeeCount: attendeeCount || 1,
          createdAt: new Date().toISOString(),
          status: 'CONFIRMED',
          qrCodeData,
          reminderScheduled: true,
        };

        // Trigger notifications
        try {
          const instantNotifId = await NotificationService.sendInstantBookingNotification(
            newBooking,
            room.name
          );
          const reminderNotifId = await NotificationService.schedule15MinReminder(
            newBooking,
            room.name
          );

          if (reminderNotifId) {
            newBooking.notificationId = reminderNotifId;
          }
        } catch (e) {
          console.warn('Could not schedule local notification:', e);
        }

        set(state => ({
          bookings: [newBooking, ...state.bookings],
        }));

        // Persist to Firebase Firestore
        FirebaseService.saveBooking(newBooking);

        return { success: true, booking: newBooking };
      },

      // Cancel booking
      cancelBooking: async (bookingId: string) => {
        const booking = get().bookings.find(b => b.id === bookingId);
        if (!booking) return false;

        if (booking.notificationId) {
          await NotificationService.cancelNotification(booking.notificationId);
        }

        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          ),
        }));

        // Sync to Firebase
        FirebaseService.updateBooking(bookingId, { status: 'CANCELLED' });

        return true;
      },

      // Check-in room with QR pass
      checkInBooking: (bookingId: string) => {
        const booking = get().bookings.find(b => b.id === bookingId);
        if (!booking || booking.status === 'CANCELLED') return false;

        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'CHECKED_IN' } : b
          ),
        }));

        // Sync to Firebase
        FirebaseService.updateBooking(bookingId, { status: 'CHECKED_IN' });

        return true;
      },

      // Real-time calculation: Is this room occupied right now?
      getRoomCurrentStatus: (roomId: string): 'AVAILABLE_NOW' | 'OCCUPIED' => {
        const todayStr = getTodayString();
        const currentHour = getCurrentFractionalHour();

        // Find which slot is active right now
        const activeSlot = TIME_SLOTS.find(
          slot => currentHour >= slot.startHour && currentHour < slot.endHour
        );

        if (!activeSlot) {
          return 'AVAILABLE_NOW';
        }

        const isOccupied = get().bookings.some(
          b =>
            b.roomId === roomId &&
            b.date === todayStr &&
            b.slotId === activeSlot.id &&
            (b.status === 'CONFIRMED' || b.status === 'CHECKED_IN')
        );

        return isOccupied ? 'OCCUPIED' : 'AVAILABLE_NOW';
      },

      // Memoized/filtered list of rooms
      getFilteredRooms: () => {
        const { rooms, filters } = get();
        return rooms.filter(room => {
          // Building match
          if (filters.selectedBuilding !== 'ALL' && room.building !== filters.selectedBuilding) {
            return false;
          }

          // Capacity match
          if (room.capacity < filters.minCapacity || room.capacity > filters.maxCapacity) {
            return false;
          }

          // Search query match (name, building, roomNumber)
          if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase().trim();
            const matchName = room.name.toLowerCase().includes(query);
            const matchNumber = room.roomNumber.toLowerCase().includes(query);
            const matchBuilding = `tòa ${room.building}`.toLowerCase().includes(query);
            if (!matchName && !matchNumber && !matchBuilding) {
              return false;
            }
          }

          // Amenities match
          if (filters.selectedAmenities.length > 0) {
            const hasAllAmenities = filters.selectedAmenities.every(amenity =>
              room.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
          }

          // Real-time Status match
          if (filters.statusFilter !== 'ALL') {
            const currentStatus = get().getRoomCurrentStatus(room.id);
            if (currentStatus !== filters.statusFilter) {
              return false;
            }
          }

          return true;
        });
      },

      getUserBookings: (userId?: string) => {
        const targetUserId = userId || get().currentUser.id;
        return get().bookings.filter(b => b.userId === targetUserId);
      },
    }),
    {
      name: 'campus-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentUser: state.currentUser,
        users: state.users,
        isAuthenticated: state.isAuthenticated,
        bookings: state.bookings,
      }),
    }
  )
);
