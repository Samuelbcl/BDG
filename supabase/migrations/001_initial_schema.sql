-- BDG Motor Show - Database Schema
-- Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TICKETS
-- =====================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('standard', 'vip', 'bapteme_pack')),
  qr_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'used', 'cancelled', 'refunded')),
  price DECIMAL(10,2) NOT NULL,
  event_date DATE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  scanned_at TIMESTAMPTZ,
  scanned_by TEXT
);

CREATE INDEX idx_tickets_qr ON tickets(qr_code);
CREATE INDEX idx_tickets_user ON tickets(user_id);

-- =====================
-- ZONES
-- =====================
CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  info TEXT,
  color TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  sort_order INTEGER DEFAULT 0
);

-- =====================
-- STANDS
-- =====================
CREATE TABLE stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id TEXT REFERENCES zones(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'merch', 'tuning', 'bapteme', 'sponsor', 'other')),
  description TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  accepts_coins BOOLEAN DEFAULT true,
  logo_url TEXT,
  contact_info TEXT
);

-- =====================
-- CARS (exposition)
-- =====================
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_handle TEXT,
  image_url TEXT,
  zone_id TEXT REFERENCES zones(id),
  paddock_number TEXT,
  power TEXT,
  engine TEXT,
  year INTEGER,
  votes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cars_votes ON cars(votes DESC);

-- =====================
-- VOTES
-- =====================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- =====================
-- SCHEDULE
-- =====================
CREATE TABLE schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time TIME NOT NULL,
  end_time TIME,
  title TEXT NOT NULL,
  description TEXT,
  tag TEXT NOT NULL,
  tag_color TEXT NOT NULL,
  zone_id TEXT REFERENCES zones(id),
  is_live BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- =====================
-- BAPTÊMES
-- =====================
CREATE TABLE baptemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_model TEXT NOT NULL,
  provider TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_in_coins INTEGER,
  duration TEXT,
  laps INTEGER,
  description TEXT,
  image_url TEXT
);

CREATE TABLE bapteme_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bapteme_id UUID REFERENCES baptemes(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  available BOOLEAN DEFAULT true,
  booked_by UUID REFERENCES users(id)
);

CREATE TABLE bapteme_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bapteme_id UUID REFERENCES baptemes(id),
  slot_id UUID REFERENCES bapteme_slots(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  qr_code TEXT UNIQUE NOT NULL,
  booked_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'schedule', 'vote', 'promo', 'emergency')),
  data JSONB,
  send_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ
);

-- =====================
-- RLS (Row Level Security)
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bapteme_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Tickets: users see only their own
CREATE POLICY "Users read own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);

-- Votes: users can vote and see all votes
CREATE POLICY "Users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read votes" ON votes FOR SELECT USING (true);

-- Bapteme bookings: users see their own
CREATE POLICY "Users read own bookings" ON bapteme_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own bookings" ON bapteme_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users see their own
CREATE POLICY "Users read own notifications" ON user_notifications FOR SELECT USING (auth.uid() = user_id);

-- Public read access for event data
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE baptemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bapteme_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public read stands" ON stands FOR SELECT USING (true);
CREATE POLICY "Public read cars" ON cars FOR SELECT USING (true);
CREATE POLICY "Public read schedule" ON schedule FOR SELECT USING (true);
CREATE POLICY "Public read baptemes" ON baptemes FOR SELECT USING (true);
CREATE POLICY "Public read slots" ON bapteme_slots FOR SELECT USING (true);
CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);

-- =====================
-- FUNCTIONS
-- =====================

-- Function to increment car votes
CREATE OR REPLACE FUNCTION increment_car_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cars SET votes = votes + 1 WHERE id = NEW.car_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_vote_insert
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION increment_car_votes();

-- Function to mark ticket as used
CREATE OR REPLACE FUNCTION scan_ticket(ticket_qr TEXT, scanner TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  ticket_row tickets%ROWTYPE;
BEGIN
  SELECT * INTO ticket_row FROM tickets WHERE qr_code = ticket_qr;
  IF NOT FOUND THEN RETURN FALSE; END IF;
  IF ticket_row.status != 'valid' THEN RETURN FALSE; END IF;
  UPDATE tickets SET status = 'used', scanned_at = NOW(), scanned_by = scanner WHERE id = ticket_row.id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
