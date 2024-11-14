import { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  PaperProvider,
  MD3LightTheme,
  BottomNavigation,
} from 'react-native-paper';
import { NewsFeedList } from '@/components/FlatFeed';
import { BookmarkList } from '@/components/BookmarkList';
import { NavigationContainer } from '@react-navigation/native';
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

export default function App() {
  const [index, setIndex] = useState(0);

  const renderScene = BottomNavigation.SceneMap({
    feeds: Feeds,
    bookmarks: Bookmarks,
  });

  return (
    <BookmarksProvider>
      <PaperProvider theme={MD3LightTheme}>
        <NavigationContainer>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
          />
        </NavigationContainer>
      </PaperProvider>
    </BookmarksProvider>
  );
}

const styles = StyleSheet.create({
  newsFeedListContainer: {
    marginHorizontal: 25,
  },
});
