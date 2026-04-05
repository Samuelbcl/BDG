import { View, Platform, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../src/constants/theme';
import Header from '../../src/components/Header';
import CircuitMap from '../../src/components/CircuitMap';

// react-native-maps is native only — use dynamic import to avoid web crash
const InteractiveMap = Platform.OS !== 'web'
  ? require('../../src/components/InteractiveMap').default
  : null;

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Header />
      {Platform.OS === 'web' || !InteractiveMap ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.webContent}
        >
          <CircuitMap />
        </ScrollView>
      ) : (
        <InteractiveMap />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  webContent: { padding: SPACING.base, paddingBottom: 120 },
});
