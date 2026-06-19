import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DOCUMENTS, PROJECTS, USERS } from '../../data/mockData';
import { Colors } from '../../constants/theme';
import { EmptyState } from '../../components/EmptyState';

const CATEGORY_FILTERS = ['All', 'Car', 'Insurance', 'Home', 'Bills', 'Medical', 'Tenancy', 'Other'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DocsScreen() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? DOCUMENTS
    : DOCUMENTS.filter(d => d.category === filter.toLowerCase());

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORY_FILTERS.map(f => (
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
        {filtered.length === 0 ? (
          <EmptyState icon="🗂️" message="No documents yet." sub="Future you is already annoyed." />
        ) : (
          <View style={styles.stack}>
            {filtered.map(doc => {
              const project = PROJECTS.find(p => p.id === doc.projectId);
              return (
                <Pressable key={doc.id} style={styles.docCard}>
                  <View style={styles.fileIcon}>
                    <Text style={styles.fileIconText}>
                      {doc.fileType === 'pdf' ? '📄' : doc.fileType === 'image' ? '🖼️' : '📎'}
                    </Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <Text style={styles.docMeta}>
                      {USERS[doc.uploadedBy]?.name} · {formatDate(doc.uploadedAt)}
                    </Text>
                    {doc.notes && <Text style={styles.docNotes} numberOfLines={2}>{doc.notes}</Text>}
                    {project && (
                      <View style={styles.projectTag}>
                        <Text style={styles.projectTagText}>{project.title}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.docBadge}>
                    <Text style={styles.docBadgeText}>{doc.fileType.toUpperCase()}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>↑ Upload Document</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filterScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.accent + '30', borderColor: Colors.accent },
  filterLabel: { color: Colors.secondary, fontSize: 13, fontWeight: '500' },
  filterLabelActive: { color: Colors.primary },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  stack: { gap: 10 },
  docCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  fileIcon: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: Colors.elevated,
    alignItems: 'center', justifyContent: 'center',
  },
  fileIconText: { fontSize: 20 },
  docInfo: { flex: 1, gap: 3 },
  docTitle: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  docMeta: { color: Colors.secondary, fontSize: 12 },
  docNotes: { color: Colors.secondary, fontSize: 12, lineHeight: 16, marginTop: 2 },
  projectTag: {
    alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, backgroundColor: Colors.accent + '20', borderWidth: 1, borderColor: Colors.accent + '40',
  },
  projectTagText: { color: Colors.accent, fontSize: 10, fontWeight: '500' },
  docBadge: {
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
    backgroundColor: Colors.elevated, borderWidth: 1, borderColor: Colors.border,
  },
  docBadgeText: { color: Colors.secondary, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 24,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  uploadButton: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  uploadButtonText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
});
