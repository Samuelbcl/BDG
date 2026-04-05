import { View, StyleSheet } from 'react-native';
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
  grandstand: 'eye',
  entrance: 'enter',
  show: 'flame',
};

export default function MapZoneMarker({ zone, isSelected, onPress }: Props) {
  return (
    <Marker
      coordinate={zone.coordinates}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
      onPress={() => onPress(zone)}
    >
      <View style={[styles.pin, { backgroundColor: zone.color }, isSelected && styles.pinSelected]}>
        <Ionicons name={ICON_MAP[zone.type]} size={16} color="#FFF" />
        <View style={[styles.pinTail, { borderTopColor: zone.color }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  pinSelected: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderBottomRightRadius: 2,
    borderWidth: 3,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pinTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
