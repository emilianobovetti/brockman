import React, { createContext, useReducer, useEffect, useContext } from 'react';
import Storage from 'utils/storage';

const Ctx = createContext();

const getStoredBookmarks = () =>
  Storage.getItem('bookmarks').then(bookmarks =>
    bookmarks == null ? [] : bookmarks,
  );

const storeBookmarks = bookmarks =>
  Storage.setItem('bookmarks', bookmarks);

const emptyState = {
  urlToIndex: {},
  itemArray: [],
  isStorageLoaded: false,
};

const handleAddStoredItems = ({ itemArray }, items) => {
  const newItems = itemArray.concat(items);
  const urlToIndex = {};
  /* eslint-disable-next-line no-return-assign */
  newItems.forEach((item, index) => urlToIndex[item.link] = index);

  if (itemArray.length > 0) {
    storeBookmarks(newItems);
  }

  return { itemArray: newItems, urlToIndex, isStorageLoaded: true };
};

const handleAddItem = (state, newItem) => {
  const { urlToIndex, itemArray } = state;
  const newItems = itemArray.slice();
  const newMap = { ...urlToIndex };
  newMap[newItem.link] = newItems.push(newItem) - 1;

  if (state.isStorageLoaded) {
    storeBookmarks(newItems);
  }

  return { ...state, itemArray: newItems, urlToIndex: newMap };
};

const handleRemoveItem = (state, item) => {
  const { urlToIndex, itemArray } = state;
  const newItems = itemArray.filter(i => i.link !== item.link);
  const newMap = { ...urlToIndex };
  delete newMap[item.link];

  if (state.isStorageLoaded) {
    storeBookmarks(newItems);
  }

  return { ...state, itemArray: newItems, urlToIndex: newMap };
};

const reducer = (state, action) => {
  switch (action.msg) {
    case 'addStoredItems':
      return handleAddStoredItems(state, action.items);
    case 'addItem':
      return handleAddItem(state, action.item);
    case 'removeItem':
      return handleRemoveItem(state, action.item);
    default:
      throw new Error(`Unknown message '${action.msg}'`);
  }
};

export function BookmarksProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, emptyState);

  useEffect(() => {
    getStoredBookmarks().then(items =>
      dispatch({ msg: 'addStoredItems', items }),
    );
  }, []);

  return (
    <Ctx.Provider value={[state, dispatch]}>
      {children}
    </Ctx.Provider>
  );
}

export const useBookmarks = () => {
  const [state, dispatch] = useContext(Ctx);
  const { itemArray: bookmarks, urlToIndex } = state;

  return {
    bookmarks,
    addBookmark: item => dispatch({ msg: 'addItem', item }),
    removeBookmark: item => dispatch({ msg: 'removeItem', item }),
    isBookmarked: item => urlToIndex[item.link] != null,
  };
};
