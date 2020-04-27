import React from 'react';
import { View, Text } from 'react-native';

export function AtomEntry({ title, description, updated, link }) {
  return (
    <View style={{ flexDirection: 'column' }}>
      <Text>{title}</Text>
    </View>
  );
}
