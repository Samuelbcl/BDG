import { Polygon } from 'react-native-maps';
import type { CircuitZone } from '../constants/types';

interface Props {
  zone: CircuitZone;
  onPress: (zone: CircuitZone) => void;
}

export default function MapZonePolygon({ zone, onPress }: Props) {
  if (!zone.polygon) return null;

  return (
    <Polygon
      coordinates={zone.polygon}
      fillColor={zone.color + '35'}
      strokeColor={zone.color}
      strokeWidth={2}
      tappable
      onPress={() => onPress(zone)}
    />
  );
}
