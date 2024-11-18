import { useMemo, useState } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import type { FeedMetadata, ParsedFeed, Post } from '@/feed/parser';
import { getFeedPosts } from '@/feed/parser';
import { FeedEntry } from '@/components/GroupedFeed';
import styles from '@/components/sharedStyles';

interface FeedContentProps {
  meta: FeedMetadata;
  feed: ParsedFeed;
}

interface FeedPost {
  meta: FeedMetadata;
  post: Post;
}

export function FeedContent({ meta, feed }: FeedContentProps) {
  const [shownEntries, setShownEntries] = useState<Array<FeedPost>>([]);

  const allEntries: FeedPost[] = useMemo(() => {
    return getFeedPosts(feed).map((post) => ({ meta, post }));
  }, [feed]);

  const allEntriesNum = allEntries.length;
  const shownEntriesNum = shownEntries.length;
  const isExpanded = allEntriesNum > 0 && shownEntriesNum > 0;

  const hideEntries = () => setShownEntries([]);

  const showMoreEntries = () =>
    setShownEntries(allEntries.slice(0, shownEntriesNum + 5));

  return (
    <>
      <TouchableOpacity
        style={[styles.feedHead, isExpanded && styles.activeFeedHead]}
        onPress={() => (isExpanded ? hideEntries() : showMoreEntries())}>
        <Text style={styles.feedTitle}>{meta.name}</Text>
      </TouchableOpacity>

      <FlatList
        numColumns={1}
        data={shownEntries}
        keyExtractor={getKey}
        renderItem={feedEntryRenderer}
      />

      {isExpanded && (
        <View style={styles.showMoreContainer}>
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() =>
              shownEntriesNum < allEntriesNum
                ? showMoreEntries()
                : hideEntries()
            }>
            <Text style={styles.showMoreText}>
              {shownEntriesNum < allEntriesNum ? 'Show More' : 'Collapse'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

function getKey({ post }: FeedPost) {
  return post.key;
}

function feedEntryRenderer({ item }: ListRenderItemInfo<FeedPost>) {
  return <FeedEntry meta={item.meta} post={item.post} />;
}
