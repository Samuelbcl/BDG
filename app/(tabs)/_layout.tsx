import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';

type TabIconName = 'actus' | 'map' | 'calendar' | 'info' | 'menu';

const ICON_MAP: Record<TabIconName, keyof typeof Ionicons.glyphMap> = {
  actus: 'newspaper-outline',
  map: 'map-outline',
  calendar: 'calendar-outline',
  info: 'information-circle-outline',
  menu: 'ellipsis-horizontal',
};

function TabIcon({ name, color }: { name: TabIconName; color: string; focused: boolean }) {
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="actus" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: 'Programme',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="calendar" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="info" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="suite"
        options={{
          title: 'Suite',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
