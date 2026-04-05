import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, EVENT } from '../../src/constants/theme';
import Header from '../../src/components/Header';

const EVENT_DATE = new Date('2026-04-05T09:00:00+02:00');
const TICKET_URL = 'https://lesbruleursdegommes.com/billetterie/';

const NEWS_ITEMS = [
  {
    id: '1',
    date: '02 Avr 2026',
    title: 'La liste des Hypercars confirmees',
    body: 'Bugatti Chiron, Pagani Huayra, Koenigsegg Jesko... Plus de 20 hypercars seront presentes au paddock.',
  },
  {
    id: '2',
    date: '28 Mars 2026',
    title: 'Nouveaux baptemes disponibles',
    body: 'Un prototype LMP2 rejoint la flotte de baptemes. 3 tours de Spa-Francorchamps a bord d\'une bete de course.',
  },
  {
    id: '3',
    date: '20 Mars 2026',
    title: 'Le plan du circuit est en ligne',
    body: 'Retrouvez la carte interactive avec tous les paddocks, zones de restauration et stands professionnels.',
  },
  {
    id: '4',
    date: '15 Mars 2026',
    title: '10e edition : programme special',
    body: 'Pour les 10 ans du BDG Motor Show, un defile exceptionnel de 50 hypercars est prevu sur le circuit.',
  },
  {
    id: '5',
    date: '01 Mars 2026',
    title: 'Billets en vente',
    body: 'Les billets pour le BDG Motor Show 2026 sont disponibles. Pass Standard 35EUR, Pass VIP 89EUR.',
  },
];

const SOCIALS = [
  { icon: 'logo-instagram' as const, url: 'https://instagram.com/lesbruleursdegommes', color: '#E1306C' },
  { icon: 'logo-facebook' as const, url: 'https://facebook.com/LesBruleursdeGommes', color: '#1877F2' },
  { icon: 'logo-tiktok' as const, url: 'https://tiktok.com/@lesbruleursdegommes', color: '#FFF' },
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

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require('../../assets/logo bdg.webp')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroSubtitle}>{EVENT.edition}</Text>
          <Text style={styles.heroLocation}>{EVENT.dateDisplay} • {EVENT.location}</Text>
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
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>CHOPPE TON TICKET !</Text>
            <Text style={styles.ctaSub}>10e edition - ca se fete !</Text>
            <View style={styles.ctaLink}>
              <Ionicons name="time-outline" size={14} color={COLORS.primary} />
              <Text style={styles.ctaLinkText}>PAR ICI !</Text>
            </View>
          </View>
          <Ionicons name="ticket" size={40} color={COLORS.primary} />
        </TouchableOpacity>

        {/* News */}
        {NEWS_ITEMS.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <Text style={styles.newsDate}>{item.date}</Text>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsBody}>{item.body}</Text>
          </View>
        ))}

        {/* Follow Us */}
        <Text style={styles.followTitle}>FOLLOW US</Text>
        <View style={styles.socialRow}>
          {SOCIALS.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.socialBtn, { backgroundColor: COLORS.primary }]}
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

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  heroLogo: { width: 240, height: 80, marginBottom: SPACING.md },
  heroSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  heroLocation: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 4 },

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
  countdownNumber: { fontSize: 32, fontWeight: '900', color: '#FFF', fontVariant: ['tabular-nums'] },
  countdownUnit: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginTop: 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' },
  liveText: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: '#FFF' },

  // CTA
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaContent: { flex: 1 },
  ctaTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.primary },
  ctaSub: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: 2 },
  ctaLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  ctaLinkText: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text },

  // News
  newsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newsDate: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginBottom: 4 },
  newsTitle: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  newsBody: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 18 },

  // Follow
  followTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.text, marginTop: SPACING.xxl, marginLeft: SPACING.base, marginBottom: SPACING.md },
  socialRow: { flexDirection: 'row', gap: 12, paddingHorizontal: SPACING.base, marginBottom: SPACING.xxl },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
