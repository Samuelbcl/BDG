import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, Linking, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES, EVENT } from '../../src/constants/theme';
import { useAppStore } from '../../src/utils/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = 350;
const EVENT_DATE = new Date('2027-03-28T09:00:00+02:00');
const TICKET_URL = 'https://lesbruleursdegommes.com/billetterie/';

const NEWS_ITEMS = [
  {
    id: '1',
    date: '15 Mars 2027',
    title: 'La liste des Hypercars confirmees',
    body: 'Bugatti Chiron, Pagani Huayra, Koenigsegg Jesko... Plus de 20 hypercars au paddock.',
    image: require('../../assets/prog-parade.jpg'),
  },
  {
    id: '2',
    date: '01 Mars 2027',
    title: 'Show Drift : le lineup devoile',
    body: 'Raul, Soul et les meilleurs drifteurs europeens confirmes pour la 11e edition.',
    image: require('../../assets/prog-drift.jpg'),
  },
  {
    id: '3',
    date: '15 Fev 2027',
    title: 'Billets en vente',
    body: 'Les billets pour le BDG Motor Show 2027 sont disponibles. Reservez vite !',
    image: require('../../assets/prog-trackday.jpg'),
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
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(useCallback(() => { setStatusBarStyle('dark'); }, []));

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
      {/* Fixed header bg + logo */}
      <Animated.View style={[styles.fixedHeaderBg, { paddingTop: insets.top - 7, opacity: headerOpacity }]}>
        <Image source={require('../../assets/logo bdg.png')} style={styles.fixedLogo} resizeMode="contain" />
      </Animated.View>

      {/* Fixed icons */}
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
            shouldPlay={isPlaying}
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

          {/* Play/Pause */}
          <TouchableOpacity
            style={styles.playPauseBtn}
            onPress={() => {
              if (isPlaying) videoRef.current?.pauseAsync();
              else videoRef.current?.playAsync();
              setIsPlaying(!isPlaying);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={14} color="#FFF" />
          </TouchableOpacity>

          {/* Stats on video */}
          <View style={styles.statsOverlay}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Voitures</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>75+</Text>
              <Text style={styles.statLabel}>Stands</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>20000+</Text>
              <Text style={styles.statLabel}>Visiteurs</Text>
            </View>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTitle}>BDG MOTOR SHOW 2027</Text>
          {countdown.isLive ? (
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN DIRECT</Text>
            </View>
          ) : (
            <View style={styles.countdownRow}>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>{String(countdown.days).padStart(2, '0')}</Text>
                <Text style={styles.countdownUnit}>Jours</Text>
              </View>
              <Text style={styles.countdownSep}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>{String(countdown.hours).padStart(2, '0')}</Text>
                <Text style={styles.countdownUnit}>Heures</Text>
              </View>
              <Text style={styles.countdownSep}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>{String(countdown.minutes).padStart(2, '0')}</Text>
                <Text style={styles.countdownUnit}>Min.</Text>
              </View>
              <Text style={styles.countdownSep}>:</Text>
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownNumber}>{String(countdown.seconds).padStart(2, '0')}</Text>
                <Text style={styles.countdownUnit}>Sec.</Text>
              </View>
            </View>
          )}
        </View>

        {/* CTA Billetterie - full width */}
        <TouchableOpacity style={styles.ctaCard} onPress={() => Linking.openURL(TICKET_URL)} activeOpacity={0.8}>
          <ImageBackground source={require('../../assets/ticket-cta.jpg')} style={styles.ctaBg} imageStyle={styles.ctaBgImage}>
            <View style={styles.ctaOverlay} />
            <Text style={styles.ctaTitle}>CHOPPE TON TICKET !</Text>
            <Text style={styles.ctaSub}>La 11e edition - ca va etre enorme</Text>
            <View style={styles.ctaLink}>
              <Text style={styles.ctaLinkText}>PAR ICI</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* News */}
        {NEWS_ITEMS.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <Image source={item.image} style={styles.newsImage} resizeMode="cover" />
            <View style={styles.newsContent}>
              <Text style={styles.newsDate}>{item.date}</Text>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsBody}>{item.body}</Text>
            </View>
          </View>
        ))}

        {/* Follow Us */}
        <View style={styles.followSection}>
          <Text style={styles.followTitle}>FOLLOW US</Text>
          <View style={styles.socialRow}>
            {SOCIALS.map((s, i) => (
              <TouchableOpacity key={i} style={styles.socialBtn} onPress={() => Linking.openURL(s.url)} activeOpacity={0.7}>
                <Ionicons name={s.icon} size={22} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 20 },

  // Fixed header
  fixedHeaderBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fixedLogo: { height: 40, width: 150 },
  fixedIcons: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 101,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: 4,
  },
  fixedHeaderBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  fixedBadge: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },

  // Video
  videoContainer: { width: SCREEN_WIDTH, height: VIDEO_HEIGHT, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  playPauseBtn: {
    position: 'absolute',
    bottom: 52,
    right: 12,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats on video
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  statNumber: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: 1 },

  // Countdown
  countdownCard: {
    backgroundColor: '#000',
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  countdownTitle: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: 3, marginBottom: SPACING.md },
  countdownRow: { flexDirection: 'row', alignItems: 'center' },
  countdownBlock: { alignItems: 'center', minWidth: 60 },
  countdownNumber: { fontSize: 40, fontWeight: '200', color: '#FFF', fontVariant: ['tabular-nums'], letterSpacing: -1 },
  countdownUnit: { fontSize: 8, fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginTop: 4 },
  countdownSep: { fontSize: 30, fontWeight: '200', color: 'rgba(255,255,255,0.3)', marginHorizontal: 4, marginBottom: 14 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  liveText: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: COLORS.primary },

  // CTA
  ctaCard: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaBg: {
    height: 180,
    justifyContent: 'flex-end',
    padding: SPACING.xl,
  },
  ctaBgImage: {},
  ctaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  ctaTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
  ctaSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  ctaLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
  },
  ctaLinkText: { fontSize: 13, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },

  // News
  newsCard: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: SPACING.base,
  },
  newsDate: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 4 },
  newsTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  newsBody: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },

  // Follow
  followSection: {
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },
  followTitle: { fontSize: 14, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: SPACING.md },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
