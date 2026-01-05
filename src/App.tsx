import type { ComponentProps } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  PaperProvider,
  MD3LightTheme,
  BottomNavigation,
  TouchableRipple,
} from 'react-native-paper';
import { FlatFeedList } from '@/components/FlatFeedList';
import { BookmarkList } from '@/components/BookmarkList';
import { BookmarksProvider } from '@/bookmarks';
import feedList from '@/3d-print-feed.json';
import ListIcon from '@/assets/list-24px.svg';
import BookmarksIcon from '@/assets/bookmarks-24px.svg';
import LockIcon from '@/assets/lock-24px.svg';
import LockOpenIcon from '@/assets/lock-open-24px.svg';
import TaskLocker from '@/NativeTaskLocker';

StatusBar.setBackgroundColor(MD3LightTheme.colors.onSecondaryContainer);

function Feeds() {
  return <FlatFeedList style={styles.newsFeedListContainer} feeds={feedList} />;
}

function Bookmarks() {
  return <BookmarkList style={styles.newsFeedListContainer} />;
}

function Never() {
  return null;
}

interface IconProps {
  color?: string;
  size?: number;
  direction?: 'rtl' | 'ltr' | null;
}

const staticRoutes = [
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

type LockTaskModeState =
  | 'LOCK_TASK_MODE_NONE'
  | 'LOCK_TASK_MODE_LOCKED'
  | 'LOCK_TASK_MODE_PINNED'
  | 'LOCK_TASK_MODE_UNKNOWN';

const lockerRoute = {
  key: 'lock',
  title: 'Lock',
};

const lockClosed = ({ color, size }: IconProps) => (
  <LockIcon fill={color} height={size} width={size} />
);

const lockOpened = ({ color, size }: IconProps) => (
  <LockOpenIcon fill={color} height={size} width={size} />
);

type TouchableProps = ComponentProps<typeof TouchableRipple> & { key: string };

export default function App() {
  const [index, setIndex] = useState(0);
  const [lockMode, setLockMode] = useState(TaskLocker.getLockTaskModeState);

  const routes = useMemo(() => {
    if (TaskLocker.isDeviceOwnerApp()) {
      return [...staticRoutes, getLockerRoute(lockMode)];
    }

    return staticRoutes;
  }, [lockMode]);

  const handleIndexChange = useCallback(
    (index: number) => {
      const lockIndex = routes.findIndex(({ key }) => key === lockerRoute.key);

      if (index === lockIndex) {
        return toggleLockMode(setLockMode);
      }

      return setIndex(index);
    },
    [routes],
  );

  const renderScene = useMemo(
    () =>
      BottomNavigation.SceneMap({
        feeds: Feeds,
        bookmarks: Bookmarks,
        lock: Never,
      }),
    [],
  );

  return (
    <BookmarksProvider>
      <PaperProvider theme={MD3LightTheme}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={handleIndexChange}
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

function toggleLockMode(onToggle: (mode: LockTaskModeState) => void) {
  if (TaskLocker.getLockTaskModeState() === 'LOCK_TASK_MODE_NONE') {
    TaskLocker.startLockTask();
    onToggle('LOCK_TASK_MODE_LOCKED');
  } else {
    TaskLocker.stopLockTask();
    onToggle('LOCK_TASK_MODE_NONE');
  }
}

function getLockerRoute(lockMode: LockTaskModeState) {
  const focusedIcon =
    lockMode === 'LOCK_TASK_MODE_NONE' ? lockOpened : lockClosed;

  return { ...lockerRoute, focusedIcon };
}

const styles = StyleSheet.create({
  newsFeedListContainer: {
    marginHorizontal: 25,
  },
});
