import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import Header from '../../src/components/Header';

const PROGRAM = [
  {
    title: 'TRACK DAY',
    location: 'CIRCUIT',
    events: [
      { times: '9H - 12H', name: 'Session 1' },
      { times: '13H - 17H', name: 'Session 2' },
    ],
  },
  {
    title: 'PARADE SUPER CAR & HYPER CAR',
    location: 'CIRCUIT',
    events: [
      { times: '12H00 - 13H00', name: '' },
    ],
  },
  {
    title: 'SHOW DRIFT',
    location: 'PADDOCK DRIFT',
    events: [
      { times: '09H30 - 11H00', name: '' },
      { times: '13H30 - 14H30', name: '' },
      { times: '15H00 - 16H00', name: '' },
    ],
  },
  {
    title: 'SHOW FINAL',
    location: 'PADDOCK DRIFT',
    subtitle: 'RAUL + SOUL + DRIFTEURS',
    events: [
      { times: '16H30 - 17H00', name: '' },
    ],
  },
  {
    title: 'SHOW FMX',
    location: 'ZONE SHOW FMX',
    events: [
      { times: '11H45', name: '' },
      { times: '13H00', name: '' },
      { times: '15H00', name: '' },
      { times: '17H00', name: '' },
    ],
  },
  {
    title: 'SHOW DRAGSTER',
    location: 'PADDOCK DRIFT',
    events: [
      { times: '14H30', name: '' },
      { times: '16H00', name: '' },
    ],
  },
  {
    title: 'PITWALK AND GRIDWALK',
    location: 'CIRCUIT',
    events: [
      { times: '17H15 - 18H00', name: '' },
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
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionLocation}>{section.location}</Text>
            {'subtitle' in section && section.subtitle && (
              <Text style={styles.sectionSub}>{section.subtitle}</Text>
            )}
            <View style={styles.divider} />
            {section.events.map((event, j) => (
              <Text key={j} style={styles.eventTime}>
                •  {event.times}{event.name ? ` — ${event.name}` : ''}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 40 },

  pageTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: 2 },
  pageSubtitle: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: SPACING.xl },

  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  sectionLocation: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.text,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  eventTime: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 22,
  },
});
