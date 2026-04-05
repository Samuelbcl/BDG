import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  useEffect(() => {
    Linking.openURL(SITE_URL).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="information-circle" size={48} color={COLORS.zoneCircuit} />
        </View>
        <Text style={styles.title}>Les Bruleurs de Gommes</Text>
        <Text style={styles.desc}>
          Retrouvez toutes les informations sur l'evenement sur le site officiel.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(SITE_URL)}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Ouvrir le site</Text>
        </TouchableOpacity>
        <Text style={styles.url}>{SITE_URL}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: `${COLORS.zoneCircuit}0D`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  desc: { fontSize: FONT_SIZES.lg, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl, maxWidth: 280 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.base,
  },
  buttonText: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#FFF' },
  url: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
});
