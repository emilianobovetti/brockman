import { View, Text, TouchableOpacity, Linking } from 'react-native';
import type { FeedMetadata, Post } from '@/feed/parser';
import { useBookmarks } from '@/bookmarks';
import BookmarkBorderIcon from '@/assets/bookmark-border-24px.svg';
import BookmarkIcon from '@/assets/bookmark-24px.svg';
import styles from '@/components/sharedStyles';

interface FeedEntryProps {
  meta: FeedMetadata;
  post: Post;
}

export function FeedEntry({ meta, post }: FeedEntryProps) {
  const { title, link } = post;
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  return (
    <View style={styles.feedButtonOutline}>
      <View style={styles.feedButtonContainer}>
        <TouchableOpacity
          style={styles.feedButton}
          onPress={() => link != null && Linking.openURL(link)}
          onLongPress={() =>
            isBookmarked(link)
              ? removeBookmark(link)
              : addBookmark({ meta, post })
          }
        >
          <Text style={styles.feedButtonText}>{title}</Text>
          {isBookmarked(link) ? (
            <BookmarkIcon fill="#000" />
          ) : (
            <BookmarkBorderIcon fill="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
