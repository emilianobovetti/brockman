import type { Dispatch, ReactNode } from 'react';
import { createContext, useReducer, useEffect, useContext } from 'react';
import type { FeedMetadata, Post } from '@/feed/parser';
import { reHydratePost } from '@/feed/parser';
import Storage from '@/storage';

export interface Bookmark {
  meta: FeedMetadata;
  post: Post;
}

interface State {
  urlToIndex: { [url: string]: number };
  bookmarks: Bookmark[];
  isStorageLoaded: boolean;
}

const emptyState: State = {
  urlToIndex: {},
  bookmarks: [],
  isStorageLoaded: false,
};

function crash() {
  throw new Error('Bookmark context has not been initialized yet');
}

type HookContext = [State, Dispatch<Action>];

const Ctx = createContext<HookContext>([emptyState, crash]);

async function getStoredBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await Storage.getItem<Bookmark[]>('bookmarks');

  if (bookmarks == null) {
    return [];
  }

  return bookmarks.map(({ meta, post }) => ({
    meta,
    post: reHydratePost(post),
  }));
}

function storeBookmarks(bookmarks: Bookmark[]) {
  return Storage.setItem('bookmarks', bookmarks);
}

function handleAddStoredItems({ bookmarks }: State, items: Bookmark[]) {
  const newItems = bookmarks.concat(items);
  const urlToIndex: State['urlToIndex'] = {};

  newItems.forEach(({ post }, index) => {
    if (post.link != null) {
      urlToIndex[post.link] = index;
    }
  });

  if (bookmarks.length > 0) {
    storeBookmarks(newItems);
  }

  return { bookmarks: newItems, urlToIndex, isStorageLoaded: true };
}

function handleAddItem(state: State, newItem: Bookmark) {
  const { post } = newItem;

  if (post.link == null) {
    return state;
  }

  const { urlToIndex, bookmarks } = state;
  const newItems = bookmarks.slice();
  const newMap = { ...urlToIndex };
  newMap[post.link] = newItems.push(newItem) - 1;

  if (state.isStorageLoaded) {
    storeBookmarks(newItems);
  }

  return { ...state, bookmarks: newItems, urlToIndex: newMap };
}

function handleRemoveItem(state: State, link: string | null) {
  if (link == null) {
    return state;
  }

  const { urlToIndex, bookmarks } = state;
  const newItems = bookmarks.filter((bm) => bm.post.link !== link);
  const newMap = { ...urlToIndex };
  delete newMap[link];

  if (state.isStorageLoaded) {
    storeBookmarks(newItems);
  }

  return { ...state, bookmarks: newItems, urlToIndex: newMap };
}

type AddStoredItemsAction = { msg: 'addStoredItems'; items: Bookmark[] };
type AddItemAction = { msg: 'addItem'; item: Bookmark };
type RemoveItemAction = { msg: 'removeItem'; link: string | null };
type Action = AddStoredItemsAction | AddItemAction | RemoveItemAction;

function reducer(state: State, action: Action) {
  switch (action.msg) {
    case 'addStoredItems':
      return handleAddStoredItems(state, action.items);
    case 'addItem':
      return handleAddItem(state, action.item);
    case 'removeItem':
      return handleRemoveItem(state, action.link);
    default:
      // @ts-ignore: Property 'msg' does not exist on type 'never'
      throw new Error(`Unknown action message: '${action?.msg}'`);
  }
}

interface BookmarksProviderProps {
  children?: ReactNode | undefined;
}

export function BookmarksProvider({ children }: BookmarksProviderProps) {
  const ctx = useReducer(reducer, emptyState);

  useEffect(() => {
    const [, dispatch] = ctx;

    getStoredBookmarks().then((items) =>
      dispatch({ msg: 'addStoredItems', items }),
    );
  }, []);

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export const useBookmarks = () => {
  const [state, dispatch] = useContext(Ctx);
  const { bookmarks, urlToIndex } = state;

  return {
    bookmarks,
    addBookmark: (item: Bookmark) => dispatch({ msg: 'addItem', item }),
    removeBookmark: (link: string | null) =>
      dispatch({ msg: 'removeItem', link }),
    isBookmarked: (link: string | null) =>
      link != null && urlToIndex[link] != null,
  };
};
