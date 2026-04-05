import { View, StyleSheet, Platform } from 'react-native';
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
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={Platform.OS === 'ios' ? false : undefined}
      stopPropagation
      onPress={() => onPress(zone)}
    >
      <View style={[
        styles.pin,
        { backgroundColor: zone.color },
        isSelected && styles.pinSelected,
      ]}>
        <Ionicons name={ICON_MAP[zone.type]} size={14} color="#FFF" />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pinSelected: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    shadowOpacity: 0.5,
    elevation: 8,
  },
});
