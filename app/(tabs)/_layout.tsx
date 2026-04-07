import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { COLORS } from '../../src/constants/theme';

const SITE_URL = 'https://lesbruleursdegommes.com/';

type TabIconName = 'actus' | 'map' | 'calendar' | 'info' | 'menu';

const ICON_MAP: Record<TabIconName, keyof typeof Ionicons.glyphMap> = {
  actus: 'newspaper-outline',
  map: 'map-outline',
  calendar: 'calendar-outline',
  info: 'information-circle-outline',
  menu: 'ellipsis-horizontal',
};

function TabIcon({ name, color }: { name: TabIconName; color: string }) {
  return (
    <Ionicons name={ICON_MAP[name]} size={22} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Actu',
          tabBarIcon: ({ color }) => (
            <TabIcon name="actus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => (
            <TabIcon name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: 'Programme',
          tabBarIcon: ({ color }) => (
            <TabIcon name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            WebBrowser.openBrowserAsync(SITE_URL, {
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            });
          },
        }}
        options={{
          title: 'Info',
          tabBarIcon: ({ color }) => (
            <TabIcon name="info" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suite"
        options={{
          title: 'Suite',
          tabBarIcon: ({ color }) => (
            <TabIcon name="menu" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
