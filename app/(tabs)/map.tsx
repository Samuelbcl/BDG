import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InteractiveMap from '../../src/components/InteractiveMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
