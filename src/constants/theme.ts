// BDG Motor Show - Les Bruleurs de Gommes
// Light theme - Rouge racing / Blanc / Noir

export const COLORS = {
  // Core - Dark theme
  bg: '#000000',
  surface: '#111111',
  card: '#1A1A1A',
  cardHover: '#222222',
  border: '#2A2A2A',

  // Brand - Rouge BDG
  primary: '#D91E28',
  primaryLight: '#EF4444',
  primaryDark: '#B91C1C',
  primaryGlow: 'rgba(217, 30, 40, 0.15)',

  // Accent
  accent: '#FFFFFF',
  accentLight: '#E5E5EA',
  accentGlow: 'rgba(255, 255, 255, 0.08)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Status
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2563EB',

  // Special
  glass: 'rgba(255,255,255,0.03)',
  glassBorder: 'rgba(255,255,255,0.06)',
  overlay: 'rgba(0,0,0,0.7)',

  // Zones (carte interactive)
  zonePaddock: '#D91E28',
  zoneBapteme: '#F59E0B',
  zoneStands: '#7C3AED',
  zoneFood: '#16A34A',
  zoneVIP: '#111111',
  zoneCircuit: '#2563EB',
  zonePitLane: '#DC2626',
  zoneEauRouge: '#059669',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
};

export const FONT_SIZES = {
  xs: 10,
  sm: 11,
  md: 12,
  base: 13,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 26,
  hero: 32,
  display: 48,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  }),
};

// Event config
export const EVENT = {
  name: 'BDG Motor Show',
  edition: '10th Anniversary Edition',
  date: '2026-04-05',
  dateDisplay: '05 Avril 2026',
  location: 'Circuit de Spa-Francorchamps',
  address: 'Route du Circuit 55, 4970 Stavelot',
  coordinates: {
    latitude: 50.4372,
    longitude: 5.9714,
  },
  hours: {
    open: '07:30',
    close: '18:00',
  },
  stats: {
    cars: '1000+',
    visitors: '25 000+',
    stands: '35',
    baptemes: '200+',
  },
  social: {
    instagram: '@lesbruleursdegommes',
    facebook: 'LesBruleursdeGommes',
    website: 'https://lesbruleursdegommes.com',
  },
};
