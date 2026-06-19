import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Project } from '../types';
import { Colors, CategoryIcons, CategoryLabels } from '../constants/theme';
import { StatusChip } from './StatusChip';
import { Avatar } from './Avatar';
import { ProgressBar } from './ProgressBar';

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{CategoryIcons[project.category]}</Text>
          <Text style={styles.title} numberOfLines={1}>{project.title}</Text>
        </View>
        <Avatar userId={project.owner} size={26} />
      </View>

      <View style={styles.statusRow}>
        <StatusChip status={project.status} size="sm" />
        <Text style={styles.category}>{CategoryLabels[project.category]}</Text>
      </View>

      {project.nextStep ? (
        <View style={styles.nextStep}>
          <Text style={styles.nextStepLabel}>Next →</Text>
          <Text style={styles.nextStepText} numberOfLines={2}>{project.nextStep}</Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <ProgressBar progress={project.progress} />
        <Text style={styles.progressText}>{project.progress}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    color: Colors.secondary,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  nextStep: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.elevated,
    borderRadius: 6,
    padding: 8,
  },
  nextStepLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  nextStepText: {
    color: Colors.secondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    color: Colors.secondary,
    fontSize: 11,
    width: 28,
    textAlign: 'right',
  },
});
