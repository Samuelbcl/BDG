import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import { SCHEDULE } from '../../src/constants/data';
import Header from '../../src/components/Header';

export default function ProgramScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Programme</Text>
          <Text style={styles.subtitle}>Dimanche 5 Avril 2026</Text>
        </View>

        {SCHEDULE.map((item, i) => (
          <View key={item.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <Text style={styles.time}>{item.time}</Text>
              <View style={[styles.dot, { backgroundColor: item.tagColor }]} />
              {i < SCHEDULE.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: `${item.tagColor}12` }]}>
                  <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },
  header: { marginBottom: SPACING.lg },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  timelineRow: { flexDirection: 'row', gap: 14, marginBottom: 4 },
  timelineLeft: { alignItems: 'center', width: 50 },
  time: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  line: { width: 2, flex: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  card: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 12, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  cardDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
});
