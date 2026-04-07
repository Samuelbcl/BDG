import { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect, useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  const router = useRouter();
  const justClosed = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (justClosed.current) {
        justClosed.current = false;
        router.back();
        return;
      }

      WebBrowser.openBrowserAsync(SITE_URL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      }).then(() => {
        justClosed.current = true;
      });
    }, [router]),
  );

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
});
