import type { ParserResult } from './parseNewsFeed'
import { parseNewsFeed } from './parseNewsFeed'
import { cacheSet } from './cache'

export async function networkFetchNewsFeed(url: string): Promise<ParserResult> {
  const resp = await fetch(url)
  const text = await resp.text()
  const parseRes: ParserResult = parseNewsFeed(text)

  parseRes.forEach(data => cacheSet(url, data))

  return parseRes
}
