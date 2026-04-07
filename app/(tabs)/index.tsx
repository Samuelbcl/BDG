import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, Linking, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
  { icon: 'car-sport-outline' as const, title: 'EXPOSITION', desc: 'Exposition dans les Paddocks du Circuit F1 de Spa Francorchamps, reservee aux Sportives, SuperCars et HyperCars.' },
  { icon: 'flag-outline' as const, title: 'TRACK DAY', desc: 'Un TrackDay sur le plus beau Circuit F1 du Monde de 9H00 a 18H00.' },
  { icon: 'cog-outline' as const, title: 'STANDS PRO', desc: 'Des Dizaines de Stands Professionnels avec Produits, Pieces Performances et Conseils.' },
  { icon: 'speedometer-outline' as const, title: 'BAPTEMES', desc: 'Baptemes en Passager de Voitures de Courses : LMP2, Porsche 991 GT3 CUP, et Sportives Classiques.' },
  { icon: 'car-outline' as const, title: 'MEETING RWB', desc: 'RWB European Meeting' },
  { icon: 'flame-outline' as const, title: 'SHOW DRIFT', desc: 'Show Drift' },
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
  const videoRef = useRef<Video>(null);
  const [showHeader, setShowHeader] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShow = y > 50;
    if (shouldShow !== showHeader) {
      setShowHeader(shouldShow);
      Animated.timing(headerOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed header background + logo - appears on scroll */}
      <Animated.View style={[styles.fixedHeaderBg, { paddingTop: insets.top - 12, opacity: headerOpacity }]}>
        <Image source={require('../../assets/logo bdg.png')} style={styles.fixedLogo} resizeMode="contain" />
      </Animated.View>

      {/* Fixed icons - always visible */}
      <View style={[styles.fixedIcons, { paddingTop: insets.top + 5 }]}>
        <TouchableOpacity style={styles.fixedHeaderBtn} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={22} color={showHeader ? COLORS.text : '#FFF'} />
          {unreadCount > 0 && <View style={styles.fixedBadge} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.fixedHeaderBtn} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={22} color={showHeader ? COLORS.text : '#FFF'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Video Hero */}
        <View style={styles.videoContainer}>
          <Video
            source={require('../../assets/hero-video.mp4')}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            onPlaybackStatusUpdate={(status) => {
              if ('didJustFinish' in status && status.didJustFinish) {
                videoRef.current?.replayAsync();
              }
            }}
            ref={videoRef}
          />
          <View style={styles.videoOverlay} />

          {/* Stats overlay */}
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
        <TouchableOpacity style={styles.ctaCard} onPress={() => Linking.openURL(TICKET_URL)} activeOpacity={0.8}>
          <Image source={require('../../assets/ticket-cta.jpg')} style={styles.ctaImage} />
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>CHOPPE TON TICKET !</Text>
            <Text style={styles.ctaSub}>La 10e edition ca se fete !</Text>
            <View style={styles.ctaLink}>
              <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
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
            <TouchableOpacity key={i} style={styles.socialBtn} onPress={() => Linking.openURL(s.url)} activeOpacity={0.7}>
              <Ionicons name={s.icon} size={22} color="#FFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 20 },

  // Fixed header bg + logo (appears on scroll)
  fixedHeaderBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fixedLogo: { height: 40, width: 150 },
  // Fixed icons (always visible)
  fixedIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 101,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: 4,
  },
  fixedHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // Video hero
  videoContainer: { width: SCREEN_WIDTH, height: VIDEO_HEIGHT, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },

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
  statPlus: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '400', position: 'absolute', top: -2, left: -10 },
  statNumber: { fontSize: 26, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '500', textAlign: 'center', maxWidth: 100 },

  // Countdown
  countdownCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: RADIUS.sm,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countdownTitle: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text, letterSpacing: 1, marginBottom: SPACING.md },
  countdownRow: { flexDirection: 'row', gap: SPACING.lg },
  countdownBlock: { alignItems: 'center', minWidth: 56 },
  countdownNumber: { fontSize: 36, fontWeight: '900', color: COLORS.primary, fontVariant: ['tabular-nums'] },
  countdownUnit: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1, marginTop: 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  liveText: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: COLORS.primary },

  // CTA
  ctaCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaImage: { width: 120, height: 120 },
  ctaContent: { flex: 1, padding: SPACING.base, justifyContent: 'center' },
  ctaTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.text },
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
  followTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.text, marginLeft: SPACING.base, marginBottom: SPACING.md },
  socialRow: { flexDirection: 'row', gap: 12, paddingHorizontal: SPACING.base, marginBottom: SPACING.base },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
