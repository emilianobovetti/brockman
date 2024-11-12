import { useReducer, useEffect } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { FlatList, RefreshControl } from 'react-native'
import type { ListRenderItemInfo } from '@react-native/virtualized-lists'
import type { ParserResult } from '@/utils/feed/parseNewsFeed'
import { fetchNewsFeed, networkFetchNewsFeed } from '@/utils/feed'
import { NewsFeed } from '@/components/NewsFeed'

interface FeedInfo {
  name: string
  url: string
  fetchResult?: ParserResult
}

type UrlToIndex = { [url: string]: number }

type State = {
  totalItems: number
  fetchCount: number
  feedFetcher(url: string): Promise<ParserResult>
  refreshing: boolean
  urlToIndex: UrlToIndex
  feedArray: FeedInfo[]
}

const emptyState: State = {
  totalItems: 0,
  fetchCount: 0,
  feedFetcher: fetchNewsFeed,
  refreshing: false,
  urlToIndex: {},
  feedArray: [],
}

function initFromFeeds(feeds: FeedInfo[]) {
  const urlToIndex: UrlToIndex = {}
  const feedArray: FeedInfo[] = []

  feeds.forEach(feed => {
    urlToIndex[feed.url] = feedArray.push(feed) - 1
  })

  return {
    ...emptyState,
    totalItems: feeds.length,
    urlToIndex,
    feedArray,
  }
}

function resetFetchResult(feed: FeedInfo) {
  const { fetchResult, ...rest } = feed

  return rest
}

function handleSetFeeds({ feeds }: SetFeedsAction) {
  return {
    ...initFromFeeds(feeds),
    feedFetcher: fetchNewsFeed,
  }
}

function handleRefresh(state: State) {
  return {
    ...initFromFeeds(state.feedArray.map(resetFetchResult)),
    feedFetcher: networkFetchNewsFeed,
    refreshing: true,
  }
}

function handleResponse(state: State, { url, result }: ResponseAction) {
  const fetchCount = state.fetchCount + 1
  const index = state.urlToIndex[url]

  if (index == null) {
    // When a reponse arrives after "reset" message
    // has been dispatched
    return state
  }

  const feed = state.feedArray[index]
  feed.fetchResult = result

  return {
    ...state,
    fetchCount,
    refreshing: state.refreshing && fetchCount < state.totalItems,
    feedArray: state.feedArray.slice(),
  }
}

type SetFeedsAction = { msg: 'setFeeds'; feeds: FeedInfo[] }
type RefreshAction = { msg: 'refresh' }
type ResponseAction = { msg: 'response'; url: string; result: ParserResult }
type Action = SetFeedsAction | RefreshAction | ResponseAction

function reducer(state: State, action: Action) {
  switch (action.msg) {
    case 'setFeeds':
      return handleSetFeeds(action)
    case 'refresh':
      return handleRefresh(state)
    case 'response':
      return handleResponse(state, action)
    default:
      // @ts-ignore: Property 'msg' does not exist on type 'never'
      throw new Error(`Unknown action message: '${action?.msg}'`)
  }
}

const getUrl = ({ url }: FeedInfo) => url
const newsFeedRenderer = ({ item }: ListRenderItemInfo<FeedInfo>) => (
  <NewsFeed {...item} />
)

interface NewsFeedListProps {
  feeds: FeedInfo[]
  style: StyleProp<ViewStyle>
}

export function NewsFeedList({ feeds = [], style }: NewsFeedListProps) {
  const [state, dispatch] = useReducer(reducer, emptyState)
  const { urlToIndex, feedFetcher } = state

  useEffect(() => {
    dispatch({ msg: 'setFeeds', feeds })
  }, [feeds])

  useEffect(() => {
    Object.keys(urlToIndex).forEach(url =>
      feedFetcher(url).then(result =>
        dispatch({ msg: 'response', url, result })
      )
    )
  }, [urlToIndex, feedFetcher])

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={() => dispatch({ msg: 'refresh' })}
        />
      }
      data={state.feedArray}
      numColumns={1}
      keyExtractor={getUrl}
      renderItem={newsFeedRenderer}
      contentContainerStyle={style}
    />
  )
}
