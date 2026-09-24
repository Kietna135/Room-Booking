import { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot_1',
    label: '07:30 - 09:30',
    startTime: '07:30',
    endTime: '09:30',
    startHour: 7.5,
    endHour: 9.5,
    period: 'morning',
  },
  {
    id: 'slot_2',
    label: '09:30 - 11:30',
    startTime: '09:30',
    endTime: '11:30',
    startHour: 9.5,
    endHour: 11.5,
    period: 'morning',
  },
  {
    id: 'slot_3',
    label: '13:00 - 15:00',
    startTime: '13:00',
    endTime: '15:00',
    startHour: 13.0,
    endHour: 15.0,
    period: 'afternoon',
  },
  {
    id: 'slot_4',
    label: '15:00 - 17:00',
    startTime: '15:00',
    endTime: '17:00',
    startHour: 15.0,
    endHour: 17.0,
    period: 'afternoon',
  },
  {
    id: 'slot_5',
    label: '17:30 - 19:30',
    startTime: '17:30',
    endTime: '19:30',
    startHour: 17.5,
    endHour: 19.5,
    period: 'evening',
  },
  {
    id: 'slot_6',
    label: '19:30 - 21:30',
    startTime: '19:30',
    endTime: '21:30',
    startHour: 19.5,
    endHour: 21.5,
    period: 'evening',
  },
];

export interface DayOption {
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string;  // e.g. T2, T3, CN
  dayOfMonth: number; // e.g. 17
  month: number;      // e.g. 9
  isToday: boolean;
  fullFormatted: string; // e.g. "Thứ Năm, 17/09/2026"
}

export function getNext7Days(): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();
  
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const fullDayNames = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const dayOfWeek = dayNames[d.getDay()];
    const fullDayName = fullDayNames[d.getDay()];
    const fullFormatted = `${fullDayName}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

    days.push({
      dateString,
      dayOfWeek,
      dayOfMonth: day,
      month,
      isToday: i === 0,
      fullFormatted,
    });
  }

  return days;
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatVietnameseDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * Calculates current time in fractional hours (e.g. 14:30 -> 14.5)
 */
export function getCurrentFractionalHour(): number {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}
