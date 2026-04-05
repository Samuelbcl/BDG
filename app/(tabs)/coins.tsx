import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';
import { useAppStore } from '../../src/utils/store';

const MOCK_TXS = [
  { label: 'Recharge', amount: '+500', sub: 'Carte bancaire', positive: true },
  { label: 'Food Truck Burger', amount: '-85', sub: 'Stand #12', positive: false },
  { label: 'Merch BDG T-shirt', amount: '-120', sub: 'Stand officiel', positive: false },
  { label: 'Bière artisanale', amount: '-50', sub: 'Bar Zone 2', positive: false },
];

const HOW_IT_WORKS = [
  { icon: 'flash', title: 'Rechargez', desc: 'Achetez des BDG Coins via l\'app (CB, Apple Pay)', color: COLORS.accent },
  { icon: 'qr-code', title: 'Payez', desc: 'Scannez le QR du stand pour payer en coins', color: COLORS.primary },
  { icon: 'shield-checkmark', title: 'Sécurisé', desc: 'Pas de cash, pas de perte, remboursement possible', color: COLORS.success },
];

export default function CoinsScreen() {
  const balance = 245;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>BDG Coins</Text>
          <Text style={styles.subtitle}>Votre monnaie événement</Text>
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SOLDE DISPONIBLE</Text>
          <Text style={styles.balanceAmount}>
            {balance}
            <Text style={styles.balanceCurrency}> coins</Text>
          </Text>
          <Text style={styles.balanceEuro}>≈ {(balance * 0.10).toFixed(0)}€ de valeur</Text>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.rechargeBtn} activeOpacity={0.8}>
              <Text style={styles.rechargeBtnText}>Recharger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyBtn} activeOpacity={0.8}>
              <Text style={styles.historyBtnText}>Historique</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        {HOW_IT_WORKS.map((item, i) => (
          <View key={i} style={styles.howCard}>
            <View style={[styles.howIcon, { backgroundColor: `${item.color}18` }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.howTitle}>{item.title}</Text>
              <Text style={styles.howDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        {/* Recent transactions */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Dernières transactions</Text>
        {MOCK_TXS.map((tx, i) => (
          <View key={i} style={[styles.txRow, i < MOCK_TXS.length - 1 && styles.txBorder]}>
            <View>
              <Text style={styles.txLabel}>{tx.label}</Text>
              <Text style={styles.txSub}>{tx.sub}</Text>
            </View>
            <Text style={[styles.txAmount, tx.positive && { color: COLORS.success }]}>{tx.amount}</Text>
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
  subtitle: { fontSize: 12, color: COLORS.textSecondary },
  balanceCard: { borderRadius: RADIUS.xxl, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 1, borderColor: `${COLORS.accent}33`, backgroundColor: COLORS.card, padding: 28, alignItems: 'center' },
  balanceLabel: { fontSize: FONT_SIZES.sm, color: COLORS.accent, fontWeight: '700', letterSpacing: 1.5 },
  balanceAmount: { fontSize: 48, fontWeight: '900', color: COLORS.text, marginTop: 8 },
  balanceCurrency: { fontSize: 20, color: COLORS.accent },
  balanceEuro: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
  balanceActions: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  rechargeBtn: { flex: 1, padding: 12, borderRadius: 14, backgroundColor: COLORS.accent, alignItems: 'center' },
  rechargeBtnText: { fontSize: 14, fontWeight: '800', color: '#000' },
  historyBtn: { flex: 1, padding: 12, borderRadius: 14, backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  historyBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  howCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 14 },
  howIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  howTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  howDesc: { fontSize: 11, color: COLORS.textSecondary },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  txSub: { fontSize: 11, color: COLORS.textSecondary },
  txAmount: { fontSize: 15, fontWeight: '800', color: COLORS.textSecondary },
});
