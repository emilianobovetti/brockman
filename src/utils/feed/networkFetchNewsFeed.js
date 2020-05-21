import { parseNewsFeed } from './parseNewsFeed';
import { cacheSet } from './cache';

export const networkFetchNewsFeed = async url => {
  const resp = await fetch(url);
  const text = await resp.text();
  const parseRes = parseNewsFeed(text);

  parseRes.forEach(data => cacheSet(url, data));

  return parseRes;
};
