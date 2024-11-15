import { View, Text } from 'react-native';
import { FeedContent } from './FeedContent';
import type { FeedResult } from '@/utils/feed/parsers';
import styles from '@/components/sharedStyles';

interface NewsFeedProps {
  name: string;
  url: string;
  fetchResult?: FeedResult;
}

export function NewsFeed(props: NewsFeedProps) {
  const { name, fetchResult = null } = props;

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

  return <FeedContent name={name} feed={fetchResult.get()} />;
}
