import type { ComponentProps } from 'react';
import { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  PaperProvider,
  MD3LightTheme,
  BottomNavigation,
  TouchableRipple,
} from 'react-native-paper';
import { NewsFeedList } from '@/components/FlatFeed';
import { BookmarkList } from '@/components/BookmarkList';
import { BookmarksProvider } from '@/bookmarks';
import feedList from '@/feeds.json';
import ListIcon from '@/assets/list-24px.svg';
import BookmarksIcon from '@/assets/bookmarks-24px.svg';

// TODO: this method is android-only
StatusBar.setBackgroundColor('#6d0705');

function Feeds() {
  return <NewsFeedList style={styles.newsFeedListContainer} feeds={feedList} />;
}

function Bookmarks() {
  return <BookmarkList style={styles.newsFeedListContainer} />;
}

interface IconProps {
  color?: string;
  size?: number;
  direction?: 'rtl' | 'ltr' | null;
}

const routes = [
  {
    key: 'feeds',
    title: 'Feeds',
    focusedIcon: ({ color, size }: IconProps) => (
      <ListIcon fill={color} height={size} width={size} />
    ),
  },
  {
    key: 'bookmarks',
    title: 'Bookmarks',
    focusedIcon: ({ color, size }: IconProps) => (
      <BookmarksIcon fill={color} height={size} width={size} />
    ),
  },
];

type TouchableProps = ComponentProps<typeof TouchableRipple> & { key: string };

export default function App() {
  const [index, setIndex] = useState(0);

  const renderScene = BottomNavigation.SceneMap({
    feeds: Feeds,
    bookmarks: Bookmarks,
  });

  return (
    <BookmarksProvider>
      <PaperProvider theme={MD3LightTheme}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderTouchable={({ key, children, ...props }: TouchableProps) => (
            <TouchableRipple {...props} key={key}>
              {children}
            </TouchableRipple>
          )}
          renderScene={renderScene}
        />
      </PaperProvider>
    </BookmarksProvider>
  );
}

const styles = StyleSheet.create({
  newsFeedListContainer: {
    marginHorizontal: 25,
  },
});
