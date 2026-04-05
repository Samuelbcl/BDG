import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { View } from 'react-native';

type TabIconName = 'actus' | 'ticket' | 'info' | 'map' | 'calendar' | 'menu';

const ICON_MAP: Record<TabIconName, keyof typeof Ionicons.glyphMap> = {
  actus: 'newspaper',
  ticket: 'ticket',
  info: 'information-circle',
  map: 'map',
  calendar: 'calendar',
  menu: 'ellipsis-horizontal',
};

function TabIcon({ name, color, focused }: { name: TabIconName; color: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={ICON_MAP[name]} size={22} color={color} />
      {focused && (
        <View
          style={{
            marginTop: 4,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.primary,
          }}
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
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
          title: 'Actus',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="actus" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ticket"
        options={{
          title: 'Ticket',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="ticket" color={color} focused={focused} />
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
