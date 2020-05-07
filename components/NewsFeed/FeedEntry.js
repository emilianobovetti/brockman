import React from 'react';
import { View, Linking, Text } from 'react-native';
import { Button } from 'components/Button';
import { styles } from './styles';

export function FeedEntry({ title, link }) {
  return (
    <View style={styles.feedButtonContainer}>
      <Button onPress={() => Linking.openURL(link)}>
        <Text style={styles.feedButtonText}>{title}</Text>
        <Text style={styles.feedButtonArrow}>></Text>
      </Button>
    </View>
  );
}
