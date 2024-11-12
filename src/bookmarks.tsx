import type { Dispatch, ReactNode } from 'react'
import { createContext, useReducer, useEffect, useContext } from 'react'
import type { RSSFlatData } from '@/utils/feed/parsers'
import Storage from '@/utils/storage'

export interface Bookmark extends RSSFlatData {
  title: string
  link: string
}

interface State {
  urlToIndex: { [url: string]: number }
  bookmarks: Bookmark[]
  isStorageLoaded: boolean
}

const emptyState: State = {
  urlToIndex: {},
  bookmarks: [],
  isStorageLoaded: false,
}

const noop = () => {}

type HookContext = [State, Dispatch<Action>]

const Ctx = createContext<HookContext>([emptyState, noop])

async function getStoredBookmarks(): Promise<Bookmark[]> {
  const bookmarks = await Storage.getItem<Bookmark[]>('bookmarks')

  return bookmarks ?? []
}

function storeBookmarks(bookmarks: Bookmark[]) {
  return Storage.setItem('bookmarks', bookmarks)
}

function handleAddStoredItems({ bookmarks }: State, items: Bookmark[]) {
  const newItems = bookmarks.concat(items)
  const urlToIndex: State['urlToIndex'] = {}

  newItems.forEach((item, index) => {
    urlToIndex[item.link] = index
  })

  if (bookmarks.length > 0) {
    storeBookmarks(newItems)
  }

  return { bookmarks: newItems, urlToIndex, isStorageLoaded: true }
}

function handleAddItem(state: State, newItem: Bookmark) {
  const { urlToIndex, bookmarks } = state
  const newItems = bookmarks.slice()
  const newMap = { ...urlToIndex }
  newMap[newItem.link] = newItems.push(newItem) - 1

  if (state.isStorageLoaded) {
    storeBookmarks(newItems)
  }

  return { ...state, bookmarks: newItems, urlToIndex: newMap }
}

function handleRemoveItem(state: State, item: Bookmark) {
  const { urlToIndex, bookmarks } = state
  const newItems = bookmarks.filter(bm => bm.link !== item.link)
  const newMap = { ...urlToIndex }
  delete newMap[item.link]

  if (state.isStorageLoaded) {
    storeBookmarks(newItems)
  }

  return { ...state, bookmarks: newItems, urlToIndex: newMap }
}

type AddStoredItemsAction = { msg: 'addStoredItems'; items: Bookmark[] }
type AddItemAction = { msg: 'addItem'; item: Bookmark }
type RemoveItemAction = { msg: 'removeItem'; item: Bookmark }
type Action = AddStoredItemsAction | AddItemAction | RemoveItemAction

function reducer(state: State, action: Action) {
  switch (action.msg) {
    case 'addStoredItems':
      return handleAddStoredItems(state, action.items)
    case 'addItem':
      return handleAddItem(state, action.item)
    case 'removeItem':
      return handleRemoveItem(state, action.item)
    default:
      // @ts-ignore: Property 'msg' does not exist on type 'never'
      throw new Error(`Unknown action message: '${action?.msg}'`)
  }
}

interface BookmarksProviderProps {
  children?: ReactNode | undefined
}

export function BookmarksProvider({ children }: BookmarksProviderProps) {
  const ctx = useReducer(reducer, emptyState)

  useEffect(() => {
    const [, dispatch] = ctx

    getStoredBookmarks().then(items =>
      dispatch({ msg: 'addStoredItems', items })
    )
  }, [])

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
}

export const useBookmarks = () => {
  const [state, dispatch] = useContext(Ctx)
  const { bookmarks, urlToIndex } = state

  return {
    bookmarks,
    addBookmark: (item: Bookmark) => dispatch({ msg: 'addItem', item }),
    removeBookmark: (item: Bookmark) => dispatch({ msg: 'removeItem', item }),
    isBookmarked: (item: Bookmark) => urlToIndex[item.link] != null,
  }
}