import React from 'react';
import { StatusBar } from 'react-native';
import { NewsFeedList } from 'components/NewsFeedList';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import feeds from 'feeds';

// TODO: this method is android-only
StatusBar.setBackgroundColor('#6d0705');

const FrontendFeeds = () => <NewsFeedList feeds={feeds.frontend} />;
const NetsecFeeds = () => <NewsFeedList feeds={feeds.netsec} />;
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="frontend" component={FrontendFeeds} />
        <Tab.Screen name="netsec" component={NetsecFeeds} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
