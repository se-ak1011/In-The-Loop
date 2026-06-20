import React from 'react';
import { Alert, ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, CategoryIcons, CategoryLabels } from '../../constants/theme';
import { mockRepository } from '../../services/mockRepository';
import { generateProjectSummary } from '../../services/ai';

import { StatusChip } from '../../components/StatusChip';
import { Avatar } from '../../components/Avatar';
import { ProgressBar } from '../../components/ProgressBar';

const { users: USERS } = mockRepository;

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

const UPDATE_TYPE_ICONS: Record<string, string> = {
  note: '💬',
  status: '🔄',
  document: '📄',
  task: '✅',
  decision: '🤔',
};

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();

  const [isSummarising, setIsSummarising] = React.useState(false);
  const { project, updates, tasks, documents: docs, decisions } = mockRepository.getProjectBundle(id);
  if (!project) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Project not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  React.useEffect(() => {
    navigation.setOptions({ title: project.title });
  }, [navigation, project.title]);

  const owner = USERS[project.owner];

  const handleSummarise = async () => {
    setIsSummarising(true);
    try {
      const summary = await generateProjectSummary({ project, tasks, updates, decisions, documents: docs });
      Alert.alert(summary.source === 'remote' ? 'AI Summary' : 'Local Summary', `${summary.text}\n\n${summary.note}`);
    } catch (error) {
      Alert.alert('Summary unavailable', error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSummarising(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryIcon}>{CategoryIcons[project.category]}</Text>
            <Text style={styles.categoryLabel}>{CategoryLabels[project.category]}</Text>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{project.title}</Text>
            <Avatar userId={project.owner} size={32} />
          </View>
          <View style={styles.statusRow}>
            <StatusChip status={project.status} />
            <Text style={styles.ownerText}>{owner?.name}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardLabel}>Progress</Text>
            <Text style={styles.progressValue}>{project.progress}%</Text>
          </View>
          <ProgressBar progress={project.progress} height={6} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Summary</Text>
          <Text style={styles.cardText}>{project.description}</Text>
        </View>

        <View style={[styles.card, styles.nextStepCard]}>
          <Text style={styles.nextStepLabel}>Next Step →</Text>
          <Text style={styles.nextStepText}>{project.nextStep}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaKey}>Created</Text>
            <Text style={styles.metaValue}>{new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaKey}>Updated</Text>
            <Text style={styles.metaValue}>{new Date(project.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
          </View>
          {project.dueDate && (
            <View style={styles.metaItem}>
              <Text style={styles.metaKey}>Due</Text>
              <Text style={[styles.metaValue, { color: Colors.warning }]}>{new Date(project.dueDate).toLocaleDateString('en-GB')}</Text>
            </View>
          )}
        </View>

        <Pressable style={[styles.aiButton, isSummarising && styles.aiButtonDisabled]} onPress={handleSummarise} disabled={isSummarising}>
          <Text style={styles.aiButtonText}>{isSummarising ? 'Summarising…' : '🤖 Summarise this for my partner'}</Text>
        </Pressable>

        {tasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasks ({tasks.length})</Text>
            <View style={styles.stack}>
              {tasks.map(task => (
                <View key={task.id} style={styles.taskRow}>
                  <View style={[styles.taskDot, task.status === 'done' && styles.taskDotDone]} />
                  <Text style={[styles.taskTitle, task.status === 'done' && styles.taskDoneText]}>{task.title}</Text>
                  <Avatar userId={task.owner} size={20} />
                  <StatusChip status={task.status} size="sm" />
                </View>
              ))}
            </View>
          </View>
        )}

        {decisions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Decisions ({decisions.length})</Text>
            <View style={styles.stack}>
              {decisions.map(dec => (
                <View key={dec.id} style={styles.decisionCard}>
                  <View style={styles.decisionHeader}>
                    <Text style={styles.decisionTitle}>{dec.title}</Text>
                    <StatusChip status={dec.status} size="sm" />
                  </View>
                  <Text style={styles.decisionContext} numberOfLines={3}>{dec.context}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {docs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents ({docs.length})</Text>
            <View style={styles.stack}>
              {docs.map(doc => (
                <View key={doc.id} style={styles.docRow}>
                  <Text style={styles.docIcon}>{doc.fileType === 'pdf' ? '📄' : doc.fileType === 'image' ? '🖼️' : '📎'}</Text>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    {doc.notes && <Text style={styles.docNotes}>{doc.notes}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { marginBottom: 32 }] }>
          <Text style={styles.sectionTitle}>Updates Timeline ({updates.length})</Text>
          {updates.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No updates. Either calm or forgotten.</Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {updates.map((update, i) => (
                <View key={update.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDot}>
                      <Text style={styles.timelineDotText}>{UPDATE_TYPE_ICONS[update.type]}</Text>
                    </View>
                    {i < updates.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Avatar userId={update.author} size={20} />
                      <Text style={styles.timelineAuthor}>{USERS[update.author]?.name}</Text>
                      <Text style={styles.timelineTime}>{formatDateTime(update.timestamp)}</Text>
                    </View>
                    <Text style={styles.timelineText}>{update.text}</Text>
                    {update.attachmentName && (
                      <View style={styles.attachment}>
                        <Text style={styles.attachmentText}>📎 {update.attachmentName}</Text>
                      </View>
                    )}
                    {update.partnerInputNeeded && (
                      <View style={styles.inputNeeded}>
                        <Text style={styles.inputNeededText}>⚡ Partner input needed</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: Colors.secondary, fontSize: 16 },
  header: { marginBottom: 16, gap: 8 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryIcon: { fontSize: 14 },
  categoryLabel: { color: Colors.secondary, fontSize: 12, fontWeight: '500', letterSpacing: 0.3 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { color: Colors.primary, fontSize: 22, fontWeight: '700', letterSpacing: -0.5, flex: 1, marginRight: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ownerText: { color: Colors.secondary, fontSize: 13 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border,
  },
  cardLabel: { color: Colors.secondary, fontSize: 12, fontWeight: '600', marginBottom: 8, letterSpacing: 0.3, textTransform: 'uppercase' },
  cardText: { color: Colors.primary, fontSize: 14, lineHeight: 21 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressValue: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  nextStepCard: { backgroundColor: Colors.elevated, borderColor: Colors.accent + '40' },
  nextStepLabel: { color: Colors.accent, fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.3 },
  nextStepText: { color: Colors.primary, fontSize: 14, lineHeight: 20 },
  metaRow: {
    flexDirection: 'row', gap: 10, marginBottom: 12,
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  metaItem: { flex: 1 },
  metaKey: { color: Colors.secondary, fontSize: 10, fontWeight: '600', letterSpacing: 0.5, marginBottom: 3, textTransform: 'uppercase' },
  metaValue: { color: Colors.primary, fontSize: 12, fontWeight: '500' },
  aiButton: {
    backgroundColor: Colors.elevated, borderRadius: 10, padding: 12, alignItems: 'center',
    marginBottom: 16, borderWidth: 1, borderColor: Colors.border,
  },
  aiButtonText: { color: Colors.secondary, fontSize: 13, fontWeight: '500' },
  aiButtonDisabled: { opacity: 0.6 },
  section: { marginBottom: 16 },
  sectionTitle: { color: Colors.primary, fontSize: 15, fontWeight: '700', marginBottom: 10 },
  stack: { gap: 8 },
  taskRow: {
    backgroundColor: Colors.surface, borderRadius: 8, padding: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  taskDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  taskDotDone: { backgroundColor: Colors.success },
  taskTitle: { color: Colors.primary, fontSize: 13, flex: 1 },
  taskDoneText: { textDecorationLine: 'line-through', color: Colors.secondary },
  decisionCard: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  decisionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  decisionTitle: { color: Colors.primary, fontSize: 13, fontWeight: '600', flex: 1 },
  decisionContext: { color: Colors.secondary, fontSize: 12, lineHeight: 17 },
  docRow: {
    backgroundColor: Colors.surface, borderRadius: 8, padding: 10,
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  docIcon: { fontSize: 18, marginTop: 1 },
  docInfo: { flex: 1 },
  docTitle: { color: Colors.primary, fontSize: 13, fontWeight: '500' },
  docNotes: { color: Colors.secondary, fontSize: 11, marginTop: 2, lineHeight: 15 },
  emptyCard: {
    backgroundColor: Colors.surface, borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  emptyText: { color: Colors.secondary, fontSize: 13, textAlign: 'center' },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 10 },
  timelineLeft: { alignItems: 'center', width: 32 },
  timelineDot: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.elevated,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
    flexShrink: 0,
  },
  timelineDotText: { fontSize: 14 },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: Colors.border, marginVertical: 3 },
  timelineContent: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 8, gap: 6,
  },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineAuthor: { color: Colors.primary, fontSize: 12, fontWeight: '600', flex: 1 },
  timelineTime: { color: Colors.secondary, fontSize: 11 },
  timelineText: { color: Colors.primary, fontSize: 13, lineHeight: 19 },
  attachment: {
    backgroundColor: Colors.elevated, borderRadius: 6, padding: 6, paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  attachmentText: { color: Colors.secondary, fontSize: 11 },
  inputNeeded: {
    backgroundColor: Colors.warning + '18', borderRadius: 6, padding: 6, paddingHorizontal: 8,
    alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.warning + '40',
  },
  inputNeededText: { color: Colors.warning, fontSize: 11, fontWeight: '500' },
});
