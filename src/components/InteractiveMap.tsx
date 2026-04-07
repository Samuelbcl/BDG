import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { CIRCUIT_ZONES } from '../constants/data';
import { useAppStore } from '../utils/store';
import MapUserLocation from './MapUserLocation';
import MapZonePolygon from './MapZonePolygon';
import MapZoneMarker from './MapZoneMarker';
import MapZoneSheet from './MapZoneSheet';
import type { CircuitZone } from '../constants/types';
import mapStyle from '../constants/mapStyle.json';

const ZONE_CATEGORIES = [
  { key: 'paddock' as const, label: 'Paddocks', icon: 'car-sport-outline' as const },
  { key: 'service' as const, label: 'Stands & Services', icon: 'storefront-outline' as const },
  { key: 'grandstand' as const, label: 'Tribunes', icon: 'eye-outline' as const },
  { key: 'show' as const, label: 'Shows', icon: 'flame-outline' as const },
  { key: 'entrance' as const, label: 'Entrees', icon: 'enter-outline' as const },
];

const SPA_REGION = {
  latitude: 50.4430,
  longitude: 5.9675,
  latitudeDelta: 0.010,
  longitudeDelta: 0.014,
};

const MAP_BOUNDARIES = {
  northEast: { latitude: 50.4480, longitude: 5.9750 },
  southWest: { latitude: 50.4380, longitude: 5.9600 },
};

export default function InteractiveMap() {
  const mapRef = useRef<MapView>(null);
  const [selectedZone, setSelectedZone] = useState<CircuitZone | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [visibleZoneTypes, setVisibleZoneTypes] = useState<Set<string>>(
    new Set(['corner', 'straight', 'paddock', 'service', 'grandstand', 'entrance', 'show']),
  );
  const userLocation = useAppStore((s) => s.userLocation);

  const handleRegionChange = useCallback((region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => {
    const margin = 0.005;
    const tooFar =
      region.latitude > MAP_BOUNDARIES.northEast.latitude + margin ||
      region.latitude < MAP_BOUNDARIES.southWest.latitude - margin ||
      region.longitude > MAP_BOUNDARIES.northEast.longitude + margin ||
      region.longitude < MAP_BOUNDARIES.southWest.longitude - margin;

    if (tooFar) {
      mapRef.current?.animateToRegion(SPA_REGION, 300);
    }
  }, []);

  const filteredZones = useMemo(
    () => CIRCUIT_ZONES.filter((z) => visibleZoneTypes.has(z.type)),
    [visibleZoneTypes],
  );

  const polygonZones = useMemo(
    () => filteredZones.filter((z) => z.polygon),
    [filteredZones],
  );

  const toggleZoneType = useCallback((type: string) => {
    setVisibleZoneTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const showAll = useCallback(() => {
    setVisibleZoneTypes(new Set(['corner', 'straight', 'paddock', 'service', 'grandstand', 'entrance', 'show']));
  }, []);

  const hideAll = useCallback(() => {
    setVisibleZoneTypes(new Set());
  }, []);

  const handleZonePress = useCallback((zone: CircuitZone) => {
    setSelectedZone(zone);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedZone(null);
  }, []);

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        { ...userLocation, latitudeDelta: 0.005, longitudeDelta: 0.008 },
        500,
      );
    } else {
      mapRef.current?.animateToRegion(SPA_REGION, 500);
    }
  }, [userLocation]);

  const activeFilterCount = visibleZoneTypes.size;
  const totalFilters = ZONE_CATEGORIES.length;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="hybrid"
        customMapStyle={mapStyle}
        initialRegion={SPA_REGION}
        showsBuildings
        showsPointsOfInterest={false}
        showsTraffic={false}
        pitchEnabled
        rotateEnabled
        showsCompass
        showsScale
        minZoomLevel={14}
        maxZoomLevel={20}
        showsUserLocation={false}
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChange}
      >
        {polygonZones.map((zone) => (
          <MapZonePolygon key={zone.id} zone={zone} onPress={handleZonePress} />
        ))}

        {filteredZones.map((zone) => (
          <MapZoneMarker key={zone.id} zone={zone} onPress={handleZonePress} />
        ))}

        <MapUserLocation />
      </MapView>

      {/* Filter button */}
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={() => setFilterOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="options-outline" size={20} color="#FFF" />
        {activeFilterCount < totalFilters && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Recenter button */}
      <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter} activeOpacity={0.8}>
        <Ionicons name="locate-outline" size={20} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom sheet */}
      <MapZoneSheet zone={selectedZone} onClose={handleCloseSheet} />

      {/* Filter modal */}
      <Modal visible={filterOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterPanel}>
            <View style={styles.filterPanelHandle} />

            <View style={styles.filterPanelHeader}>
              <Text style={styles.filterPanelTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)} style={styles.filterCloseBtn}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickBtn} onPress={showAll}>
                <Text style={styles.quickBtnText}>Tout afficher</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={hideAll}>
                <Text style={styles.quickBtnText}>Tout masquer</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {ZONE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={styles.filterItem}
                  onPress={() => toggleZoneType(cat.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.filterIcon, { backgroundColor: visibleZoneTypes.has(cat.key) ? '#111' : COLORS.surface }]}>
                    <Ionicons name={cat.icon} size={16} color={visibleZoneTypes.has(cat.key) ? '#FFF' : COLORS.textMuted} />
                  </View>
                  <Text style={styles.filterItemLabel}>{cat.label}</Text>
                  <Ionicons
                    name={visibleZoneTypes.has(cat.key) ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={visibleZoneTypes.has(cat.key) ? '#111' : COLORS.textMuted}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnText}>APPLIQUER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Buttons
  filterBtn: {
    position: 'absolute',
    top: 60,
    right: SPACING.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: { fontSize: 9, fontWeight: '800', color: '#000' },

  recenterBtn: {
    position: 'absolute',
    bottom: 340,
    right: SPACING.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filter modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  filterPanel: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    maxHeight: '75%',
  },
  filterPanelHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, marginBottom: SPACING.md },
  filterPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.base },
  filterPanelTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text, letterSpacing: 0.5 },
  filterCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  quickActions: { flexDirection: 'row', gap: 8, marginBottom: SPACING.lg },
  quickBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  quickBtnText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textSecondary },
  filterItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  filterIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterItemLabel: { flex: 1, fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text },
  applyBtn: { backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.base },
  applyBtnText: { fontSize: 15, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
});
