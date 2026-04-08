import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import { CIRCUIT_ZONES } from '../constants/data';
import type { CircuitZone } from '../constants/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - 32;
const MAP_HEIGHT = MAP_WIDTH * 0.85;

// Simplified Spa-Francorchamps circuit path (SVG path data)
// This is a stylized representation of the track layout
const CIRCUIT_PATH = `
  M ${MAP_WIDTH * 0.82} ${MAP_HEIGHT * 0.15}
  L ${MAP_WIDTH * 0.78} ${MAP_HEIGHT * 0.12}
  C ${MAP_WIDTH * 0.75} ${MAP_HEIGHT * 0.10} ${MAP_WIDTH * 0.72} ${MAP_HEIGHT * 0.14} ${MAP_WIDTH * 0.70} ${MAP_HEIGHT * 0.22}
  L ${MAP_WIDTH * 0.65} ${MAP_HEIGHT * 0.20}
  L ${MAP_WIDTH * 0.50} ${MAP_HEIGHT * 0.16}
  L ${MAP_WIDTH * 0.35} ${MAP_HEIGHT * 0.12}
  C ${MAP_WIDTH * 0.28} ${MAP_HEIGHT * 0.10} ${MAP_WIDTH * 0.22} ${MAP_HEIGHT * 0.12} ${MAP_WIDTH * 0.18} ${MAP_HEIGHT * 0.18}
  L ${MAP_WIDTH * 0.15} ${MAP_HEIGHT * 0.25}
  C ${MAP_WIDTH * 0.12} ${MAP_HEIGHT * 0.30} ${MAP_WIDTH * 0.10} ${MAP_HEIGHT * 0.35} ${MAP_WIDTH * 0.08} ${MAP_HEIGHT * 0.42}
  L ${MAP_WIDTH * 0.06} ${MAP_HEIGHT * 0.52}
  C ${MAP_WIDTH * 0.05} ${MAP_HEIGHT * 0.58} ${MAP_WIDTH * 0.06} ${MAP_HEIGHT * 0.62} ${MAP_WIDTH * 0.10} ${MAP_HEIGHT * 0.65}
  L ${MAP_WIDTH * 0.15} ${MAP_HEIGHT * 0.68}
  L ${MAP_WIDTH * 0.22} ${MAP_HEIGHT * 0.72}
  C ${MAP_WIDTH * 0.28} ${MAP_HEIGHT * 0.76} ${MAP_WIDTH * 0.32} ${MAP_HEIGHT * 0.78} ${MAP_WIDTH * 0.38} ${MAP_HEIGHT * 0.80}
  L ${MAP_WIDTH * 0.50} ${MAP_HEIGHT * 0.82}
  C ${MAP_WIDTH * 0.58} ${MAP_HEIGHT * 0.84} ${MAP_WIDTH * 0.65} ${MAP_HEIGHT * 0.82} ${MAP_WIDTH * 0.72} ${MAP_HEIGHT * 0.76}
  C ${MAP_WIDTH * 0.76} ${MAP_HEIGHT * 0.72} ${MAP_WIDTH * 0.78} ${MAP_HEIGHT * 0.65} ${MAP_WIDTH * 0.80} ${MAP_HEIGHT * 0.55}
  L ${MAP_WIDTH * 0.82} ${MAP_HEIGHT * 0.45}
  C ${MAP_WIDTH * 0.84} ${MAP_HEIGHT * 0.35} ${MAP_WIDTH * 0.84} ${MAP_HEIGHT * 0.25} ${MAP_WIDTH * 0.82} ${MAP_HEIGHT * 0.15}
  Z
`;

// Service areas positioned around the circuit
const SERVICE_ZONES = CIRCUIT_ZONES.filter(z =>
  ['paddock', 'service', 'grandstand'].includes(z.type)
);

const TRACK_ZONES = CIRCUIT_ZONES.filter(z =>
  ['corner', 'straight'].includes(z.type)
);

interface ZoneMarkerProps {
  zone: CircuitZone;
  onPress: (zone: CircuitZone) => void;
  isSelected: boolean;
}

function ZoneMarker({ zone, onPress, isSelected }: ZoneMarkerProps) {
  const x = (zone.mapPosition.x / 100) * MAP_WIDTH;
  const y = (zone.mapPosition.y / 100) * MAP_HEIGHT;
  const isService = ['paddock', 'service', 'grandstand'].includes(zone.type);
  const size = isService ? 14 : 10;

  return (
    <TouchableOpacity
      style={[
        styles.marker,
        {
          left: x - size,
          top: y - size,
          width: size * 2,
          height: size * 2,
          borderRadius: size,
          backgroundColor: isSelected ? zone.color : `${zone.color}30`,
          borderWidth: 2,
          borderColor: zone.color,
        },
        isSelected && {
          transform: [{ scale: 1.3 }],
        },
      ]}
      onPress={() => onPress(zone)}
      activeOpacity={0.7}
    >
      {isService && (
        <View style={[styles.markerPulse, { backgroundColor: `${zone.color}20` }]} />
      )}
    </TouchableOpacity>
  );
}

interface ZoneDetailModalProps {
  zone: CircuitZone | null;
  visible: boolean;
  onClose: () => void;
}

function ZoneDetailModal({ zone, visible, onClose }: ZoneDetailModalProps) {
  if (!zone) return null;

  const isService = ['paddock', 'service', 'grandstand'].includes(zone.type);
  const typeLabel = {
    corner: 'Virage',
    straight: 'Ligne droite',
    paddock: 'Paddock',
    service: 'Services',
    grandstand: 'Tribune / VIP',
    entrance: 'Entrée',
    show: 'Show',
  }[zone.type];

  const typeIcon: keyof typeof Ionicons.glyphMap = {
    corner: 'git-branch-outline',
    straight: 'arrow-forward',
    paddock: 'car-sport',
    service: 'storefront',
    grandstand: 'eye',
    entrance: 'enter',
    show: 'flame',
  }[zone.type] as any;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.modalContent}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={[styles.modalIconBox, { backgroundColor: `${zone.color}15` }]}>
              <Ionicons name={typeIcon} size={24} color={zone.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalType}>{typeLabel}</Text>
              <Text style={styles.modalTitle}>{zone.name}</Text>
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={onClose}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.modalDesc}>{zone.description}</Text>

          {/* Color accent bar */}
          <View style={[styles.modalAccent, { backgroundColor: zone.color }]} />

          {/* Details */}
          <ScrollView style={styles.modalDetailsScroll} showsVerticalScrollIndicator={false}>
            {zone.details.map((detail, i) => (
              <View key={i} style={styles.modalDetailRow}>
                <View style={[styles.modalDetailDot, { backgroundColor: zone.color }]} />
                <Text style={styles.modalDetailText}>{detail}</Text>
              </View>
            ))}

            {/* Cars at this location */}
            {zone.cars && zone.cars.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Voitures presentes</Text>
                {zone.cars.map((car, i) => (
                  <View key={i} style={styles.modalCarRow}>
                    <Ionicons name="car-sport" size={16} color={COLORS.primary} />
                    <Text style={styles.modalCarName}>{car}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Stands at this location */}
            {zone.stands && zone.stands.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Exposants</Text>
                {zone.stands.map((stand, i) => (
                  <View key={i} style={styles.modalCarRow}>
                    <Ionicons name="storefront" size={16} color={COLORS.zoneStands} />
                    <Text style={styles.modalCarName}>{stand}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function CircuitMap() {
  const [selectedZone, setSelectedZone] = useState<CircuitZone | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'circuit' | 'services'>('all');

  const handleZonePress = (zone: CircuitZone) => {
    setSelectedZone(zone);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedZone(null), 300);
  };

  const filteredZones = CIRCUIT_ZONES.filter(z => {
    if (filter === 'circuit') return ['corner', 'straight'].includes(z.type);
    if (filter === 'services') return ['paddock', 'service', 'grandstand'].includes(z.type);
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'Tout' },
          { key: 'circuit', label: 'Circuit' },
          { key: 'services', label: 'Services' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterTab,
              filter === f.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(f.key as any)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterText,
              filter === f.key && styles.filterTextActive,
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Circuit Map */}
      <View style={styles.mapContainer}>
        {/* SVG Circuit Track */}
        <Svg
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        >
          {/* Track outline (wider, lighter) */}
          <Path
            d={CIRCUIT_PATH}
            fill="none"
            stroke={COLORS.border}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Track surface */}
          <Path
            d={CIRCUIT_PATH}
            fill="none"
            stroke={`${COLORS.textMuted}40`}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Track racing line */}
          <Path
            d={CIRCUIT_PATH}
            fill="none"
            stroke={COLORS.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8,6"
            opacity={0.5}
          />
          {/* Start/Finish line */}
          <G>
            <Circle
              cx={(82 / 100) * MAP_WIDTH}
              cy={(15 / 100) * MAP_HEIGHT}
              r={4}
              fill={COLORS.primary}
            />
          </G>
        </Svg>

        {/* Zone markers overlay */}
        {filteredZones.map((zone) => (
          <ZoneMarker
            key={zone.id}
            zone={zone}
            onPress={handleZonePress}
            isSelected={selectedZone?.id === zone.id}
          />
        ))}

        {/* Start/Finish label */}
        <View style={[styles.startLabel, {
          left: (82 / 100) * MAP_WIDTH - 30,
          top: (15 / 100) * MAP_HEIGHT - 28,
        }]}>
          <Text style={styles.startLabelText}>START</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>Virages</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.zoneCircuit }]} />
          <Text style={styles.legendText}>Lignes droites</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.zonePaddock }]} />
          <Text style={styles.legendText}>Paddocks</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.zoneFood }]} />
          <Text style={styles.legendText}>Services</Text>
        </View>
      </View>

      {/* Quick zone list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickList}
      >
        {CIRCUIT_ZONES.filter(z => ['paddock', 'service', 'grandstand'].includes(z.type)).map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={styles.quickCard}
            onPress={() => handleZonePress(zone)}
            activeOpacity={0.7}
          >
            <View style={[styles.quickBar, { backgroundColor: zone.color }]} />
            <Text style={styles.quickName} numberOfLines={1}>{zone.name}</Text>
            <Text style={styles.quickDesc} numberOfLines={1}>{zone.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Zone Detail Modal */}
      <ZoneDetailModal
        zone={selectedZone}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.base,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  markerPulse: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    borderRadius: 999,
  },
  startLabel: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  startLabelText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: SPACING.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  quickList: {
    paddingBottom: SPACING.sm,
    gap: 8,
  },
  quickCard: {
    width: 140,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    overflow: 'hidden',
  },
  quickBar: {
    width: 24,
    height: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  quickName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  quickDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: SPACING.base,
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalType: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    color: COLORS.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDesc: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
  },
  modalAccent: {
    height: 3,
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  modalDetailsScroll: {
    maxHeight: 300,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  modalDetailDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  modalDetailText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    lineHeight: 18,
  },
  modalSection: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalSectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  modalCarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  modalCarName: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
});
