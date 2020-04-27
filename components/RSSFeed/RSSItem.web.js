import React from 'react';
import { View, Text } from 'react-native';

export function RSSItem({ title, description, pubDate, link }) {
  return (
    <View style={{ flexDirection: 'column' }}>
      <a href={link} target="_blank">{title}</a>
      {
      //<div dangerouslySetInnerHTML={{ __html: description }}></div>
      }
    </View>
  );
}
