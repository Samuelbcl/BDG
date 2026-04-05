import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/theme';
import Header from '../../src/components/Header';
import InteractiveMap from '../../src/components/InteractiveMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
