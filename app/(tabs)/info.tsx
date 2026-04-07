import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/theme';

export default function InfoScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
