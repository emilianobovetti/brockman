import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Linking } from 'expo';
import { styles } from './styles';

export function FeedEntry({ title, link }) {
  return (
    <View elevation={1} style={styles.feedButtonView}>
      <TouchableOpacity
        style={styles.feedButton}
        onPress={() => Linking.openURL(link)}
      >
        <Text style={styles.feedButtonText}>{title}</Text>
        <Text style={styles.feedButtonArrow}>></Text>
      </TouchableOpacity>
    </View>
  );
}
