import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockRepository } from '../../services/mockRepository';

const { projects: PROJECTS } = mockRepository;
import { Colors } from '../../constants/theme';
import { ProjectCard } from '../../components/ProjectCard';
import { EmptyState } from '../../components/EmptyState';

const STATUS_FILTERS = ['All', 'In Progress', 'Waiting', 'Blocked', 'Done', 'Paused'];
const statusMap: Record<string, string> = {
  'In Progress': 'in_progress',
  Waiting: 'waiting',
  Blocked: 'blocked',
  Done: 'done',
  Paused: 'paused',
};

export default function ProjectsScreen() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.status === statusMap[filter]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {STATUS_FILTERS.map(f => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.count}>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.length === 0 ? (
          <EmptyState icon="📂" message="Nothing here." sub="Try a different filter." />
        ) : (
          <View style={styles.stack}>
            {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filterScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.accent + '30', borderColor: Colors.accent },
  filterLabel: { color: Colors.secondary, fontSize: 13, fontWeight: '500' },
  filterLabelActive: { color: Colors.primary },
  scroll: { flex: 1 },
  content: { padding: 16 },
  count: { color: Colors.secondary, fontSize: 12, marginBottom: 12 },
  stack: { gap: 10 },
});
