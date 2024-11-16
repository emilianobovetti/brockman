import { Linking, View, StyleSheet } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import type { RSSItem, AtomEntry } from '@/feed/parser';
import { useBookmarks } from '@/bookmarks';
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg';
import BookmarkIcon from '@/assets/bookmark-24px.svg';

interface RSSElementProps {
  elem: RSSItem | AtomEntry;
}

export function RSSElement({ elem }: RSSElementProps) {
  const { colors } = useTheme();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const title = elem.title ?? 'Unknown article title';
  const { link } = elem;
  const host = link == null ? 'Unknown site host' : getHost(link);
  const html = getHTML(elem) ?? 'Empty article content';
  const date = getDate(elem)?.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Title
        title={title}
        subtitle={host}
        titleVariant="headlineSmall"
        titleStyle={{ color: colors.secondary }}
        subtitleVariant="titleSmall"
        subtitleStyle={{ color: colors.tertiary }}
        right={(props) =>
          date == null ? null : (
            <Text {...props} style={{ marginRight: 10 }}>
              {date}
            </Text>
          )
        }
      />
      <Card.Content>
        <View style={styles.container}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            onShouldStartLoadWithRequest={(event) => {
              if (event.navigationType === 'click') {
                Linking.openURL(event.url);
              }

              return false;
            }}
            minimumFontSize={18}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            javaScriptEnabled={false}
            style={styles.webview}
          />
          <LinearGradient
            colors={['#FFFFFF00', colors.elevation.level1]}
            locations={[0.8, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </View>
      </Card.Content>
      <Card.Actions>
        {link == null ? null : (
          <Button mode="text" onPress={() => Linking.openURL(link)}>
            Continua a leggere
          </Button>
        )}
        <Button
          mode="text"
          onPress={() =>
            isBookmarked(elem) ? removeBookmark(elem) : addBookmark(elem)
          }>
          {isBookmarked(elem) ? (
            <BookmarkIcon fill={colors.onSurface} />
          ) : (
            <BookmarkBorderIcon fill={colors.onSurface} />
          )}
        </Button>
      </Card.Actions>
    </Card>
  );
}

export function getHost(url: string) {
  const [, , host] = url.match(/^([^/]*\/\/)?([^/]*)\//) ?? [];

  return host;
}

export function getHTML(elem: RSSItem | AtomEntry) {
  switch (elem.type) {
    case 'rss':
      return elem.description;
    case 'atom':
      return elem.content;
    default:
      return null;
  }
}

export function getDate(elem: RSSItem | AtomEntry): Date | null {
  switch (elem.type) {
    case 'rss':
      return elem.pubDate;
    case 'atom':
      return elem.updated;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    backgroundColor: 'transparent',
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
});
