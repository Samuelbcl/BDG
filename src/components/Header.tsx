import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../constants/theme';
import { useAppStore } from '../utils/store';

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const unreadCount = useAppStore((s) => s.unreadCount);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Notification bell */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/notifications')}
        hitSlop={8}
      >
        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require('../../assets/logo-bdg.webp')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Search */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/search')}
        hitSlop={8}
      >
        <Ionicons name="search-outline" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  logo: {
    height: 55,
    width: 200,
  },
});
