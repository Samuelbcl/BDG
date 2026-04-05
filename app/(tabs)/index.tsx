import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, EVENT } from '../../src/constants/theme';

const EVENT_DATE = new Date('2026-04-05T07:30:00+02:00');

const NEWS_ITEMS = [
  {
    id: '1',
    date: '02 Avr 2026',
    title: 'La liste des Hypercars confirmees',
    body: 'Bugatti Chiron, Pagani Huayra, Koenigsegg Jesko... Plus de 20 hypercars seront presentes au paddock VIP cette annee.',
    tag: 'PADDOCK',
    tagColor: COLORS.primary,
  },
  {
    id: '2',
    date: '28 Mars 2026',
    title: 'Nouveaux baptemes disponibles',
    body: 'Cette annee, un prototype LMP2 rejoint la flotte de baptemes. 3 tours de Spa-Francorchamps a bord d\'une bete de course.',
    tag: 'BAPTEME',
    tagColor: COLORS.zoneBapteme,
  },
  {
    id: '3',
    date: '20 Mars 2026',
    title: 'Le plan du circuit est en ligne',
    body: 'Retrouvez la carte interactive avec tous les paddocks, zones de restauration et stands professionnels.',
    tag: 'CARTE',
    tagColor: COLORS.zoneCircuit,
  },
  {
    id: '4',
    date: '15 Mars 2026',
    title: '10e edition : programme special',
    body: 'Pour les 10 ans du BDG Motor Show, un defile exceptionnel de 50 hypercars est prevu a 11h dans les paddocks.',
    tag: 'SHOW',
    tagColor: COLORS.zoneStands,
  },
  {
    id: '5',
    date: '01 Mars 2026',
    title: 'Billets en vente',
    body: 'Les billets pour le BDG Motor Show 2026 sont disponibles. Pass Standard 35EUR, Pass VIP 89EUR.',
    tag: 'BILLETTERIE',
    tagColor: COLORS.success,
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.edition}>{EVENT.edition}</Text>
          <Text style={styles.title}>
            <Text style={{ color: COLORS.text }}>BDG </Text>
            <Text style={{ color: COLORS.primary }}>Motor Show</Text>
          </Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <View style={styles.countdownAccent} />
          <View style={styles.countdownContent}>
            {countdown.isLive ? (
              <View style={styles.liveContainer}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>EN DIRECT</Text>
                </View>
                <Text style={styles.liveTitle}>L'evenement est en cours !</Text>
                <Text style={styles.liveSub}>{EVENT.location}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.countdownLabel}>PROCHAIN EVENEMENT</Text>
                <View style={styles.countdownRow}>
                  <View style={styles.countdownBlock}>
                    <Text style={styles.countdownNumber}>{String(countdown.days).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>JOURS</Text>
                  </View>
                  <Text style={styles.countdownSep}>:</Text>
                  <View style={styles.countdownBlock}>
                    <Text style={styles.countdownNumber}>{String(countdown.hours).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>HEURES</Text>
                  </View>
                  <Text style={styles.countdownSep}>:</Text>
                  <View style={styles.countdownBlock}>
                    <Text style={styles.countdownNumber}>{String(countdown.minutes).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>MIN</Text>
                  </View>
                  <Text style={styles.countdownSep}>:</Text>
                  <View style={styles.countdownBlock}>
                    <Text style={styles.countdownNumber}>{String(countdown.seconds).padStart(2, '0')}</Text>
                    <Text style={styles.countdownUnit}>SEC</Text>
                  </View>
                </View>
                <Text style={styles.countdownDate}>{EVENT.dateDisplay} -- {EVENT.location}</Text>
              </>
            )}
          </View>
        </View>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          {[
            { n: EVENT.stats.cars, l: 'Voitures' },
            { n: EVENT.stats.visitors, l: 'Visiteurs' },
            { n: EVENT.stats.stands, l: 'Stands' },
            { n: EVENT.stats.baptemes, l: 'Baptemes' },
          ].map((s, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statNumber}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Actualites */}
        <Text style={styles.sectionTitle}>Actualites</Text>
        {NEWS_ITEMS.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <View style={styles.newsHeader}>
              <View style={[styles.newsTag, { backgroundColor: `${item.tagColor}12` }]}>
                <Text style={[styles.newsTagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
              <Text style={styles.newsDate}>{item.date}</Text>
            </View>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsBody}>{item.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },

  header: { marginBottom: SPACING.lg },
  edition: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontSize: FONT_SIZES.xxxl, fontWeight: '800', letterSpacing: -0.5 },

  // Countdown
  countdownCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  countdownAccent: { height: 4, backgroundColor: COLORS.primary },
  countdownContent: { padding: SPACING.xl, alignItems: 'center' },
  countdownLabel: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.primary, letterSpacing: 2, marginBottom: SPACING.base },
  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.base },
  countdownBlock: { alignItems: 'center', minWidth: 56 },
  countdownNumber: { fontSize: 36, fontWeight: '900', color: COLORS.text, fontVariant: ['tabular-nums'] },
  countdownUnit: { fontSize: 9, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginTop: 2 },
  countdownSep: { fontSize: 28, fontWeight: '300', color: COLORS.textMuted, marginBottom: 14 },
  countdownDate: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },

  // Live state
  liveContainer: { alignItems: 'center' },
  liveBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' },
  liveText: { color: '#FFF', fontSize: FONT_SIZES.md, fontWeight: '800', letterSpacing: 1 },
  liveTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  liveSub: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xl },
  statBox: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '600' },

  // News
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  newsCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.base, marginBottom: 10 },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  newsTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  newsTagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  newsDate: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  newsTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  newsBody: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, lineHeight: 18 },
});
