import { DOMParser } from 'xmldom';
import { Ok, Err } from '@fpc/result';
import { fromArrayLike } from '@fpc/stream';

export const parseXML = text => {
  const logs = {
    warning: [],
    error: [],
    fatalError: [],
  };

  const domparserOpts = {
    locator: {},
    errorHandler: (level, message) => {
      const { lineNumber, columnNumber } = domparserOpts.locator;

      logs[level].push({ message, lineNumber, columnNumber });
    },
  };

  const domparser = new DOMParser(domparserOpts);
  const document = domparser.parseFromString(text, 'text/xml');

  return logs.error.length > 0 || logs.fatalError.length > 0
    ? Err({
        type: 'parsing',
        text,
        warnings: logs.warning,
        errors: logs.error,
        fatalErrors: logs.fatalError
    })
    : Ok(document);
};

export const attributesStream = node =>
  fromArrayLike(node.attributes);

export const childrenStream = node =>
  fromArrayLike(node.childNodes);

export const textNodeToJson = node => {
  const [text] = childrenStream(node).filter(child =>
    child.data != null && child.data.trim() !== ''
  );

  return text == null ? [] : [node.tagName, text.data];
};

const attributesStreamToJson = (attributes, json = {}) =>
  attributes.reduce((acc, attribute) => {
    acc[attribute.nodeName] = attribute.nodeValue;

    return acc;
  }, json);

const childrenStreamToJson = (children, json = {}) =>
  children
    .filter(child => child.childNodes != null)
    .reduce((acc, child) => {
      const [childTag, childText] = textNodeToJson(child);

      if (childTag != null) {
        acc[childTag] = childText;
      }

      return acc;
    }, json);

const rssNodeToJson = node => {
  let json = {};

  json = attributesStreamToJson(attributesStream(node), json);
  json = childrenStreamToJson(childrenStream(node), json);

  return json;
};

export const parseRSS = root => {
  const [channel] = childrenStream(root)
    .filter(n => n.tagName === 'channel');
  
  if (channel == null) {
    return Err({
      type: 'structure',
      message: `Tag 'channel' not found in rss tree `,
      node: root,
    });
  }

  const json = rssNodeToJson(channel);

  json.items = childrenStream(channel)
    .filter(n => n.tagName === 'item')
    .map(rssNodeToJson)
    .toArray();

  json.type = 'rss';

  return Ok(json);
};

const atomNodeToJson = node => {
  let json = {};

  const children = childrenStream(node)
    .forEach(child => {
      if (child.tagName === 'link') {
        const atts = attributesStreamToJson(attributesStream(child));

        if (atts.rel == null || atts.rel !== 'self') {
          json.link = atts.href;
        }
      }
    });

  json = attributesStreamToJson(attributesStream(node), json);
  json = childrenStreamToJson(children, json);

  return json;
};

export const parseAtom = root => {
  const json = atomNodeToJson(root);

  json.entries = childrenStream(root)
    .filter(n => n.tagName === 'entry')
    .map(atomNodeToJson)
    .toArray();

  json.type = 'atom';

  return Ok(json);
};
