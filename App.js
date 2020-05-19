import React from 'react';
import { StatusBar } from 'react-native';
import { NewsFeedList } from 'components/NewsFeedList';
import { BookmarkList } from 'components/BookmarkList';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookmarksProvider } from 'bookmarks';
import feedList from 'feeds.json';
import ListIcon from 'assets/list-24px.svg';
import BookmarksIcon from 'assets/bookmarks-24px.svg';

// TODO: this method is android-only
StatusBar.setBackgroundColor('#6d0705');

const Feeds = () => <NewsFeedList feeds={feedList} />;

const Tab = createBottomTabNavigator();

const navigationIcon = ({ route }, { focused, color, size }) => {
  switch (route.name) {
    case 'Feeds':
      return <ListIcon fill={color} height={size} width={size} />;
    case 'Bookmarks':
      return <BookmarksIcon fill={color} height={size} width={size} />;
  }
};

const navigatorOptions = routeOpts => ({
  tabBarIcon: iconOpts => navigationIcon(routeOpts, iconOpts),
});

export default function App() {
  return (
    <BookmarksProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={navigatorOptions}>
          <Tab.Screen name="Feeds" component={Feeds} />
          <Tab.Screen name="Bookmarks" component={BookmarkList} />
        </Tab.Navigator>
      </NavigationContainer>
    </BookmarksProvider>
  );
}
