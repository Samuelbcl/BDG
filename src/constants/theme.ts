// BDG Motor Show - Design System
// Dark immersive racing aesthetic

export const COLORS = {
  // Core
  bg: '#0A0A0F',
  surface: '#13131A',
  card: '#1A1A24',
  cardHover: '#22222E',
  border: '#2A2A38',

  // Brand
  primary: '#FF3B1D',
  primaryLight: '#FF5A40',
  primaryDark: '#CC2F17',
  primaryGlow: 'rgba(255, 59, 29, 0.3)',

  // Accent
  accent: '#FFB800',
  accentLight: '#FFCC40',
  accentGlow: 'rgba(255, 184, 0, 0.2)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#8888A0',
  textMuted: '#555568',

  // Status
  success: '#00D26A',
  warning: '#FFB800',
  error: '#FF3B3B',
  info: '#3B82F6',

  // Special
  glass: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.08)',
  overlay: 'rgba(0,0,0,0.6)',

  // Zones (carte interactive)
  zonePaddock: '#FF3B1D',
  zoneBapteme: '#FFB800',
  zoneStands: '#A855F7',
  zoneFood: '#00D26A',
  zoneVIP: '#E11D48',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
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
