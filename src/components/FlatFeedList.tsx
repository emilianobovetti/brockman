import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { fetchNewsFeed, networkFetchNewsFeed } from '@/feed';
import { cacheClear } from '@/feed/cache';
import type { Post, FeedResult, FeedMetadata } from '@/feed/parser';
import { getFeedPosts, getPostDate } from '@/feed/parser';
import { RSSPost } from '@/components/RSSPost';

type NewsFeedFetcher = (url: string) => Promise<FeedResult>;

type UrlToFetched = {
  [url: string]: { meta: FeedMetadata; result: FeedResult };
};

interface FeedPost {
  meta: FeedMetadata;
  post: Post;
}

interface FlatFeedListProps {
  feeds: FeedMetadata[];
  style: StyleProp<ViewStyle>;
}

export function FlatFeedList({ feeds = [], style }: FlatFeedListProps) {
  const [urlToFeed, setUrlToFeed] = useState<UrlToFetched>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(
    (fetcher: NewsFeedFetcher) => {
      const fetches = feeds.map((meta) => {
        const { url } = meta;

        function onSuccess(result: FeedResult) {
          const fetched = { meta, result };
          setUrlToFeed((curr) => ({ ...curr, [url]: fetched }));
        }

        function onError(error: Error) {
          console.error(
            `Error while fetching ${url}\n${error?.message}\n${error.stack}`,
          );
        }

        return fetcher(url).then(onSuccess, onError);
      });

      Promise.all(fetches).then(() => setLoading(false));
    },
    [feeds],
  );

  const refresh = useCallback(() => {
    setUrlToFeed({});
    cacheClear();
    setLoading(true);
    fetchAll(networkFetchNewsFeed);
  }, [fetchAll]);

  useEffect(() => fetchAll(fetchNewsFeed), [fetchAll]);

  const feedArray = useMemo(() => {
    let array: Array<FeedPost> = [];

    for (const url in urlToFeed) {
      const { meta, result } = urlToFeed[url];

      if (result.isOk) {
        const parsedFeed = result.get();
        const posts = getFeedPosts(parsedFeed);
        array = array.concat(posts.map((post) => ({ meta, post })));
      } else {
        console.error(`Error while parsing ${url}`, result.getErr());
      }
    }

    return array.sort(compareFeedElements).slice(0, 100);
  }, [urlToFeed]);

  return (
    <FlatList
      style={{ marginTop: 10 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      data={feedArray}
      numColumns={1}
      keyExtractor={getKey}
      renderItem={elementRenderer}
      contentContainerStyle={style}
    />
  );
}

function getKey({ post }: FeedPost) {
  return `feed-item-${post.key}`;
}

function elementRenderer({ item }: ListRenderItemInfo<FeedPost>) {
  const { meta, post } = item;

  return <RSSPost meta={meta} post={post} />;
}

function compareFeedElements(fst: FeedPost, snd: FeedPost) {
  return (getDate(snd) ?? 0).valueOf() - (getDate(fst) ?? 0).valueOf();
}

function getDate({ post }: FeedPost) {
  return getPostDate(post);
}
