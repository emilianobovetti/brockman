import type { ComponentProps } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NewsFeedList } from '@/components/GroupedFeed';
import { BookmarkList } from '@/components/BookmarkList';
import { NavigationContainer } from '@react-navigation/native';
import type { RouteProp, ParamListBase } from '@react-navigation/core';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
const Tab = createBottomTabNavigator();

interface RouteOpts {
  route: RouteProp<ParamListBase>;
  navigation: BottomTabNavigationProp<ParamListBase>;
  theme: ReactNavigation.Theme;
}

interface IconOpts {
  focused: boolean;
  color: string;
  size: number;
}

function navigationIcon({ route }: RouteOpts, icon: IconOpts) {
  const { color, size } = icon;

  switch (route.name) {
    case 'Feeds':
      return <ListIcon fill={color} height={size} width={size} />;
    case 'Bookmarks':
      return <BookmarksIcon fill={color} height={size} width={size} />;
  }
}

type ScreenOptions = ComponentProps<typeof Tab.Navigator>['screenOptions'];

const navigatorOptions: ScreenOptions = (routeOpts) => {
  return {
    tabBarIcon: (iconOpts) => navigationIcon(routeOpts, iconOpts),
  };
};

export default function App() {
  return (
    <BookmarksProvider>
      <PaperProvider theme={MD3LightTheme}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={navigatorOptions}>
            <Tab.Screen name="Feeds" component={Feeds} />
            <Tab.Screen name="Bookmarks" component={Bookmarks} />
          </Tab.Navigator>
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
