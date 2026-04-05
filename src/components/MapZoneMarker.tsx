import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import type { CircuitZone } from '../constants/types';

interface Props {
  zone: CircuitZone;
  isSelected: boolean;
  onPress: (zone: CircuitZone) => void;
}

const ICON_MAP: Record<CircuitZone['type'], keyof typeof Ionicons.glyphMap> = {
  corner: 'flag',
  straight: 'arrow-forward',
  paddock: 'car-sport',
  service: 'storefront',
  grandstand: 'star',
};

export default function MapZoneMarker({ zone, isSelected, onPress }: Props) {
  const isService = zone.type === 'paddock' || zone.type === 'service' || zone.type === 'grandstand';

  return (
    <Marker
      coordinate={zone.coordinates}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      onPress={() => onPress(zone)}
    >
      {isService ? (
        <View style={[styles.serviceMarker, { backgroundColor: zone.color }, isSelected && styles.selected]}>
          <Ionicons name={ICON_MAP[zone.type]} size={14} color="#FFF" />
          <Text style={styles.serviceLabel} numberOfLines={1}>{zone.name}</Text>
        </View>
      ) : (
        <View style={[styles.trackDot, { backgroundColor: zone.color }, isSelected && styles.selectedDot]}>
          <Ionicons name="flag" size={8} color="#FFF" />
        </View>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  serviceMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    maxWidth: 80,
  },
  selected: {
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  trackDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
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
  selectedDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
});
