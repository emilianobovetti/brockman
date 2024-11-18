import { View, Text } from 'react-native';
import { FeedContent } from './FeedContent';
import type { FeedResult } from '@/feed/parser';
import styles from '@/components/sharedStyles';
import { useMemo } from 'react';

interface NewsFeedProps {
  name: string;
  url: string;
  fetchResult?: FeedResult;
}

export function NewsFeed(props: NewsFeedProps) {
  const { name, url, fetchResult = null } = props;
  const meta = useMemo(() => ({ name, url }), [name, url]);

  if (fetchResult == null) {
    return (
      <View style={styles.feedHead}>
        <Text style={styles.feedTitle}>Loading...</Text>
        <Text style={styles.feedIcon}>↻</Text>
      </View>
    );
  }

  if (fetchResult.isErr) {
    // TODO
    console.error(fetchResult.getErr());
    return (
      <View style={styles.feedHead}>
        <Text style={styles.feedTitle}>Oh no! I've got an error!</Text>
        <Text style={styles.feedIcon}>✖</Text>
      </View>
    );
  }

  return <FeedContent meta={meta} feed={fetchResult.get()} />;
}
