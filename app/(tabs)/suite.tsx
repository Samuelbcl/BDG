import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Linking } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';

const PARTNERS = [
  { name: 'AF MotorSport', role: 'Baptemes sur circuit' },
  { name: 'Motortech', role: 'Partenaire technique' },
  { name: 'K\'Mystik', role: 'Adrenaline Experience' },
  { name: 'Purefect', role: 'Detailing automobile' },
  { name: 'Circuit de Spa-Francorchamps', role: 'Lieu de l\'événement' },
];

type Section = null | 'partners' | 'settings';

export default function SuiteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(useCallback(() => { setStatusBarStyle('light'); }, []));
  const [openSection, setOpenSection] = useState<Section>(null);
  const [notifs, setNotifs] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <View style={styles.container}>
      {/* Header noir */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>Suite</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                trackColor={{ false: COLORS.border, true: '#111' }}
                thumbColor="#FFF"
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Localisation</Text>
              <Switch
                value={location}
                onValueChange={setLocation}
                trackColor={{ false: COLORS.border, true: '#111' }}
                thumbColor="#FFF"
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
          <Text style={styles.versionSub}>Les Brûleurs de Gommes</Text>
        </View>
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 1, marginBottom: 6 },

  scrollContent: { padding: SPACING.base, paddingBottom: 40 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
  },
  menuLabel: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: COLORS.border },

  expandedSection: { paddingLeft: 36, paddingBottom: SPACING.md },
  partnerRow: { marginBottom: 10 },
  partnerName: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  partnerRole: { fontSize: FONT_SIZES.md, color: COLORS.textMuted },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  settingLabel: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  settingLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  settingLinkText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },

  versionBox: { alignItems: 'center', paddingTop: SPACING.xxxl },
  versionText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textMuted },
  versionSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted, marginTop: 4 },
});
