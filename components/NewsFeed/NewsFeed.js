import React from 'react';
import { View, Text } from 'react-native';
import { FeedContent } from './FeedContent';
import { styles } from './styles';

export function NewsFeed({ name, url, fetchResult }) {
  if (fetchResult == null) {
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Loading...</Text>
        <Text style={{color: '#fff'}}>↻</Text>
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
        <Text style={{color: '#fff'}}>✖</Text>
      </View>
    );
  }

  return <FeedContent name={name} {...feed} />;
}
