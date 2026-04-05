import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import type { MapPoi, PoiCategory } from '../constants/types';

interface Props {
  poi: MapPoi;
}

const POI_CONFIG: Record<PoiCategory, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string }> = {
  wc: { icon: 'water', bg: '#3B82F6', color: '#FFF' },
  parking: { icon: 'car', bg: '#6366F1', color: '#FFF' },
  firstaid: { icon: 'medkit', bg: '#EF4444', color: '#FFF' },
  info: { icon: 'information-circle', bg: '#06B6D4', color: '#FFF' },
  accessibility: { icon: 'accessibility', bg: '#14B8A6', color: '#FFF' },
  water: { icon: 'water-outline', bg: '#0EA5E9', color: '#FFF' },
  merch: { icon: 'bag-handle', bg: '#F59E0B', color: '#FFF' },
  photo: { icon: 'camera', bg: '#EC4899', color: '#FFF' },
};

export default function MapPoiMarker({ poi }: Props) {
  const config = POI_CONFIG[poi.category];

  return (
    <Marker
      coordinate={poi.coordinates}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
    >
      <View style={[styles.marker, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={12} color={config.color} />
      </View>
    </Marker>
  );
}

export { POI_CONFIG };

const styles = StyleSheet.create({
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
