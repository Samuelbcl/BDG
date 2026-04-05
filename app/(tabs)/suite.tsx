import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Linking } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../../src/constants/theme';
import Header from '../../src/components/Header';

const PARTNERS = [
  { name: 'AF MotorSport', role: 'Baptemes sur circuit' },
  { name: 'Motortech', role: 'Partenaire technique' },
  { name: 'K\'Mystik', role: 'Adrenaline Experience' },
  { name: 'Purefect', role: 'Detailing automobile' },
  { name: 'Circuit de Spa-Francorchamps', role: 'Lieu de l\'evenement' },
];

type Section = null | 'partners' | 'settings';

export default function SuiteScreen() {
  const [openSection, setOpenSection] = useState<Section>(null);
  const [notifs, setNotifs] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>SUITE</Text>

        {/* Ton Compte */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={22} color={COLORS.text} />
          <Text style={styles.menuLabel}>TON COMPTE</Text>
          <Ionicons name="open-outline" size={16} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Partners */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => setOpenSection(openSection === 'partners' ? null : 'partners')}
        >
          <Ionicons name="briefcase-outline" size={22} color={COLORS.text} />
          <Text style={styles.menuLabel}>PARTNERS</Text>
          <Ionicons
            name={openSection === 'partners' ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={COLORS.textMuted}
            style={{ marginLeft: 'auto' }}
          />
        </TouchableOpacity>
        {openSection === 'partners' && (
          <View style={styles.expandedSection}>
            {PARTNERS.map((p, i) => (
              <View key={i} style={styles.partnerRow}>
                <Text style={styles.partnerName}>{p.name}</Text>
                <Text style={styles.partnerRole}>{p.role}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => setOpenSection(openSection === 'settings' ? null : 'settings')}
        >
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
          <Text style={styles.menuLabel}>SETTINGS</Text>
          <Ionicons
            name={openSection === 'settings' ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={COLORS.textMuted}
            style={{ marginLeft: 'auto' }}
          />
        </TouchableOpacity>
        {openSection === 'settings' && (
          <View style={styles.expandedSection}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Switch
                value={notifs}
                onValueChange={setNotifs}
                trackColor={{ false: COLORS.border, true: `${COLORS.primary}66` }}
                thumbColor={notifs ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Localisation</Text>
              <Switch
                value={location}
                onValueChange={setLocation}
                trackColor={{ false: COLORS.border, true: `${COLORS.primary}66` }}
                thumbColor={location ? COLORS.primary : COLORS.textMuted}
              />
            </View>
            <TouchableOpacity style={styles.settingLink} onPress={() => Linking.openURL('https://lesbruleursdegommes.com/')}>
              <Text style={styles.settingLinkText}>Site officiel</Text>
              <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        )}

        {/* Version */}
        <View style={styles.versionBox}>
          <Text style={styles.versionText}>BDG Motor Show v1.0.0</Text>
          <Text style={styles.versionSub}>Les Bruleurs de Gommes - 10e edition</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: SPACING.base, paddingBottom: 120 },

  pageTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 1, marginBottom: SPACING.xl },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
  },
  menuLabel: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: COLORS.border },

  expandedSection: {
    paddingLeft: 36,
    paddingBottom: SPACING.md,
  },
  partnerRow: { marginBottom: 10 },
  partnerName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  partnerRole: { fontSize: FONT_SIZES.md, color: COLORS.textMuted },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  settingLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  settingLinkText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },

  versionBox: { alignItems: 'center', paddingTop: SPACING.xxxl },
  versionText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textMuted },
  versionSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 4 },
});
