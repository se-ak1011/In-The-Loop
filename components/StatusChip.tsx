import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusColors, StatusLabels } from '../constants/theme';
import { Colors } from '../constants/theme';

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusChip({ status, size = 'md' }: Props) {
  const color = StatusColors[status] || Colors.secondary;
  const label = StatusLabels[status] || status;
  const isSmall = size === 'sm';

  return (
    <View style={[styles.chip, { borderColor: color + '60', backgroundColor: color + '18' }, isSmall && styles.chipSm]}>
      <View style={[styles.dot, { backgroundColor: color }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color }, isSmall && styles.labelSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 5,
    alignSelf: 'flex-start',
  },
  chipSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSm: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelSm: {
    fontSize: 11,
  },
});
