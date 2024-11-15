import { useState } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import type { AtomEntry, ParsedFeed, RSSItem } from '@/utils/feed/parsers';
import { FeedEntry } from '@/components/GroupedFeed';
import styles from '@/components/sharedStyles';

const getLink = ({ link }: RSSItem | AtomEntry) => link ?? 'fallback-key';

function feedEntryRenderer({ item }: ListRenderItemInfo<RSSItem | AtomEntry>) {
  return <FeedEntry item={item} />;
}

interface FeedContentProps {
  name: string;
  feed: ParsedFeed;
}

function getEntries(feed: ParsedFeed): RSSItem[] | AtomEntry[] {
  switch (feed.type) {
    case 'rss':
      return feed.items;
    case 'atom':
      return feed.entries;
    default:
      return [];
  }
}

export function FeedContent({ name, feed }: FeedContentProps) {
  const [shownEntries, setShownEntries] = useState<Array<RSSItem | AtomEntry>>(
    [],
  );

  const allEntries = getEntries(feed);
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
        <Text style={styles.feedTitle}>{name}</Text>
      </TouchableOpacity>

      <FlatList
        numColumns={1}
        data={shownEntries}
        keyExtractor={getLink}
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
