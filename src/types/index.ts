export type BuildingType = 'ALL' | 'A' | 'B' | 'C' | 'V';

export type AmenityType =
  | 'projector'
  | 'whiteboard'
  | 'high_spec_pc'
  | 'air_conditioner'
  | 'soundproof'
  | 'power_sockets'
  | 'video_conferencing';

export interface AmenityInfo {
  id: AmenityType;
  label: string;
  iconName: string;
}

export interface Room {
  id: string;
  name: string;
  building: 'A' | 'B' | 'C' | 'V';
  floor: number;
  roomNumber: string;
  capacity: number;
  image: string;
  amenities: AmenityType[];
  description: string;
  rating: number;
  openHours: string;
  isPopular?: boolean;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  startHour: number; // e.g. 7.5 for 07:30
  endHour: number;   // e.g. 9.5 for 09:30
  period: 'morning' | 'afternoon' | 'evening';
}

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string; // e.g. BK-498214
  roomId: string;
  roomName: string;
  building: 'A' | 'B' | 'C' | 'V';
  roomNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotLabel: string;
  purpose: string;
  attendeeCount: number;
  createdAt: string;
  status: BookingStatus;
  qrCodeData: string;
  notificationId?: string;
  reminderScheduled?: boolean;
}

export interface User {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  role: 'student' | 'lecturer' | 'club_lead';
  password?: string;
  totalStudyHours?: number;
}

export interface FilterState {
  searchQuery: string;
  selectedBuilding: BuildingType;
  minCapacity: number;
  maxCapacity: number;
  selectedAmenities: AmenityType[];
  statusFilter: 'ALL' | 'AVAILABLE_NOW' | 'OCCUPIED';
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  reason?: 'ROOM_ALREADY_BOOKED' | 'USER_ALREADY_HAS_BOOKING';
  conflictingBooking?: Booking;
  message?: string;
}
