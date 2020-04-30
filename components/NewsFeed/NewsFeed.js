import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedContent } from './FeedContent';
import { styles } from './styles';

export function NewsFeed({ name, url, fetchResult }) {
  if (fetchResult == null) {
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Loading...</Text>
        <Ionicons name="md-wifi" size={30} color={'#fff'} />
      </View>
    );
  }

  const [feed, err] = fetchResult;

  if (err != null) {
    // TODO
    console.error(err);
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Oh no! I've got an error!</Text>
        <Ionicons name="md-bug" size={30} color={'#fff'} />
      </View>
    );
  }

  return <FeedContent name={name} {...feed} />;
}
