import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  progress: number;
  height?: number;
}

export function ProgressBar({ progress, height = 4 }: Props) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${clamped}%`, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.muted,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
});
