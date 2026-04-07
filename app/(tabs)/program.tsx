import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';

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
    extra: 'SHOW FINAL RAUL + SOUL + DRIFTEURS',
    extraEvents: [
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

  return (
    <View style={styles.container}>
      {/* Header noir */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={{ width: 76 }} />
        <Text style={styles.headerTitle}>Programme</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {}}>
            <Ionicons name="options-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PROGRAM.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionLocation}>{section.location}</Text>
            <View style={styles.divider} />
            {section.events.map((event, j) => (
              <Text key={j} style={styles.eventTime}>
                •  {event.times}{event.name ? ` — ${event.name}` : ''}
              </Text>
            ))}
            {'extra' in section && section.extra && (
              <>
                <Text style={styles.extraLabel}>{section.extra}</Text>
                {section.extraEvents?.map((event, j) => (
                  <Text key={`e${j}`} style={styles.eventTime}>
                    •  {event.times}
                  </Text>
                ))}
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    backgroundColor: '#000',
    paddingHorizontal: SPACING.base,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerRight: { flexDirection: 'row', gap: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 1, marginBottom: 6 },

  scrollContent: { padding: SPACING.base, paddingBottom: 40 },

  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
  sectionLocation: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.md },
  eventTime: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: 4, lineHeight: 22 },
  extraLabel: { fontSize: 12, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm, marginBottom: 4, letterSpacing: 0.3 },
});
