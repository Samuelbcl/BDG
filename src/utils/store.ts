import { create } from 'zustand';
import type { User, Ticket, CoinTransaction, AppNotification, Car } from '../constants/types';

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Ticket
  ticket: Ticket | null;
  setTicket: (ticket: Ticket | null) => void;

  // Coins
  coinBalance: number;
  setCoinBalance: (balance: number) => void;
  transactions: CoinTransaction[];
  addTransaction: (tx: CoinTransaction) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: AppNotification) => void;
  markAsRead: (id: string) => void;

  // Votes
  votedCars: string[];
  voteCar: (carId: string) => void;

  // Offline mode
  isOffline: boolean;
  setOffline: (offline: boolean) => void;

  // Location
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;

  // Event state
  isLive: boolean;
  setLive: (live: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Ticket
  ticket: null,
  setTicket: (ticket) => set({ ticket }),

  // Coins
  coinBalance: 0,
  setCoinBalance: (balance) => set({ coinBalance: balance }),
  transactions: [],
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
      coinBalance: state.coinBalance + tx.amount,
    })),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  // Votes
  votedCars: [],
  voteCar: (carId) =>
    set((state) => ({
      votedCars: [...state.votedCars, carId],
    })),

  // Location
  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),

  // Offline
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),

  // Event
  isLive: false,
  setLive: (live) => set({ isLive: live }),
}));
