import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={{ width: 76 }} />
        <Text style={styles.headerTitle}>Programme</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {}}>
            <Ionicons name="options-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
            <Ionicons name="search-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PROGRAM.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.imageWrap}>
              <Image
                source={section.image}
                style={[
                  styles.sectionImage,
                  section.imageAlign === 'right' && { resizeMode: 'cover', transform: [{ translateX: -30 }] },
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
});
