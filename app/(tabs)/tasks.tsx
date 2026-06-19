import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockRepository } from '../../services/mockRepository';

const { tasks: TASKS, projects: PROJECTS } = mockRepository;
import { Colors } from '../../constants/theme';
import { StatusChip } from '../../components/StatusChip';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';

const FILTERS = ['All', 'Mine', "Connor's", 'Blocked', 'Waiting'];

const PRIORITY_COLORS: Record<string, string> = {
  low: Colors.secondary,
  medium: Colors.warning,
  high: Colors.danger,
  urgent: Colors.danger,
};

export default function TasksScreen() {
  const [filter, setFilter] = useState('All');

  const filtered = TASKS.filter(t => {
    if (filter === 'Mine') return t.owner === 'marta';
    if (filter === "Connor's") return t.owner === 'connor';
    if (filter === 'Blocked') return t.status === 'blocked';
    if (filter === 'Waiting') return t.status === 'waiting';
    return true;
  });

  const pending = filtered.filter(t => t.status !== 'done');
  const done = filtered.filter(t => t.status === 'done');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
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
        {pending.length === 0 && done.length === 0 ? (
          <EmptyState icon="✅" message="Nothing waiting. Suspicious." />
        ) : (
          <>
            {pending.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Open · {pending.length}</Text>
                <View style={styles.stack}>
                  {pending.map(task => {
                    const project = PROJECTS.find(p => p.id === task.projectId);
                    return (
                      <View key={task.id} style={styles.taskCard}>
                        <View style={styles.taskLeft}>
                          <View style={styles.taskTitleRow}>
                            <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
                            <Text style={styles.taskTitle}>{task.title}</Text>
                          </View>
                          {task.description && <Text style={styles.taskDesc} numberOfLines={1}>{task.description}</Text>}
                          <View style={styles.taskMeta}>
                            {project && <Text style={styles.projectTag}>{project.title}</Text>}
                            {task.dueDate && <Text style={styles.dueDate}>Due {task.dueDate}</Text>}
                          </View>
                        </View>
                        <View style={styles.taskRight}>
                          <StatusChip status={task.status} size="sm" />
                          <Avatar userId={task.owner} size={24} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {done.length > 0 && (
              <View style={[styles.section, { marginTop: 4 }]}>
                <Text style={styles.sectionLabel}>Done · {done.length}</Text>
                <View style={styles.stack}>
                  {done.map(task => (
                    <View key={task.id} style={[styles.taskCard, styles.taskDone]}>
                      <Text style={[styles.taskTitle, styles.taskDoneText]} numberOfLines={1}>{task.title}</Text>
                      <Avatar userId={task.owner} size={22} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
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
  section: { marginBottom: 16 },
  sectionLabel: { color: Colors.secondary, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.3 },
  stack: { gap: 8 },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  taskLeft: { flex: 1, gap: 4 },
  taskRight: { alignItems: 'flex-end', gap: 8 },
  taskTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  priorityDot: { width: 7, height: 7, borderRadius: 3.5, flexShrink: 0 },
  taskTitle: { color: Colors.primary, fontSize: 14, fontWeight: '500', flex: 1 },
  taskDesc: { color: Colors.secondary, fontSize: 12 },
  taskMeta: { flexDirection: 'row', gap: 8, marginTop: 2, flexWrap: 'wrap' },
  projectTag: { color: Colors.accent, fontSize: 11, fontWeight: '500' },
  dueDate: { color: Colors.secondary, fontSize: 11 },
  taskDone: { opacity: 0.5 },
  taskDoneText: { textDecorationLine: 'line-through', color: Colors.secondary, flex: 1 },
});
