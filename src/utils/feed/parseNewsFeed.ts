import { parseXML, parseRSS, parseAtom, childrenStream } from './parsers';
import { Err } from '@fpc/result';

const parsers = {
  rss: parseRSS,
  feed: parseAtom,
};

export const parseNewsFeed = text =>
  parseXML(text).map(document => {
    const [root] = childrenStream(document)
      .filter(n => parsers[n.tagName] != null);

    return root == null
      ? Err({
        type: 'structure',
        message: 'No known tag found in XML root',
        node: document,
      })
      : parsers[root.tagName](root);
  });
