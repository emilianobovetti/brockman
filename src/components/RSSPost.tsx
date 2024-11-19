import { Linking, View, StyleSheet } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import type { FeedMetadata, Post } from '@/feed/parser';
import { getPostDate } from '@/feed/parser';
import { useBookmarks } from '@/bookmarks';
import BookmarkBorderIcon from '@/assets/bookmark-border-24px.svg';
import BookmarkIcon from '@/assets/bookmark-24px.svg';
import LaunchIcon from '@/assets/launch-24px.svg';

interface RSSPostProps {
  meta: FeedMetadata;
  post: Post;
}

export function RSSPost({ meta, post }: RSSPostProps) {
  const { colors } = useTheme();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const title = post.title ?? 'Unknown article title';

  const { link } = post;
  const host = link == null ? 'Unknown site host' : getHost(link);
  const subtitle = meta.name == null ? host : `${meta.name} - ${host}`;

  const date = getPostDate(post)?.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Title
        title={title}
        titleNumberOfLines={2}
        subtitle={subtitle}
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
          {getContent(post)}
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
            Apri
            <View>
              <LaunchIcon
                style={{ marginTop: 3, marginLeft: 7 }}
                fill={colors.primary}
              />
            </View>
          </Button>
        )}
        <Button
          mode="text"
          onPress={() =>
            isBookmarked(link)
              ? removeBookmark(link)
              : addBookmark({ meta, post })
          }>
          {isBookmarked(link) ? (
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

export function getContent(elem: Post) {
  switch (elem.type) {
    case 'rss':
      return webViewFromRawHTML(elem.description);
    case 'atom':
      return webViewFromRawHTML(elem.content);
    default:
      return null;
  }
}

function webViewFromRawHTML(input: string | null) {
  if (input == null) {
    return null;
  }

  // ref: https://www.joshwcomeau.com/css/custom-css-reset
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

body {
  line-height: 1.4;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

p {
  text-wrap: pretty;
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
  </style>
</head>

<body>
${input}
</body>
</html>
`;

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    backgroundColor: 'transparent',
    height: 200,
    overflow: 'hidden',
    marginTop: 5,
  },
});
