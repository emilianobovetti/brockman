import { View, Text, TouchableOpacity, Linking } from 'react-native'
import type { RSSFlatData } from '@/utils/feed/parsers'
import { useBookmarks } from '@/bookmarks'
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg'
import BookmarkIcon from '@/assets/bookmark-24px.svg'
import styles from '@/components/sharedStyles'

export interface FeedEntry extends RSSFlatData {
  title: string
  link: string
}

interface FeedEntryProps {
  item: FeedEntry
}

export function FeedEntry({ item }: FeedEntryProps) {
  const { title, link } = item
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  return (
    <View style={styles.feedButtonOutline}>
      <View style={styles.feedButtonContainer}>
        <TouchableOpacity
          style={styles.feedButton}
          onPress={() => Linking.openURL(link)}
          onLongPress={() =>
            isBookmarked(item) ? removeBookmark(item) : addBookmark(item)
          }
        >
          <Text style={styles.feedButtonText}>{title}</Text>
          {isBookmarked(item) ? (
            <BookmarkIcon fill="#000" />
          ) : (
            <BookmarkBorderIcon fill="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}
