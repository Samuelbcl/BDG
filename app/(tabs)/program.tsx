import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';
import Header from '../../src/components/Header';

interface ProgramSection {
  title: string;
  location: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  events: { name: string; times: string }[];
}

const PROGRAM: ProgramSection[] = [
  {
    title: 'TRACK DAY',
    location: 'CIRCUIT',
    icon: 'speedometer',
    color: COLORS.primary,
    events: [
      { name: 'Session 1', times: '9H - 12H' },
      { name: 'Session 2', times: '13H - 17H' },
    ],
  },
  {
    title: 'PARADE SUPER CAR & HYPER CAR',
    location: 'CIRCUIT',
    icon: 'car-sport',
    color: COLORS.primary,
    events: [
      { name: 'Parade', times: '12H00 - 13H00' },
    ],
  },
  {
    title: 'SHOW DRIFT',
    location: 'PADDOCK DRIFT',
    icon: 'flame',
    color: COLORS.zoneBapteme,
    events: [
      { name: 'Session 1', times: '09H30 - 11H00' },
      { name: 'Session 2', times: '13H30 - 14H30' },
      { name: 'Session 3', times: '15H00 - 16H00' },
      { name: 'Show Final Raul + Soul + Drifteurs', times: '16H30 - 17H00' },
    ],
  },
  {
    title: 'SHOW FMX',
    location: 'ZONE SHOW FMX',
    icon: 'bicycle',
    color: COLORS.zoneEauRouge,
    events: [
      { name: 'Show 1', times: '11H45' },
      { name: 'Show 2', times: '13H00' },
      { name: 'Show 3', times: '15H00' },
      { name: 'Show 4', times: '17H00' },
    ],
  },
  {
    title: 'SHOW DRAGSTER',
    location: 'PADDOCK DRIFT',
    icon: 'flash',
    color: COLORS.zonePitLane,
    events: [
      { name: 'Session 1', times: '14H30' },
      { name: 'Session 2', times: '16H00' },
    ],
  },
  {
    title: 'PITWALK & GRIDWALK',
    location: 'CIRCUIT',
    icon: 'walk',
    color: COLORS.zoneVIP,
    events: [
      { name: 'Acces pit lane & grille', times: '17H15 - 18H00' },
    ],
  },
];

export default function ProgramScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>PROGRAMME</Text>
        <Text style={styles.pageSubtitle}>BDG MOTOR SHOW | CIRCUIT SPA FRANCORCHAMPS</Text>

        {PROGRAM.map((section, i) => (
          <View key={i} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <Ionicons name={section.icon} size={18} color="#FFF" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionLocation}>{section.location}</Text>
              </View>
            </View>
            <View style={[styles.sectionDivider, { backgroundColor: section.color }]} />
            {section.events.map((event, j) => (
              <View key={j} style={styles.eventRow}>
                <Text style={styles.eventBullet}>•</Text>
                <Text style={styles.eventText}>
                  <Text style={styles.eventTime}>{event.times}</Text>
                  {event.name !== event.times && (
                    <Text style={styles.eventName}> — {event.name}</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },

  pageTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: 4 },
  pageSubtitle: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: SPACING.xl },

  section: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.text },
  sectionLocation: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, fontWeight: '600', letterSpacing: 0.5, marginTop: 1 },
  sectionDivider: { height: 2, borderRadius: 1, marginBottom: SPACING.md },

  eventRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  eventBullet: { fontSize: 16, color: COLORS.text, lineHeight: 20 },
  eventText: { flex: 1, lineHeight: 20 },
  eventTime: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text },
  eventName: { fontSize: FONT_SIZES.md, fontWeight: '400', color: COLORS.textSecondary },
});
