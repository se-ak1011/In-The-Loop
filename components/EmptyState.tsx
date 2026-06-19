import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  icon?: string;
  message: string;
  sub?: string;
}

export function EmptyState({ icon = '📋', message, sub }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
  },
  message: {
    color: Colors.secondary,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  sub: {
    color: Colors.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
