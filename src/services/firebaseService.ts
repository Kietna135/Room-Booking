import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Booking } from '../types';

export class FirebaseService {
  /**
   * Save or update a user document in Firestore 'users' collection
   */
  static async saveUser(user: User): Promise<boolean> {
    try {
      if (!db) return false;
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        id: user.id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        department: user.department,
        avatar: user.avatar,
        role: user.role,
        password: user.password || '123456',
        totalStudyHours: user.totalStudyHours || 0,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log(`✅ [Firebase] User ${user.name} (${user.studentId}) saved to Firestore!`);
      return true;
    } catch (error) {
      console.warn('⚠️ [Firebase] Could not save user to Firestore (fallback to local storage):', error);
      return false;
    }
  }

  /**
   * Fetch all registered users from Firestore 'users' collection
   */
  static async fetchUsers(): Promise<User[]> {
    try {
      if (!db) return [];
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      const users: User[] = [];
      snapshot.forEach(docSnap => {
        users.push(docSnap.data() as User);
      });
      return users;
    } catch (error) {
      console.warn('⚠️ [Firebase] Could not fetch users from Firestore:', error);
      return [];
    }
  }

  /**
   * Save a new booking in Firestore 'bookings' collection
   */
  static async saveBooking(booking: Booking): Promise<boolean> {
    try {
      if (!db) return false;
      const bookingRef = doc(db, 'bookings', booking.id);
      await setDoc(bookingRef, {
        ...booking,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      console.log(`✅ [Firebase] Booking ${booking.id} (${booking.roomName}) saved to Firestore!`);
      return true;
    } catch (error) {
      console.warn('⚠️ [Firebase] Could not save booking to Firestore:', error);
      return false;
    }
  }

  /**
   * Update booking status in Firestore (e.g. CANCELLED or CHECKED_IN)
   */
  static async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<boolean> {
    try {
      if (!db) return false;
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ [Firebase] Booking ${bookingId} updated in Firestore:`, updates);
      return true;
    } catch (error) {
      console.warn('⚠️ [Firebase] Could not update booking in Firestore:', error);
      return false;
    }
  }

  /**
   * Fetch all bookings from Firestore
   */
  static async fetchBookings(): Promise<Booking[]> {
    try {
      if (!db) return [];
      const bookingsCol = collection(db, 'bookings');
      const snapshot = await getDocs(bookingsCol);
      const bookings: Booking[] = [];
      snapshot.forEach(docSnap => {
        bookings.push(docSnap.data() as Booking);
      });
      return bookings;
    } catch (error) {
      console.warn('⚠️ [Firebase] Could not fetch bookings from Firestore:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time booking changes in Firestore
   */
  static subscribeToBookings(onUpdate: (bookings: Booking[]) => void): () => void {
    try {
      if (!db) return () => {};
      const bookingsCol = collection(db, 'bookings');
      const unsubscribe = onSnapshot(
        bookingsCol,
        snapshot => {
          const updatedBookings: Booking[] = [];
          snapshot.forEach(docSnap => {
            updatedBookings.push(docSnap.data() as Booking);
          });
          if (updatedBookings.length > 0) {
            onUpdate(updatedBookings);
          }
        },
        error => {
          console.warn('⚠️ [Firebase] Real-time subscription notice:', error);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.warn('⚠️ [Firebase] Failed to setup real-time listener:', error);
      return () => {};
    }
  }
}
