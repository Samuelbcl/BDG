import { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../src/constants/theme';
import { SCHEDULE, ZONES, CIRCUIT_ZONES, BAPTEMES } from '../src/constants/data';

// --- Fuzzy search engine (handles typos) ---

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function fuzzyMatch(query: string, text: string): number {
  const q = normalize(query);
  const t = normalize(text);
  if (!q) return 0;

  // Exact substring match = best score
  if (t.includes(q)) return 1;

  // Check if query words match any word in text with tolerance
  const qWords = q.split(/\s+/);
  const tWords = t.split(/\s+/);

  let totalScore = 0;
  for (const qw of qWords) {
    let bestWordScore = 0;
    for (const tw of tWords) {
      // Allow typos proportional to word length
      const maxDist = qw.length <= 3 ? 1 : Math.floor(qw.length / 3);
      const dist = levenshtein(qw, tw.slice(0, qw.length + 2));
      if (dist <= maxDist) {
        bestWordScore = Math.max(bestWordScore, 1 - dist / Math.max(qw.length, 1));
      }
      // Also check if qw is a prefix
      if (tw.startsWith(qw)) {
        bestWordScore = Math.max(bestWordScore, 0.9);
      }
    }
    totalScore += bestWordScore;
  }

  return totalScore / qWords.length;
}

// --- Build searchable items ---

type SearchCategory = 'programme' | 'zone' | 'circuit' | 'bapteme';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  searchText: string;
}

function buildSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];

  // Schedule / Programme
  for (const s of SCHEDULE) {
    items.push({
      id: `schedule-${s.id}`,
      title: s.title,
      subtitle: `${s.time}${s.endTime ? ` - ${s.endTime}` : ''} · ${s.tag}`,
      category: 'programme',
      icon: 'calendar',
      color: s.tagColor,
      searchText: `${s.title} ${s.description} ${s.tag} ${s.zone || ''}`,
    });
  }

  // Zones
  for (const z of ZONES) {
    items.push({
      id: `zone-${z.id}`,
      title: z.name,
      subtitle: `${z.description} · ${z.info}`,
      category: 'zone',
      icon: 'location',
      color: z.color,
      searchText: `${z.name} ${z.description} ${z.info}`,
    });
  }

  // Circuit zones (stands, corners, services)
  for (const cz of CIRCUIT_ZONES) {
    items.push({
      id: `circuit-${cz.id}`,
      title: cz.name,
      subtitle: cz.description,
      category: 'circuit',
      icon: cz.type === 'service' ? 'storefront' : cz.type === 'paddock' ? 'car-sport' : 'flag',
      color: cz.color,
      searchText: `${cz.name} ${cz.description} ${cz.details.join(' ')} ${(cz.stands || []).join(' ')} ${(cz.cars || []).join(' ')}`,
    });
  }

  // Baptemes
  for (const b of BAPTEMES) {
    items.push({
      id: `bapteme-${b.id}`,
      title: b.carModel,
      subtitle: `${b.price}EUR · ${b.laps} tours · ${b.duration}`,
      category: 'bapteme',
      icon: 'speedometer',
      color: COLORS.zoneBapteme,
      searchText: `${b.carModel} ${b.provider} ${b.description} bapteme`,
    });
  }

  return items;
}

const ALL_ITEMS = buildSearchItems();

const CATEGORY_LABELS: Record<SearchCategory, string> = {
  programme: 'Programme',
  zone: 'Zones',
  circuit: 'Circuit',
  bapteme: 'Baptemes',
};

const SUGGESTIONS = ['Eau Rouge', 'Bapteme', 'Food', 'Paddock VIP', 'TrackDay', 'Hypercars'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return ALL_ITEMS
      .map((item) => ({ item, score: fuzzyMatch(query, item.searchText) }))
      .filter((r) => r.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [query]);

  const renderItem = ({ item }: { item: SearchItem }) => (
    <TouchableOpacity style={styles.resultCard} activeOpacity={0.7}>
      <View style={[styles.resultIcon, { backgroundColor: `${item.color}15` }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{CATEGORY_LABELS[item.category]}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recherche</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Stand, programme, lieu..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {query.trim() === '' ? (
        /* Suggestions */
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestions</Text>
          <View style={styles.suggestionsRow}>
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => setQuery(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Aucun resultat pour "{query}"</Text>
              <Text style={styles.emptyHint}>Essayez un autre terme de recherche</Text>
            </View>
          }
        />
      )}
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
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.base,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    paddingVertical: 0,
  },
  list: { padding: SPACING.base, paddingBottom: 100 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 8,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  resultContent: { flex: 1 },
  resultTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  categoryBadge: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  suggestionsContainer: {
    padding: SPACING.base,
  },
  suggestionsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptyHint: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
