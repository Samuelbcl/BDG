import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import { useAppStore } from '../../src/utils/store';

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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unreadCount = useAppStore((s) => s.unreadCount);

  return (
    <View style={styles.container}>
      {/* Header noir avec PROGRAMME centre */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={22} color="#FFF" />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>PROGRAMME</Text>
          <Text style={styles.headerSubtitle}>BDG MOTOR SHOW | CIRCUIT SPA FRANCORCHAMPS</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

  // Header noir
  header: {
    backgroundColor: '#000',
    paddingHorizontal: SPACING.base,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  headerSubtitle: { fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 1, marginTop: 2 },

  scrollContent: { padding: SPACING.base, paddingBottom: 40 },

  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
  sectionLocation: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5, marginTop: 2 },
  sectionSub: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.md },
  eventTime: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: 4, lineHeight: 22 },
});
