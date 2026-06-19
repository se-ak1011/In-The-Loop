import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { DECISIONS, ACTIVITY, USERS, PROJECTS } from '../../data/mockData';
import { StatusChip } from '../../components/StatusChip';
import { Avatar } from '../../components/Avatar';

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const ACTIVITY_ICONS: Record<string, string> = {
  project_created: '📁',
  task_completed: '✅',
  update_posted: '💬',
  document_uploaded: '📄',
  decision_requested: '🤔',
  shopping_bought: '🛒',
  status_changed: '🔄',
};

export default function MoreScreen() {
  const pendingDecisions = DECISIONS.filter(d => d.status === 'needs_decision' || d.status === 'discussing');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools</Text>
          <View style={styles.menuGrid}>
            {[
              { icon: '🤖', label: 'AI Summary', sub: 'Summarise for partner', onPress: () => {} },
              { icon: '💬', label: 'Translate', sub: 'Calm a messy update', onPress: () => {} },
            ].map(item => (
              <Pressable key={item.label} style={styles.menuCard} onPress={item.onPress}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decisions Needed</Text>
          {pendingDecisions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No open decisions. Either you're aligned or avoiding.</Text>
            </View>
          ) : (
            <View style={styles.stack}>
              {pendingDecisions.map(dec => {
                const project = PROJECTS.find(p => p.id === dec.projectId);
                return (
                  <View key={dec.id} style={styles.decisionCard}>
                    <View style={styles.decisionHeader}>
                      <Text style={styles.decisionTitle}>{dec.title}</Text>
                      <StatusChip status={dec.status} size="sm" />
                    </View>
                    <Text style={styles.decisionContext} numberOfLines={2}>{dec.context}</Text>
                    <View style={styles.optionsList}>
                      {dec.options.slice(0, 3).map((opt, i) => (
                        <View key={opt.label} style={styles.optionRow}>
                          <Text style={styles.optionBullet}>{i + 1}.</Text>
                          <Text style={styles.optionLabel}>{opt.label}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.decisionMeta}>
                      <Text style={styles.decisionMetaText}>→ {USERS[dec.requestedFrom]?.name}</Text>
                      {project && <Text style={styles.decisionProject}>{project.title}</Text>}
                      {dec.deadline && <Text style={styles.deadline}>by {new Date(dec.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Summary</Text>
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>Summarise for your partner</Text>
            <Text style={styles.aiSub}>Select a project and generate a plain-English summary of what's happening, what changed, and what needs doing.</Text>
            <Pressable style={styles.aiButton}>
              <Text style={styles.aiButtonText}>🤖 Generate Summary</Text>
            </Pressable>
            <Text style={styles.aiNote}>AI integration placeholder — connect OpenAI/Anthropic in /services/ai.ts</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Translate</Text>
          <View style={styles.translateCard}>
            <Text style={styles.translateTitle}>Rewrite a stressful update</Text>
            <Text style={styles.translateSub}>Paste a brain dump. Get back a calmer version that explains what's actually happening.</Text>
            <Pressable style={styles.translateButton}>
              <Text style={styles.translateButtonText}>💬 Open Translator</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 32 }] }>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          <View style={styles.stack}>
            {ACTIVITY.map(entry => {
              const project = entry.projectId ? PROJECTS.find(p => p.id === entry.projectId) : null;
              return (
                <View key={entry.id} style={styles.activityRow}>
                  <View style={styles.activityIconWrap}>
                    <Text style={styles.activityIcon}>{ACTIVITY_ICONS[entry.type] || '📋'}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDesc}>{entry.description}</Text>
                    {project && <Text style={styles.activityProject}>{project.title}</Text>}
                  </View>
                  <View style={styles.activityRight}>
                    <Avatar userId={entry.actor} size={20} />
                    <Text style={styles.activityTime}>{formatTime(entry.timestamp)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { color: Colors.primary, fontSize: 16, fontWeight: '700', marginBottom: 12, letterSpacing: -0.2 },
  menuGrid: { flexDirection: 'row', gap: 10 },
  menuCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border, gap: 4,
  },
  menuIcon: { fontSize: 24, marginBottom: 4 },
  menuLabel: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  menuSub: { color: Colors.secondary, fontSize: 12 },
  stack: { gap: 10 },
  emptyCard: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  emptyText: { color: Colors.secondary, fontSize: 13, textAlign: 'center' },
  decisionCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  decisionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  decisionTitle: { color: Colors.primary, fontSize: 14, fontWeight: '600', flex: 1 },
  decisionContext: { color: Colors.secondary, fontSize: 12, lineHeight: 17 },
  optionsList: { gap: 4 },
  optionRow: { flexDirection: 'row', gap: 6 },
  optionBullet: { color: Colors.accent, fontSize: 12, fontWeight: '600', width: 16 },
  optionLabel: { color: Colors.secondary, fontSize: 12, flex: 1 },
  decisionMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  decisionMetaText: { color: Colors.accent, fontSize: 11, fontWeight: '500' },
  decisionProject: { color: Colors.secondary, fontSize: 11 },
  deadline: { color: Colors.warning, fontSize: 11 },
  aiCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  aiTitle: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  aiSub: { color: Colors.secondary, fontSize: 13, lineHeight: 18 },
  aiButton: { backgroundColor: Colors.elevated, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  aiButtonText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  aiNote: { color: Colors.muted, fontSize: 11, fontStyle: 'italic' },
  translateCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 10,
  },
  translateTitle: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  translateSub: { color: Colors.secondary, fontSize: 13, lineHeight: 18 },
  translateButton: { backgroundColor: Colors.elevated, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  translateButtonText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  activityRow: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  activityIconWrap: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.elevated,
    alignItems: 'center', justifyContent: 'center',
  },
  activityIcon: { fontSize: 16 },
  activityContent: { flex: 1 },
  activityDesc: { color: Colors.primary, fontSize: 13, fontWeight: '500' },
  activityProject: { color: Colors.accent, fontSize: 11, marginTop: 2 },
  activityRight: { alignItems: 'flex-end', gap: 4 },
  activityTime: { color: Colors.secondary, fontSize: 10 },
});
