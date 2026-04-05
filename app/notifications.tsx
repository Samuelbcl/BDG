import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../src/constants/theme';
import { useAppStore } from '../src/utils/store';
import type { AppNotification } from '../src/constants/types';

const ICON_MAP: Record<AppNotification['type'], keyof typeof Ionicons.glyphMap> = {
  info: 'information-circle',
  schedule: 'calendar',
  vote: 'trophy',
  promo: 'pricetag',
  emergency: 'warning',
};

const COLOR_MAP: Record<AppNotification['type'], string> = {
  info: COLORS.info,
  schedule: COLORS.primary,
  vote: COLORS.zoneBapteme,
  promo: COLORS.success,
  emergency: COLORS.error,
};

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Il y a ${diffD}j`;
}

// Demo notifications shown when the store is empty
const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'demo-1',
    title: 'Bienvenue au BDG Motor Show !',
    body: "Retrouvez toutes les infos de l'evenement dans l'app. Activez les notifications pour ne rien manquer.",
    type: 'info',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 'demo-2',
    title: 'Defile Hypercars a 11h',
    body: 'Le defile de 50 hypercars dans les paddocks commence bientot. Rendez-vous au paddock principal !',
    type: 'schedule',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: 'demo-3',
    title: 'Vote Best Car ouvert',
    body: 'Les votes sont ouverts ! Elisez la plus belle voiture du BDG Motor Show 2026.',
    type: 'vote',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    read: true,
  },
  {
    id: 'demo-4',
    title: 'Nouveaux baptemes disponibles',
    body: 'Des creneaux supplementaires ont ete ajoutes pour le prototype LMP2. Reservez vite !',
    type: 'promo',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead } = useAppStore();

  const displayNotifications = notifications.length > 0 ? notifications : DEMO_NOTIFICATIONS;

  const renderItem = ({ item }: { item: AppNotification }) => {
    const color = COLOR_MAP[item.type];
    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
          <Ionicons name={ICON_MAP[item.type]} size={20} color={color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{formatTime(item.timestamp)}</Text>
          </View>
          <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={displayNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  list: { padding: SPACING.base, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 10,
  },
  cardUnread: {
    backgroundColor: COLORS.primaryGlow,
    borderColor: `${COLORS.primary}30`,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: { fontWeight: '800' },
  cardTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  cardBody: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});
