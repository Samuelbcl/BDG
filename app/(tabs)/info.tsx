import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  useFocusEffect(
    useCallback(() => {
      WebBrowser.openBrowserAsync(SITE_URL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    }, []),
  );

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
