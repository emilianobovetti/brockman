import { useState } from 'react'
import type { ListRenderItemInfo } from 'react-native'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import type { ParsedFeed } from '@/utils/feed/parseNewsFeed'
import type { RSSFlatData } from '@/utils/feed/parsers'
import { FeedEntry } from '@/components/FeedEntry'
import styles from '@/components/sharedStyles'

const getLink = ({ link }: FeedEntry) => link ?? 'fallback-key'
const feedEntryRenderer = ({ item }: ListRenderItemInfo<FeedEntry>) => (
  <FeedEntry item={item} />
)

interface FeedContentProps {
  name: string
  feed: ParsedFeed
}

function filterFeedEntries(items: RSSFlatData[]): FeedEntry[] {
  return items.filter<FeedEntry>(
    (item): item is FeedEntry =>
      typeof item?.title === 'string' && typeof item.link === 'string'
  )
}

function getEntries(feed: ParsedFeed): FeedEntry[] {
  switch (feed.type) {
    case 'rss':
      return filterFeedEntries(feed.items)
    case 'atom':
      return filterFeedEntries(feed.entries)
    default:
      return []
  }
}

export function FeedContent({ name, feed }: FeedContentProps) {
  const [shownEntries, setShownEntries] = useState<FeedEntry[]>([])

  const allEntries = getEntries(feed)
  const allEntriesNum = allEntries.length
  const shownEntriesNum = shownEntries.length
  const isExpanded = allEntriesNum > 0 && shownEntriesNum > 0

  const hideEntries = () => setShownEntries([])

  const showMoreEntries = () =>
    setShownEntries(allEntries.slice(0, shownEntriesNum + 5))

  return (
    <>
      <TouchableOpacity
        style={[styles.feedHead, isExpanded && styles.activeFeedHead]}
        onPress={() => (isExpanded ? hideEntries() : showMoreEntries())}
      >
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
            }
          >
            <Text style={styles.showMoreText}>
              {shownEntriesNum < allEntriesNum ? 'Show More' : 'Collapse'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}
