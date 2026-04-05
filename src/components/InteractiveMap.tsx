import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { CIRCUIT_ZONES } from '../constants/data';
import { useAppStore } from '../utils/store';
import MapUserLocation from './MapUserLocation';
import MapZonePolygon from './MapZonePolygon';
import MapZoneMarker from './MapZoneMarker';
import MapZoneSheet from './MapZoneSheet';
import type { CircuitZone } from '../constants/types';

type FilterType = 'all' | 'circuit' | 'services';

const FILTERS: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'Tout', icon: 'layers' },
  { key: 'circuit', label: 'Circuit', icon: 'flag' },
  { key: 'services', label: 'Services', icon: 'storefront' },
];

// Track path connecting all corners in order for the racing line
const TRACK_CORNER_IDS = [
  'la-source', 'eau-rouge', 'kemmel', 'les-combes', 'malmedy',
  'rivage', 'pouhon', 'fagnes', 'stavelot', 'blanchimont', 'bus-stop',
];

const SPA_REGION = {
  latitude: 50.4340,
  longitude: 5.9660,
  latitudeDelta: 0.018,
  longitudeDelta: 0.025,
};

export default function InteractiveMap() {
  const mapRef = useRef<MapView>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedZone, setSelectedZone] = useState<CircuitZone | null>(null);
  const userLocation = useAppStore((s) => s.userLocation);

  // Track polyline coordinates
  const trackPath = useMemo(() => {
    const path = TRACK_CORNER_IDS
      .map((id) => CIRCUIT_ZONES.find((z) => z.id === id))
      .filter(Boolean)
      .map((z) => z!.coordinates);
    // Close the loop
    if (path.length > 0) path.push(path[0]);
    return path;
  }, []);

  // Filtered zones
  const filteredZones = useMemo(() => {
    if (activeFilter === 'all') return CIRCUIT_ZONES;
    if (activeFilter === 'circuit') {
      return CIRCUIT_ZONES.filter((z) => z.type === 'corner' || z.type === 'straight');
    }
    return CIRCUIT_ZONES.filter(
      (z) => z.type === 'paddock' || z.type === 'service' || z.type === 'grandstand',
    );
  }, [activeFilter]);

  // Zones with polygons (only service-type)
  const polygonZones = useMemo(
    () => filteredZones.filter((z) => z.polygon),
    [filteredZones],
  );

  const handleZonePress = useCallback((zone: CircuitZone) => {
    setSelectedZone(zone);
    mapRef.current?.animateToRegion(
      {
        ...zone.coordinates,
        latitudeDelta: 0.004,
        longitudeDelta: 0.006,
      },
      500,
    );
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedZone(null);
  }, []);

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.005,
          longitudeDelta: 0.008,
        },
        500,
      );
    } else {
      mapRef.current?.animateToRegion(SPA_REGION, 500);
    }
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={SPA_REGION}
        showsBuildings
        pitchEnabled
        rotateEnabled
        showsCompass
        showsScale
        minZoomLevel={14}
        maxZoomLevel={20}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Racing line polyline */}
        <Polyline
          coordinates={trackPath}
          strokeColor={COLORS.primary}
          strokeWidth={3}
          lineDashPattern={[12, 6]}
        />

        {/* Zone polygons */}
        {polygonZones.map((zone) => (
          <MapZonePolygon key={zone.id} zone={zone} onPress={handleZonePress} />
        ))}

        {/* Zone markers */}
        {filteredZones.map((zone) => (
          <MapZoneMarker
            key={zone.id}
            zone={zone}
            isSelected={selectedZone?.id === zone.id}
            onPress={handleZonePress}
          />
        ))}

        {/* User live position */}
        <MapUserLocation />
      </MapView>

      {/* Filter chips - floating */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={f.icon}
              size={14}
              color={activeFilter === f.key ? '#FFF' : COLORS.text}
            />
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recenter button */}
      <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter} activeOpacity={0.8}>
        <Ionicons name="locate" size={22} color={COLORS.text} />
      </TouchableOpacity>

      {/* Bottom sheet */}
      <MapZoneSheet zone={selectedZone} onClose={handleCloseSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterRow: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterTextActive: {
    color: '#FFF',
  },
  recenterBtn: {
    position: 'absolute',
    bottom: 340,
    right: SPACING.base,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
