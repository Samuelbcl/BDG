import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../src/constants/theme';
import InteractiveMap from '../../src/components/InteractiveMap';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={{ width: 36 }} />
        <Text style={styles.headerTitle}>Plan</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      <InteractiveMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    backgroundColor: '#000',
    paddingHorizontal: SPACING.base,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', letterSpacing: 1, marginBottom: 6 },
});
