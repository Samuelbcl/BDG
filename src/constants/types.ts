// === TICKETS ===
export interface Ticket {
  id: string;
  userId: string;
  type: 'standard' | 'vip' | 'bapteme_pack';
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled' | 'refunded';
  purchaseDate: string;
  eventDate: string;
  price: number;
}

// === PROGRAMME ===
export interface ScheduleItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  zone?: string;
  isLive?: boolean;
}

// === CARTE ===
export interface Zone {
  id: string;
  name: string;
  description: string;
  info: string;
  color: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  polygon?: { latitude: number; longitude: number }[];
}

export interface Stand {
  id: string;
  name: string;
  zoneId: string;
  category: 'food' | 'merch' | 'tuning' | 'bapteme' | 'sponsor' | 'other';
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  acceptsCoins: boolean;
}

// === VOITURES ===
export interface Car {
  id: string;
  name: string;
  owner: string;
  ownerHandle?: string;
  imageUrl?: string;
  zone: string;
  paddockNumber?: string;
  specs?: {
    power?: string;
    engine?: string;
    year?: number;
  };
  votes: number;
  hasVoted?: boolean;
}

// === BDG COINS ===
export interface CoinBalance {
  userId: string;
  balance: number;
  lastUpdated: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'topup' | 'purchase' | 'refund';
  amount: number;
  label: string;
  standId?: string;
  standName?: string;
  timestamp: string;
}

// === BAPTÊMES ===
export interface Bapteme {
  id: string;
  carModel: string;
  provider: string;
  price: number;
  priceInCoins?: number;
  duration: string;
  laps: number;
  description: string;
  availableSlots: BaptemeSlot[];
}

export interface BaptemeSlot {
  id: string;
  baptemeId: string;
  time: string;
  available: boolean;
  bookedBy?: string;
}

export interface BaptemeBooking {
  id: string;
  userId: string;
  baptemeId: string;
  slotId: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  qrCode: string;
}

// === NOTIFICATIONS ===
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'schedule' | 'vote' | 'promo' | 'emergency';
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

// === USER ===
export interface User {
  id: string;
  email: string;
  displayName?: string;
  ticketId?: string;
  coinBalance: number;
  createdAt: string;
}
