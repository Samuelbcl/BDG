import { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

export default function InfoScreen() {
  const insets = useSafeAreaInsets();

  const openSite = useCallback(() => {
    WebBrowser.openBrowserAsync(SITE_URL, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      openSite();
    }, [openSite]),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Ionicons name="globe-outline" size={40} color={COLORS.textMuted} />
        <Text style={styles.title}>lesbruleursdegommes.com</Text>
        <TouchableOpacity style={styles.button} onPress={openSite} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Ouvrir le site</Text>
          <Ionicons name="open-outline" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
});
