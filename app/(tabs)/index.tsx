import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, Linking } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES, EVENT } from '../../src/constants/theme';
import { useAppStore } from '../../src/utils/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = 420;
const EVENT_DATE = new Date('2026-04-05T09:00:00+02:00');
const TICKET_URL = 'https://lesbruleursdegommes.com/billetterie/';

const FEATURES = [
  {
    icon: 'car-sport' as const,
    title: 'EXPOSITION',
    desc: 'Une Exposition dans les Paddocks du Circuit F1 de Spa Francorchamps, uniquement reservee aux Voitures Sportives, SuperCars et HyperCars.',
  },
  {
    icon: 'speedometer' as const,
    title: 'TRACK DAY',
    desc: 'Un TrackDay sur le plus beau Circuit F1 du Monde de 9H00 a 18H00.',
  },
  {
    icon: 'storefront' as const,
    title: 'STANDS PRO',
    desc: 'Des Dizaines de Stands Professionnels qui vous proposeront leurs Produits, Pieces Performances, Conseils ou Prises de Rendez-vous.',
  },
  {
    icon: 'flag' as const,
    title: 'BAPTEMES',
    desc: 'Des Baptemes en Passager de Voitures de Courses (LMP2, Porsche 991 GT3 CUP, etc...), et aussi en Voitures Sportives "Classiques".',
  },
  {
    icon: 'people' as const,
    title: 'MEETING RWB',
    desc: 'RWB European Meeting',
  },
  {
    icon: 'flame' as const,
    title: 'SHOW DRIFT',
    desc: 'Show Drift',
  },
];

const SOCIALS = [
  { icon: 'logo-instagram' as const, url: 'https://instagram.com/lesbruleursdegommes' },
  { icon: 'logo-facebook' as const, url: 'https://facebook.com/LesBruleursdeGommes' },
  { icon: 'logo-tiktok' as const, url: 'https://tiktok.com/@lesbruleursdegommes' },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}

function getTimeLeft(targetDate: Date) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isLive: false,
  };
}

export default function ActusScreen() {
  const countdown = useCountdown(EVENT_DATE);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unreadCount = useAppStore((s) => s.unreadCount);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Video Hero with overlay header */}
        <View style={styles.videoContainer}>
          <Video
            source={require('../../assets/hero-video.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
          {/* Gradient overlay */}
          <View style={styles.videoOverlay} />

          {/* Header overlay on video */}
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFF" />
              {unreadCount > 0 && <View style={styles.headerBadge} />}
            </TouchableOpacity>

            <Image
              source={require('../../assets/logo bdg.webp')}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Stats overlay on video */}
          <View style={styles.statsOverlay}>
            <View style={styles.statItem}>
              <Text style={styles.statPlus}>+</Text>
              <Text style={styles.statNumber}>1000</Text>
              <Text style={styles.statLabel}>Voitures sportives selectionnees</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statPlus}>+</Text>
              <Text style={styles.statNumber}>75</Text>
              <Text style={styles.statLabel}>Stands professionnels</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statPlus}>+</Text>
              <Text style={styles.statNumber}>20000</Text>
              <Text style={styles.statLabel}>Visiteurs</Text>
            </View>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTitle}>BDG MOTOR SHOW 2026</Text>
          {countdown.isLive ? (
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN DIRECT</Text>
            </View>
          ) : (
            <View style={styles.countdownRow}>
              {[
                { n: countdown.days, l: 'JOURS' },
                { n: countdown.hours, l: 'HEURES' },
                { n: countdown.minutes, l: 'MIN.' },
                { n: countdown.seconds, l: 'SEC.' },
              ].map((item, i) => (
                <View key={i} style={styles.countdownBlock}>
                  <Text style={styles.countdownNumber}>{String(item.n).padStart(2, '0')}</Text>
                  <Text style={styles.countdownUnit}>{item.l}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* CTA Billetterie */}
        <TouchableOpacity
          style={styles.ctaCard}
          onPress={() => Linking.openURL(TICKET_URL)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/ticket-cta.jpg')}
            style={styles.ctaImage}
          />
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>CHOPPE TON TICKET !</Text>
            <Text style={styles.ctaSub}>La 10e edition ca se fete !</Text>
            <View style={styles.ctaLink}>
              <Ionicons name="time-outline" size={14} color={COLORS.primary} />
              <Text style={styles.ctaLinkText}>PAR ICI !</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Ionicons name={f.icon} size={28} color={COLORS.textMuted} />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Follow Us */}
        <Text style={styles.followTitle}>FOLLOW US</Text>
        <View style={styles.socialRow}>
          {SOCIALS.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.socialBtn}
              onPress={() => Linking.openURL(s.url)}
              activeOpacity={0.7}
            >
              <Ionicons name={s.icon} size={24} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 120 },

  // Video hero
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Header on video
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerLogo: {
    height: 45,
    width: 180,
  },

  // Stats on video
  statsOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.base,
  },
  statItem: { alignItems: 'center' },
  statPlus: { fontSize: 12, color: COLORS.zoneBapteme, fontWeight: '600' },
  statNumber: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textAlign: 'center', maxWidth: 100 },

  // Countdown
  countdownCard: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  countdownTitle: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: '#FFF', letterSpacing: 1, marginBottom: SPACING.md },
  countdownRow: { flexDirection: 'row', gap: SPACING.lg },
  countdownBlock: { alignItems: 'center', minWidth: 56 },
  countdownNumber: { fontSize: 36, fontWeight: '900', color: '#FFF', fontVariant: ['tabular-nums'] },
  countdownUnit: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginTop: 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' },
  liveText: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: '#FFF' },

  // CTA
  ctaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaImage: {
    width: 120,
    height: 120,
  },
  ctaContent: {
    flex: 1,
    padding: SPACING.base,
    justifyContent: 'center',
  },
  ctaTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.primary },
  ctaSub: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 2 },
  ctaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  ctaLinkText: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text },

  // Features grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.xl,
  },
  featureItem: {
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  featureTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Follow
  followTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '900',
    color: COLORS.text,
    marginLeft: SPACING.base,
    marginBottom: SPACING.md,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xxl,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
