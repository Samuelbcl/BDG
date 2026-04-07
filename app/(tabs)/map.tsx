import { View, StyleSheet } from 'react-native';
import InteractiveMap from '../../src/components/InteractiveMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
