import { ScrollView, StyleSheet } from 'react-native';
import { SPACING } from '../constants/theme';
import CircuitMap from './CircuitMap';

export default function InteractiveMap() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <CircuitMap />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.base, paddingBottom: 120 },
});
