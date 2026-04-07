import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import type { CircuitZone } from '../constants/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 320;

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

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* Handle bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{TYPE_LABELS[zone.type]}</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{zone.name}</Text>
      <Text style={styles.description}>{zone.description}</Text>

      {/* Details */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailsContainer}
      >
        {zone.details.map((detail, i) => (
          <View key={i} style={styles.detailRow}>
            <View style={styles.detailDot} />
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ))}

        {/* Cars at this zone */}
        {zone.cars && zone.cars.length > 0 && (
          <View style={styles.extraSection}>
            <Text style={styles.extraTitle}>
              <Ionicons name="car-sport" size={13} color={COLORS.text} /> Voitures
            </Text>
            {zone.cars.map((car, i) => (
              <Text key={i} style={styles.extraItem}>{car}</Text>
            ))}
          </View>
        )}

        {/* Stands at this zone */}
        {zone.stands && zone.stands.length > 0 && (
          <View style={styles.extraSection}>
            <Text style={styles.extraTitle}>
              <Ionicons name="storefront" size={13} color={COLORS.text} /> Stands
            </Text>
            {zone.stands.map((stand, i) => (
              <Text key={i} style={styles.extraItem}>{stand}</Text>
            ))}
          </View>
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
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
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
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#111',
  },
  typeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#FFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  detailsContainer: {
    paddingBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  detailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
    backgroundColor: '#111',
  },
  detailText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 18,
  },
  extraSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  extraTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  extraItem: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 4,
    paddingLeft: 16,
  },
});
