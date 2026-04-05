import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES, EVENT } from '../../src/constants/theme';
import { useAppStore } from '../../src/utils/store';

const FEATURED_CARS = [
  { id: '1', name: 'Lamborghini Revuelto', owner: '@supercar_be', votes: 847 },
  { id: '2', name: 'Ferrari SF90 Stradale', owner: '@ferrari_lux', votes: 723 },
  { id: '3', name: 'Porsche 911 GT3 RS', owner: '@gt3_addict', votes: 691 },
  { id: '4', name: 'McLaren 750S', owner: '@mclaren_fans', votes: 654 },
];

export default function HomeScreen() {
  const router = useRouter();
  const { unreadCount } = useAppStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.edition}>{EVENT.edition}</Text>
            <Text style={styles.title}>
              <Text style={{ color: COLORS.text }}>BDG </Text>
              <Text style={{ color: COLORS.primary }}>Motor Show</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            {unreadCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroAccent} />
          <View style={styles.heroContent}>
            <View style={styles.liveRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.locationText}>{EVENT.location}</Text>
            </View>
            <Text style={styles.heroDate}>
              <Text style={{ color: COLORS.text }}>05</Text>
              <Text style={{ color: COLORS.primary }}>.04</Text>
              <Text style={{ color: COLORS.text }}>.2026</Text>
            </Text>
            <Text style={styles.heroSub}>Le plus grand evenement Supercars de Belgique</Text>
            <View style={styles.statsRow}>
              {[
                { n: EVENT.stats.cars, l: 'Voitures' },
                { n: EVENT.stats.visitors, l: 'Visiteurs' },
                { n: EVENT.stats.stands, l: 'Stands' },
              ].map((s, i) => (
                <View key={i} style={styles.statBox}>
                  <Text style={styles.statNumber}>{s.n}</Text>
                  <Text style={styles.statLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          {[
            { icon: 'qr-code', label: 'Mon Billet', sub: 'QR Code', color: COLORS.primary, tab: 'tickets' },
            { icon: 'map', label: 'Carte', sub: 'Interactive', color: COLORS.zoneCircuit, tab: 'map' },
            { icon: 'car-sport', label: 'Baptemes', sub: 'Reserver', color: COLORS.zoneBapteme, tab: 'program' },
            { icon: 'wallet', label: 'BDG Coins', sub: '245 coins', color: COLORS.success, tab: 'coins' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => router.push(`/(tabs)/${action.tab}` as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}12` }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSub}>{action.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Event */}
        <TouchableOpacity style={styles.nextEvent} activeOpacity={0.8}>
          <View style={styles.nextEventIcon}>
            <Ionicons name="flag" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nextEventTag}>EN COURS</Text>
            <Text style={styles.nextEventTitle}>TrackDay - Session 1</Text>
            <Text style={styles.nextEventSub}>09:00 - 10:30 -- Piste principale</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Top Votes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Votes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {FEATURED_CARS.map((car, i) => (
            <TouchableOpacity key={car.id} style={[
              styles.carCard,
              i === 0 && styles.carCardFirst,
            ]} activeOpacity={0.7}>
              <View style={[styles.carRank, i === 0 && styles.carRankFirst]}>
                <Text style={[styles.carRankText, i === 0 && { color: '#FFF' }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.carName}>{car.name}</Text>
                <Text style={styles.carOwner}>{car.owner}</Text>
              </View>
              <View style={styles.carVotes}>
                <Ionicons name="star" size={14} color={COLORS.primary} />
                <Text style={styles.carVoteCount}>{car.votes}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  edition: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontSize: FONT_SIZES.xxxl, fontWeight: '800', letterSpacing: -0.5 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  heroCard: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  heroAccent: { height: 4, backgroundColor: COLORS.primary },
  heroContent: { padding: SPACING.xl },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.md },
  liveBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  liveText: { color: '#FFF', fontSize: FONT_SIZES.xs, fontWeight: '800', letterSpacing: 0.5 },
  locationText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  heroDate: { fontSize: FONT_SIZES.hero, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  heroSub: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: '600' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  actionCard: { width: '48%', flexGrow: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.base, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 42, height: 42, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: COLORS.text, fontSize: FONT_SIZES.base, fontWeight: '700' },
  actionSub: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },
  nextEvent: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: `${COLORS.primary}33`, borderRadius: RADIUS.lg, padding: 14, marginBottom: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: 14 },
  nextEventIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: `${COLORS.primary}0D`, alignItems: 'center', justifyContent: 'center' },
  nextEventTag: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  nextEventTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  nextEventSub: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  section: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  carCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 12, marginBottom: 8 },
  carCardFirst: { backgroundColor: `${COLORS.primary}08`, borderColor: `${COLORS.primary}22` },
  carRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  carRankFirst: { backgroundColor: COLORS.primary },
  carRankText: { fontSize: FONT_SIZES.base, fontWeight: '900', color: COLORS.textSecondary },
  carName: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text },
  carOwner: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  carVotes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  carVoteCount: { fontSize: FONT_SIZES.base, fontWeight: '800', color: COLORS.primary },
});
