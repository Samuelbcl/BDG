import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Animated, Dimensions, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import type { CircuitZone } from '../constants/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 420;

interface Props {
  zone: CircuitZone | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<CircuitZone['type'], string> = {
  corner: 'Virage',
  straight: 'Ligne droite',
  paddock: 'Paddock',
  service: 'Service',
  grandstand: 'Tribune',
  entrance: 'Entree',
  show: 'Show',
};

// Map zone IDs to images
const ZONE_IMAGES: Record<string, ImageSourcePropType> = {
  'paddock-f1': require('../../assets/prog-trackday.jpg'),
  'paddock-drift': require('../../assets/prog-drift.jpg'),
  'paddock-violet': require('../../assets/prog-parade.jpg'),
  'show-fmx': require('../../assets/prog-fmx.jpg'),
  'pit-brasserie': require('../../assets/prog-dragster.jpg'),
  'fan-zone': require('../../assets/prog-pitwalk.jpg'),
};

export default function MapZoneSheet({ zone, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: zone ? 0 : SHEET_HEIGHT,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [zone, translateY]);

  if (!zone) return null;

  const image = ZONE_IMAGES[zone.id];
  const allItems = [
    ...zone.details,
    ...(zone.stands || []),
  ];

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.handleBar} />

      {/* Close button */}
      <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
        <Ionicons name="close" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        {image && (
          <Image source={image} style={styles.zoneImage} resizeMode="cover" />
        )}

        {/* Type badge */}
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{TYPE_LABELS[zone.type]}</Text>
        </View>

        {/* Name & description */}
        <Text style={styles.name}>{zone.name}</Text>
        <Text style={styles.description}>{zone.description}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details list */}
        {allItems.map((item, i) => (
          <Text key={i} style={styles.detailText}>•  {item}</Text>
        ))}

        {/* Cars */}
        {zone.cars && zone.cars.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>VOITURES</Text>
            {zone.cars.map((car, i) => (
              <Text key={i} style={styles.detailText}>•  {car}</Text>
            ))}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
  },
  zoneImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: SPACING.md,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#111',
    marginBottom: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#FFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  detailText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 3,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
});
