import { useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  const router = useRouter();

  useEffect(() => {
    Linking.openURL(SITE_URL).catch(() => {});
    const timer = setTimeout(() => router.replace('/'), 500);
    return () => clearTimeout(timer);
  }, [router]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
