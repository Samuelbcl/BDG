import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';
import { ZONES } from '../../src/constants/data';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Carte Interactive</Text>
          <Text style={styles.subtitle}>Circuit de Spa-Francorchamps</Text>
        </View>

        {/* Map placeholder - will be replaced with react-native-maps */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={COLORS.primary} />
          <Text style={styles.mapText}>Carte interactive GPS</Text>
          <Text style={styles.mapSubtext}>React Native Maps + overlay zones</Text>
        </View>

        {/* Zones list */}
        <Text style={styles.sectionTitle}>Zones</Text>
        {ZONES.map((zone) => (
          <View key={zone.id} style={styles.zoneCard}>
            <View style={[styles.zoneBar, { backgroundColor: zone.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={styles.zoneDesc}>{zone.description}</Text>
            </View>
            <View style={[styles.zoneInfo, { backgroundColor: `${zone.color}15` }]}>
              <Text style={[styles.zoneInfoText, { color: zone.color }]}>{zone.info}</Text>
            </View>
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
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  mapPlaceholder: { height: 220, borderRadius: RADIUS.xl, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  mapText: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  mapSubtext: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  zoneCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 14 },
  zoneBar: { width: 10, height: 40, borderRadius: 5 },
  zoneName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  zoneDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  zoneInfo: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  zoneInfoText: { fontSize: FONT_SIZES.xs, fontWeight: '700' },
});
