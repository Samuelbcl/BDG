import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';

const TICKET_TYPES = [
  { type: 'Standard', price: '35EUR', desc: 'Acces paddocks + expo', avail: true },
  { type: 'VIP', price: '89EUR', desc: 'Paddocks + zone VIP + cadeau', avail: true },
  { type: 'Bapteme Pack', price: '255EUR', desc: 'Standard + 3 tours en LMP2', avail: false },
];

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Billet</Text>
          <Text style={styles.subtitle}>Billetterie securisee BDG</Text>
        </View>

        {/* Ticket card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketAccent} />
          <View style={styles.ticketTop}>
            <View style={styles.ticketHeader}>
              <View>
                <Text style={styles.ticketEdition}>BDG MOTOR SHOW 2026</Text>
                <Text style={styles.ticketType}>Pass Journee</Text>
              </View>
              <View style={styles.validBadge}>
                <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
                <Text style={styles.validText}>VALIDE</Text>
              </View>
            </View>

            {/* QR placeholder */}
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={80} color={COLORS.textMuted} />
                <Text style={styles.qrNote}>QR Code unique anti-fraude</Text>
              </View>
            </View>

            <View style={styles.ticketCode}>
              <Text style={styles.codeText}>BDG-2026-XXXX-XXXX</Text>
              <Text style={styles.codeSub}>Presentez ce QR code a l'entree</Text>
            </View>
          </View>

          <View style={styles.ticketDivider} />

          <View style={styles.ticketBottom}>
            <View>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>05/04/2026</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Acces</Text>
              <Text style={styles.metaValue}>09:00 - 18:00</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Type</Text>
              <Text style={[styles.metaValue, { color: COLORS.primary }]}>Standard</Text>
            </View>
          </View>
        </View>

        {/* Anti-fraud badge */}
        <View style={styles.antiFraud}>
          <Ionicons name="shield-checkmark" size={22} color={COLORS.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.antiFraudTitle}>Billet Anti-Fraude</Text>
            <Text style={styles.antiFraudDesc}>QR unique, non-duplicable. Fini les faux billets et les arnaques.</Text>
          </View>
        </View>

        {/* Buy tickets */}
        <Text style={styles.sectionTitle}>Acheter des billets</Text>
        {TICKET_TYPES.map((t, i) => (
          <TouchableOpacity key={i} style={[styles.buyCard, !t.avail && { opacity: 0.5 }]} activeOpacity={t.avail ? 0.7 : 1}>
            <View>
              <Text style={styles.buyType}>{t.type}</Text>
              <Text style={styles.buyDesc}>{t.desc}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.buyPrice}>{t.price}</Text>
              {!t.avail && <Text style={styles.soldOut}>SOLD OUT</Text>}
            </View>
          </TouchableOpacity>
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
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  ticketCard: { borderRadius: RADIUS.xxl, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card },
  ticketAccent: { height: 4, backgroundColor: COLORS.primary },
  ticketTop: { padding: SPACING.xl },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.base },
  ticketEdition: { fontSize: FONT_SIZES.xs, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5 },
  ticketType: { fontSize: FONT_SIZES.xxl, fontWeight: '900', color: COLORS.text, marginTop: 4 },
  validBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${COLORS.success}12`, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  validText: { fontSize: FONT_SIZES.xs, fontWeight: '800', color: COLORS.success },
  qrContainer: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.base, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.base },
  qrPlaceholder: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  qrNote: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 8 },
  ticketCode: { alignItems: 'center' },
  codeText: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text, letterSpacing: 2, fontFamily: 'monospace' },
  codeSub: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 4 },
  ticketDivider: { borderTopWidth: 2, borderStyle: 'dashed', borderColor: COLORS.border, marginHorizontal: SPACING.base },
  ticketBottom: { padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: 9, color: COLORS.textSecondary, fontWeight: '600', textTransform: 'uppercase' },
  metaValue: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text },
  antiFraud: { backgroundColor: `${COLORS.success}08`, borderWidth: 1, borderColor: `${COLORS.success}22`, borderRadius: RADIUS.lg, padding: SPACING.base, flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: SPACING.lg },
  antiFraudTitle: { fontSize: FONT_SIZES.base, fontWeight: '700', color: COLORS.text },
  antiFraudDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  buyCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buyType: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  buyDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  buyPrice: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: COLORS.primary },
  soldOut: { fontSize: 9, color: COLORS.primary, fontWeight: '700' },
});
