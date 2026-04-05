import { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';
import { CIRCUIT_ZONES, MAP_POIS } from '../constants/data';
import { useAppStore } from '../utils/store';
import MapUserLocation from './MapUserLocation';
import MapZonePolygon from './MapZonePolygon';
import MapZoneMarker from './MapZoneMarker';
import MapPoiMarker, { POI_CONFIG } from './MapPoiMarker';
import MapZoneSheet from './MapZoneSheet';
import CircuitMap from './CircuitMap';
import type { CircuitZone, PoiCategory } from '../constants/types';

type ViewMode = 'map' | 'plan';

// POI category labels for filter panel
const POI_CATEGORIES: { key: PoiCategory; label: string }[] = [
  { key: 'wc', label: 'WC' },
  { key: 'parking', label: 'Parking' },
  { key: 'firstaid', label: 'Secours' },
  { key: 'info', label: 'Info' },
  { key: 'accessibility', label: 'PMR' },
  { key: 'water', label: 'Eau' },
  { key: 'merch', label: 'Merch' },
  { key: 'photo', label: 'Photo' },
  { key: 'entrance', label: 'Entrees' },
];

// Zone type labels for filter panel
const ZONE_CATEGORIES = [
  { key: 'paddock' as const, label: 'Paddocks', icon: 'car-sport' as const, color: COLORS.zonePaddock },
  { key: 'service' as const, label: 'Stands & Services', icon: 'storefront' as const, color: COLORS.zoneStands },
  { key: 'grandstand' as const, label: 'Tribunes', icon: 'eye' as const, color: COLORS.zoneVIP },
  { key: 'show' as const, label: 'Shows', icon: 'flame' as const, color: COLORS.zoneBapteme },
  { key: 'entrance' as const, label: 'Entrees', icon: 'enter' as const, color: COLORS.info },
];

// No track path needed - event zones are the focus now

const SPA_REGION = {
  latitude: 50.4430,
  longitude: 5.9675,
  latitudeDelta: 0.010,
  longitudeDelta: 0.014,
};

export default function InteractiveMap() {
  const mapRef = useRef<MapView>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedZone, setSelectedZone] = useState<CircuitZone | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state: which zone types and POI categories are visible
  const [visibleZoneTypes, setVisibleZoneTypes] = useState<Set<string>>(
    new Set(['corner', 'straight', 'paddock', 'service', 'grandstand', 'entrance', 'show']),
  );
  const [visiblePois, setVisiblePois] = useState<Set<PoiCategory>>(
    new Set(['wc', 'parking', 'firstaid', 'info', 'accessibility', 'water', 'merch', 'photo', 'entrance']),
  );

  const userLocation = useAppStore((s) => s.userLocation);

  // No track polyline needed for event zones

  // Filtered zones
  const filteredZones = useMemo(
    () => CIRCUIT_ZONES.filter((z) => visibleZoneTypes.has(z.type)),
    [visibleZoneTypes],
  );

  const polygonZones = useMemo(
    () => filteredZones.filter((z) => z.polygon),
    [filteredZones],
  );

  // Filtered POIs
  const filteredPois = useMemo(
    () => MAP_POIS.filter((p) => visiblePois.has(p.category)),
    [visiblePois],
  );

  const toggleZoneType = useCallback((type: string) => {
    setVisibleZoneTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const togglePoiCategory = useCallback((cat: PoiCategory) => {
    setVisiblePois((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const showAll = useCallback(() => {
    setVisibleZoneTypes(new Set(['corner', 'straight', 'paddock', 'service', 'grandstand', 'entrance', 'show']));
    setVisiblePois(new Set(['wc', 'parking', 'firstaid', 'info', 'accessibility', 'water', 'merch', 'photo', 'entrance']));
  }, []);

  const hideAll = useCallback(() => {
    setVisibleZoneTypes(new Set());
    setVisiblePois(new Set());
  }, []);

  const handleZonePress = useCallback((zone: CircuitZone) => {
    setSelectedZone(zone);
    mapRef.current?.animateToRegion(
      { ...zone.coordinates, latitudeDelta: 0.004, longitudeDelta: 0.006 },
      500,
    );
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

  // Count active filters
  const activeFilterCount = visibleZoneTypes.size + visiblePois.size;
  const totalFilters = 5 + POI_CATEGORIES.length; // 5 zone types + POI categories

  return (
    <View style={styles.container}>
      {/* MAP / PLAN toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>MAP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'plan' && styles.toggleBtnActive]}
          onPress={() => setViewMode('plan')}
        >
          <Text style={[styles.toggleText, viewMode === 'plan' && styles.toggleTextActive]}>PLAN</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'plan' ? (
        /* SVG Plan view */
        <ScrollView
          style={styles.planScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.planContent}
        >
          <CircuitMap />
        </ScrollView>
      ) : (
        /* Interactive Map view */
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
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

            {/* POI markers */}
            {filteredPois.map((poi) => (
              <MapPoiMarker key={poi.id} poi={poi} />
            ))}

            {/* User location */}
            <MapUserLocation />
          </MapView>

          {/* Filter button */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="options" size={20} color={COLORS.text} />
            {activeFilterCount < totalFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Recenter button */}
          <TouchableOpacity style={styles.recenterBtn} onPress={handleRecenter} activeOpacity={0.8}>
            <Ionicons name="locate" size={22} color={COLORS.text} />
          </TouchableOpacity>

          {/* Bottom sheet */}
          <MapZoneSheet zone={selectedZone} onClose={handleCloseSheet} />
        </>
      )}

      {/* Filter panel modal */}
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

            {/* Quick actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickBtn} onPress={showAll}>
                <Text style={styles.quickBtnText}>Tout afficher</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={hideAll}>
                <Text style={styles.quickBtnText}>Tout masquer</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Zone types */}
              <Text style={styles.filterSectionTitle}>Zones</Text>
              {ZONE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={styles.filterItem}
                  onPress={() => toggleZoneType(cat.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.filterIcon, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon} size={16} color={cat.color} />
                  </View>
                  <Text style={styles.filterItemLabel}>{cat.label}</Text>
                  <Ionicons
                    name={visibleZoneTypes.has(cat.key) ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={visibleZoneTypes.has(cat.key) ? COLORS.primary : COLORS.textMuted}
                  />
                </TouchableOpacity>
              ))}
              {/* POI categories */}
              <Text style={[styles.filterSectionTitle, { marginTop: SPACING.lg }]}>Points d'interet</Text>
              {POI_CATEGORIES.map((cat) => {
                const config = POI_CONFIG[cat.key];
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={styles.filterItem}
                    onPress={() => togglePoiCategory(cat.key)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.filterIcon, { backgroundColor: config.bg + '20' }]}>
                      <Ionicons name={config.icon} size={16} color={config.bg} />
                    </View>
                    <Text style={styles.filterItemLabel}>{cat.label}</Text>
                    <Ionicons
                      name={visiblePois.has(cat.key) ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={visiblePois.has(cat.key) ? COLORS.primary : COLORS.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Apply button */}
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnText}>Appliquer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // MAP/PLAN toggle
  toggleRow: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    zIndex: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  toggleBtn: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: '#FFF',
  },

  // Plan view
  planScroll: {
    flex: 1,
    marginTop: 50,
  },
  planContent: {
    padding: SPACING.base,
    paddingBottom: 120,
  },

  // Filter button
  filterBtn: {
    position: 'absolute',
    top: 12,
    right: SPACING.base,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },

  // Recenter
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

  // Filter panel modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  filterPanel: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xl,
    maxHeight: '75%',
  },
  filterPanelHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  filterPanelTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  filterCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickBtnText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterSectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  filterIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItemLabel: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.base,
  },
  applyBtnText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: '#FFF',
  },
});
