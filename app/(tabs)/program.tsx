import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, Modal, Switch, Platform } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/theme';

type ImageAlign = 'center' | 'left' | 'right';

interface ProgramItem {
  id: string;
  title: string;
  location: string;
  image: ImageSourcePropType;
  imageAlign?: ImageAlign;
  events: { times: string; name: string }[];
  extra?: string;
  extraEvents?: { times: string; name: string }[];
}

const PROGRAM: ProgramItem[] = [
  {
    id: 'trackday',
    title: 'TRACK DAY',
    location: 'CIRCUIT',
    image: require('../../assets/prog-trackday.jpg'),
    events: [
      { times: '9H - 12H', name: '' },
      { times: '13H - 17H', name: '' },
    ],
  },
  {
    id: 'parade',
    title: 'PARADE SUPER CAR & HYPER CAR',
    location: 'CIRCUIT',
    image: require('../../assets/prog-parade.jpg'),
    events: [
      { times: '12H00 - 13H00', name: '' },
    ],
  },
  {
    id: 'drift',
    title: 'SHOW DRIFT',
    location: 'PADDOCK DRIFT',
    image: require('../../assets/prog-drift.jpg'),
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
    id: 'fmx',
    title: 'SHOW FMX',
    location: 'ZONE SHOW FMX',
    image: require('../../assets/prog-fmx.jpg'),
    events: [
      { times: '11H45', name: '' },
      { times: '13H00', name: '' },
      { times: '15H00', name: '' },
      { times: '17H00', name: '' },
    ],
  },
  {
    id: 'dragster',
    title: 'SHOW DRAGSTER',
    location: 'PADDOCK DRIFT',
    image: require('../../assets/prog-dragster.jpg'),
    imageAlign: 'right',
    events: [
      { times: '14H30', name: '' },
      { times: '16H00', name: '' },
    ],
  },
  {
    id: 'pitwalk',
    title: 'PITWALK AND GRIDWALK',
    location: 'CIRCUIT',
    image: require('../../assets/prog-pitwalk.jpg'),
    events: [
      { times: '17H15 - 18H00', name: '' },
    ],
  },
];

export default function ProgramScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(useCallback(() => { setStatusBarStyle('light'); }, []));
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFavOnly, setShowFavOnly] = useState(false);

  // Load favorites from storage
  useEffect(() => {
    AsyncStorage.getItem('program_favorites').then((val) => {
      if (val) setFavorites(new Set(JSON.parse(val)));
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem('program_favorites', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const displayedProgram = showFavOnly
    ? PROGRAM.filter((s) => favorites.has(s.id))
    : PROGRAM;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={{ width: 76 }} />
        <Text style={styles.headerTitle}>Programme</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterOpen(true)}>
            <Ionicons name="options-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter modal */}
      <Modal visible={filterOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <View style={styles.filterHandle} />
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>FILTRE</Text>
              <TouchableOpacity onPress={() => { setShowFavOnly(false); setFilterOpen(false); }}>
                <Text style={styles.filterClear}>EFFACER TOUT</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <View>
                <Text style={styles.filterLabel}>FAVORIS</Text>
                <Text style={styles.filterDesc}>Afficher uniquement vos favoris</Text>
              </View>
              <Switch
                value={showFavOnly}
                onValueChange={setShowFavOnly}
                trackColor={{ false: COLORS.border, true: '#111' }}
                thumbColor="#FFF"
              />
            </View>

            <View style={styles.filterDivider} />

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={styles.saveBtn} onPress={() => setFilterOpen(false)} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>SAUVEGARDER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {showFavOnly && displayedProgram.length === 0 && (
          <View style={styles.emptyFav}>
            <Ionicons name="heart-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyFavText}>Aucun favori selectionne</Text>
            <Text style={styles.emptyFavSub}>Appuyez sur le coeur d'un evenement pour l'ajouter</Text>
          </View>
        )}
        {displayedProgram.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.imageWrap}>
              <Image
                source={section.image}
                style={[
                  styles.sectionImage,
                  section.imageAlign === 'right' && styles.imageRight,
                ]}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleFavorite(section.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={favorites.has(section.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favorites.has(section.id) ? COLORS.primary : COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionLocation}>{section.location}</Text>
              <View style={styles.divider} />
              {section.events.map((event, j) => (
                <Text key={j} style={styles.eventTime}>
                  •  {event.times}{event.name ? ` — ${event.name}` : ''}
                </Text>
              ))}
              {section.extra && (
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

  section: {
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
  },
  imageWrap: {
    width: 140,
    height: 160,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sectionImage: {
    width: '100%',
    height: '100%',
  },
  imageRight: {
    width: 200,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
    paddingLeft: SPACING.base,
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.text, letterSpacing: 0.3 },
  sectionLocation: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 0.5, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.textMuted, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  eventTime: { fontSize: FONT_SIZES.base, fontWeight: '600', color: COLORS.text, marginBottom: 3, lineHeight: 20 },
  extraLabel: { fontSize: 10, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm, marginBottom: 3, letterSpacing: 0.3 },

  // Filter modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  filterPanel: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    height: '85%',
  },
  filterHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textMuted, marginTop: 10, marginBottom: SPACING.base },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  filterTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 1 },
  filterClear: { fontSize: 13, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.5 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md },
  filterLabel: { fontSize: 15, fontWeight: '900', color: COLORS.text },
  filterDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  filterDivider: { height: 1, backgroundColor: COLORS.border, marginTop: SPACING.md },
  saveBtn: { backgroundColor: '#000', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: SPACING.base },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#FFF', letterSpacing: 1 },

  // Empty favorites
  emptyFav: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyFavText: { fontSize: 16, fontWeight: '700', color: COLORS.textSecondary, marginTop: SPACING.md },
  emptyFavSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
});
