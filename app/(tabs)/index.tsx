import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockRepository } from '../../services/mockRepository';

const { projects: PROJECTS, tasks: TASKS, updates: UPDATES, decisions: DECISIONS, documents: DOCUMENTS, currentUser: CURRENT_USER, users: USERS } = mockRepository;
import { Colors } from '../../constants/theme';
import { ProjectCard } from '../../components/ProjectCard';
import { StatusChip } from '../../components/StatusChip';
import { Avatar } from '../../components/Avatar';
import { SectionHeader } from '../../components/SectionHeader';

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

export default function HomeScreen() {
  const router = useRouter();

  const activeProjects = PROJECTS.filter(p => p.status === 'in_progress' || p.status === 'waiting' || p.status === 'blocked').slice(0, 4);
  const waitingTasks = TASKS.filter(t => t.status === 'waiting' || t.status === 'blocked').slice(0, 3);
  const pendingDecisions = DECISIONS.filter(d => d.status === 'needs_decision' || d.status === 'discussing').slice(0, 3);
  const recentUpdates = [...UPDATES].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);
  const todayTasks = TASKS.filter(t => t.status !== 'done' && t.dueDate && t.dueDate <= new Date().toISOString().split('T')[0]).slice(0, 4);
  const recentDocs = [...DOCUMENTS].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetingTitle}>Here's what's happening.</Text>
            <Text style={styles.greetingSubtitle}>Nobody panic.</Text>
          </View>
          <Avatar userId={CURRENT_USER.id} size={36} />
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Active', value: PROJECTS.filter(p => p.status === 'in_progress').length, color: Colors.success },
            { label: 'Waiting', value: PROJECTS.filter(p => p.status === 'waiting').length, color: Colors.warning },
            { label: 'Blocked', value: PROJECTS.filter(p => p.status === 'blocked').length, color: Colors.danger },
            { label: 'Decisions', value: pendingDecisions.length, color: Colors.warning },
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Active Projects"
            subtitle={`${activeProjects.length} in motion`}
            action={
              <Pressable onPress={() => router.push('/projects')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            }
          />
          <View style={styles.stack}>
            {activeProjects.map(p => <ProjectCard key={p.id} project={p} />)}
          </View>
        </View>

        {waitingTasks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Waiting On" subtitle="Someone else's move" />
            <View style={styles.stack}>
              {waitingTasks.map(task => {
                const project = PROJECTS.find(p => p.id === task.projectId);
                return (
                  <View key={task.id} style={styles.listCard}>
                    <View style={styles.listCardLeft}>
                      <Text style={styles.listCardTitle}>{task.title}</Text>
                      {project && <Text style={styles.listCardSub}>{project.title}</Text>}
                    </View>
                    <View style={styles.listCardRight}>
                      <StatusChip status={task.status} size="sm" />
                      <Avatar userId={task.owner} size={22} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {pendingDecisions.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Decisions Needed"
              subtitle="Things stalled without this"
              action={
                <Pressable onPress={() => router.push('/more')}>
                  <Text style={styles.seeAll}>See all</Text>
                </Pressable>
              }
            />
            <View style={styles.stack}>
              {pendingDecisions.map(d => (
                <View key={d.id} style={[styles.listCard, styles.decisionCard]}>
                  <Text style={styles.decisionTitle}>{d.title}</Text>
                  <View style={styles.decisionMeta}>
                    <StatusChip status={d.status} size="sm" />
                    <Text style={styles.listCardSub}>→ {USERS[d.requestedFrom]?.name}</Text>
                    {d.deadline && <Text style={styles.deadlineText}>by {new Date(d.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title="Recent Updates" subtitle="Latest activity" />
          <View style={styles.stack}>
            {recentUpdates.map(u => {
              const project = PROJECTS.find(p => p.id === u.projectId);
              return (
                <View key={u.id} style={styles.updateCard}>
                  <View style={styles.updateHeader}>
                    <Avatar userId={u.author} size={22} />
                    <Text style={styles.updateAuthor}>{USERS[u.author]?.name}</Text>
                    <Text style={styles.updateTime}>{formatTime(u.timestamp)}</Text>
                  </View>
                  <Text style={styles.updateText} numberOfLines={2}>{u.text}</Text>
                  {project && <Text style={styles.updateProject}>{project.title}</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {todayTasks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Today's Tasks" subtitle="Overdue or due today" />
            <View style={styles.stack}>
              {todayTasks.map(task => (
                <View key={task.id} style={styles.listCard}>
                  <View style={styles.listCardLeft}>
                    <Text style={styles.listCardTitle}>{task.title}</Text>
                    {task.dueDate && <Text style={styles.listCardSub}>Due {task.dueDate}</Text>}
                  </View>
                  <View style={styles.listCardRight}>
                    <StatusChip status={task.status} size="sm" />
                    <Avatar userId={task.owner} size={22} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { marginBottom: 32 }]}>
          <SectionHeader
            title="Recent Documents"
            subtitle="Latest uploads"
            action={
              <Pressable onPress={() => router.push('/docs')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            }
          />
          <View style={styles.stack}>
            {recentDocs.map(doc => (
              <View key={doc.id} style={styles.docCard}>
                <Text style={styles.docIcon}>{doc.fileType === 'pdf' ? '📄' : doc.fileType === 'image' ? '🖼️' : '📎'}</Text>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docMeta}>{USERS[doc.uploadedBy]?.name} · {formatTime(doc.uploadedAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16, paddingTop: 8 },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  greetingTitle: { color: Colors.primary, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  greetingSubtitle: { color: Colors.secondary, fontSize: 13, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { color: Colors.secondary, fontSize: 10, marginTop: 2, fontWeight: '500' },
  section: { marginBottom: 20 },
  stack: { gap: 8 },
  seeAll: { color: Colors.accent, fontSize: 13, fontWeight: '500' },
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listCardLeft: { flex: 1, marginRight: 8 },
  listCardRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  listCardTitle: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  listCardSub: { color: Colors.secondary, fontSize: 11, marginTop: 2 },
  decisionCard: { flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  decisionTitle: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  decisionMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  deadlineText: { color: Colors.warning, fontSize: 11 },
  updateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  updateHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  updateAuthor: { color: Colors.primary, fontSize: 13, fontWeight: '600', flex: 1 },
  updateTime: { color: Colors.secondary, fontSize: 11 },
  updateText: { color: Colors.secondary, fontSize: 13, lineHeight: 18 },
  updateProject: { color: Colors.accent, fontSize: 11, fontWeight: '500' },
  docCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  docIcon: { fontSize: 20 },
  docInfo: { flex: 1 },
  docTitle: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
  docMeta: { color: Colors.secondary, fontSize: 11, marginTop: 2 },
});
