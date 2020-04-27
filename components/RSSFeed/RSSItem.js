import React from 'react';
import { View, Text } from 'react-native';

export function RSSItem({ title, description, pubDate, link }) {
  return (
    <View style={{ flexDirection: 'column' }}>
      <Text>{title}</Text>
    </View>
  );
}
