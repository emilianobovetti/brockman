import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { styles } from './styles';

export function FeedEntry({ title, link }) {
  return (
    <View style={styles.feedButtonOutline}>
      <View elevation={1} style={styles.feedButtonContainer}>
        <TouchableOpacity
          style={styles.feedButton}
          onPress={() => Linking.openURL(link)}
        >
          <Text style={styles.feedButtonText}>{title}</Text>
          <Text style={styles.feedButtonArrow}>></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
