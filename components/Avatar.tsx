import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { USERS } from '../data/mockData';

interface Props {
  userId: string;
  size?: number;
}

export function Avatar({ userId, size = 28 }: Props) {
  const user = USERS[userId];
  if (!user) return null;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: user.color + '30', borderColor: user.color + '60' }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36, color: user.color }]}>{user.initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  initials: {
    fontWeight: '600',
  },
});
