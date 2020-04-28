import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTextFetch } from '@fpc/hooks';
import { parseNewsFeed } from 'NewsParser';
import { Ionicons } from '@expo/vector-icons';
import { FeedContent } from './FeedContent';
import { styles } from './styles';

export function NewsFeed({ name, url }) {
  const [text, fetchErr, refetch, state] = useTextFetch(url);
  const parseResult = useMemo(() => parseNewsFeed(text), [text]);

  if (state === 'pending') {
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Loading...</Text>
        <Ionicons name="md-wifi" size={30} color={'#555'} />
      </View>
    );
  }

  if (fetchErr != null) {
    // TODO
    console.error(fetchErr);
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Oh no! Network error!</Text>
        <Ionicons name="md-bug" size={30} color={'#555'} />
      </View>
    );
  }

  const [data, parseErr] = parseResult;

  if (parseErr != null) {
    // TODO
    console.error(parseErr);
    return (
      <View style={styles.feedRow}>
        <Text style={styles.feedTitle}>Oh no! Parse error!</Text>
        <Ionicons name="md-bug" size={30} color={'#555'} />
      </View>
    );
  }

  return <FeedContent name={name} {...data} />;
}
