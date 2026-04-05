import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';
import Header from '../../src/components/Header';

type SubTab = 'compte' | 'partenaire' | 'settings';

const PARTNERS = [
  { name: 'AF MotorSport', role: 'Baptemes sur circuit', url: '' },
  { name: 'Motortech', role: 'Partenaire technique', url: '' },
  { name: 'K\'Mystik', role: 'Adrenaline Experience', url: '' },
  { name: 'Purefect', role: 'Detailing automobile', url: '' },
  { name: 'Circuit de Spa-Francorchamps', role: 'Lieu de l\'evenement', url: 'https://www.spa-francorchamps.be' },
];

function CompteTab() {
  return (
    <View>
      {/* Profile placeholder */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={COLORS.textMuted} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Visiteur</Text>
          <Text style={styles.profileEmail}>Non connecte</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="log-in-outline" size={20} color={COLORS.primary} />
        <Text style={styles.menuLabel}>Se connecter</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="person-add-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Creer un compte</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="ticket-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Mes billets</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="car-sport-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Mes reservations baptemes</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="star-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Mes votes</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
    </View>
  );
}

function PartenaireTab() {
  return (
    <View>
      <Text style={styles.partnerIntro}>
        Merci a nos partenaires qui rendent le BDG Motor Show possible chaque annee.
      </Text>
      {PARTNERS.map((p, i) => (
        <TouchableOpacity
          key={i}
          style={styles.partnerCard}
          activeOpacity={p.url ? 0.7 : 1}
          onPress={() => p.url && Linking.openURL(p.url)}
        >
          <View style={styles.partnerIcon}>
            <Ionicons name="business" size={20} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{p.name}</Text>
            <Text style={styles.partnerRole}>{p.role}</Text>
          </View>
          {p.url ? (
            <Ionicons name="open-outline" size={16} color={COLORS.textMuted} />
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SettingsTab() {
  const [notifs, setNotifs] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <View>
      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Text style={styles.settingDesc}>Recevoir les alertes de l'evenement</Text>
        </View>
        <Switch
          value={notifs}
          onValueChange={setNotifs}
          trackColor={{ false: COLORS.border, true: `${COLORS.primary}66` }}
          thumbColor={notifs ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.settingLabel}>Localisation</Text>
          <Text style={styles.settingDesc}>Utiliser le GPS pour la carte interactive</Text>
        </View>
        <Switch
          value={location}
          onValueChange={setLocation}
          trackColor={{ false: COLORS.border, true: `${COLORS.primary}66` }}
          thumbColor={location ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="document-text-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Conditions generales</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="shield-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Politique de confidentialite</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
        <Ionicons name="mail-outline" size={20} color={COLORS.text} />
        <Text style={styles.menuLabel}>Contacter le support</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.versionBox}>
        <Text style={styles.versionText}>BDG Motor Show v1.0.0</Text>
        <Text style={styles.versionSub}>Les Bruleurs de Gommes - 10e edition</Text>
      </View>
    </View>
  );
}

export default function SuiteScreen() {
  const [activeTab, setActiveTab] = useState<SubTab>('compte');

  const TABS: { key: SubTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'compte', label: 'Compte', icon: 'person-outline' },
    { key: 'partenaire', label: 'Partenaires', icon: 'people-outline' },
    { key: 'settings', label: 'Reglages', icon: 'settings-outline' },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Sub-tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeTab === tab.key ? '#FFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {activeTab === 'compte' && <CompteTab />}
        {activeTab === 'partenaire' && <PartenaireTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },

  header: { marginBottom: SPACING.lg },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },

  // Sub-tabs
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: SPACING.xl },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFF' },

  // Profile
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text },
  profileEmail: { fontSize: FONT_SIZES.md, color: COLORS.textMuted },

  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLabel: { fontSize: FONT_SIZES.lg, fontWeight: '500', color: COLORS.text },

  // Partners
  partnerIntro: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.lg },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 8,
  },
  partnerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}0D`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  partnerRole: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },

  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  settingDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: SPACING.lg },
  versionBox: { alignItems: 'center', paddingTop: SPACING.xl },
  versionText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textMuted },
  versionSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 4 },
});
