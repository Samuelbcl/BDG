import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import InteractiveMap from '../../src/components/InteractiveMap';

export default function MapScreen() {
  useFocusEffect(useCallback(() => { setStatusBarStyle('light'); }, []));

  return (
    <View style={styles.container}>
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});
