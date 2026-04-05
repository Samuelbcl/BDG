import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';
import CircuitMap from '../../src/components/CircuitMap';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Carte du Circuit</Text>
          <Text style={styles.subtitle}>Circuit de Spa-Francorchamps</Text>
          <Text style={styles.hint}>Touchez un point pour voir les details</Text>
        </View>

        <CircuitMap />
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
  hint: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
});
