import { useCallback } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  useFocusEffect(
    useCallback(() => {
      Linking.openURL(SITE_URL).catch(() => {});
    }, []),
  );

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
