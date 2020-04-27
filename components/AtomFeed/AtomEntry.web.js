import React from 'react';
import { View, Text } from 'react-native';

export function AtomEntry({ title, description, updated, link }) {
  return (
    <View style={{ flexDirection: 'column' }}>
      <a href={link} target="_blank">{title}</a>
      {
      //<div dangerouslySetInnerHTML={{ __html: description }}></div>
      }
    </View>
  );
}
