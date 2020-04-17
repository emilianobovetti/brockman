import { DOMParser } from 'xmldom';
import { Ok, Err } from '@fpc/result';

const getChildByTagName = (node, tagName) => {
  const numChildren = node.childNodes == null ? 0 : node.childNodes.length;

  for (let i = 0; i < numChildren; i++) {
    const childNode = node.childNodes[i];

    if (childNode.tagName === tagName) {
      return Ok(childNode);
    }
  }

  return Err({
    type: 'structure',
    message: `No such child: '${tagName}' not found`,
    node,
  });
};

const getChildrenByTagName = (node, tagName) => {
  const numChildren = node.childNodes == null ? 0 : node.childNodes.length;
  const children = [];

  for (let i = 0; i < numChildren; i++) {
    const childNode = node.childNodes[i];

    if (childNode.tagName === tagName) {
      children.push(childNode);
    }
  }

  return children;
};

const parseTextNode = node => {
  const numChildren = node.childNodes == null ? 0 : node.childNodes.length;

  for (let i = 0; i < numChildren; i++) {
    const currentChild = node.childNodes[i];

    if (currentChild.data != null && currentChild.data.trim() !== '') {
      return [node.tagName, currentChild.data];
    }
  }

  return [];
};

const parseNode = node => {
  const json = {};
  const numAttributes = node.attributes == null ? 0 : node.attributes.length;
  const numChildren = node.childNodes == null ? 0 : node.childNodes.length;

  for (let i = 0; i < numAttributes; i++) {
    const attribute = node.attributes[i];
    json[attribute.nodeName] = attribute.nodeValue
  }

  for (let i = 0; i < numChildren; i++) {
    const [childTag, childText] = parseTextNode(node.childNodes[i]);

    if (childTag != null) {
      json[childTag] = childText;
    }
  }

  if (node.tagName != null) {
    json.tagName = node.tagName;
  }

  return json;
};

const parseChannel = node => {
  const channel = parseNode(node);
  channel.items = getChildrenByTagName(node, 'item').map(parseNode);
  return channel;
};

export const parseRSS = text => {
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
  const parseResult = logs.error.length > 0 || logs.fatalError.length > 0
    ? Err({
        type: 'parsing',
        text,
        warnings: logs.warning,
        errors: logs.error,
        fatalErrors: logs.fatalError
    })
    : Ok(document)

  return parseResult
    .map(doc => getChildByTagName(doc, 'rss'))
    .map(rssRoot => getChildByTagName(rssRoot, 'channel'))
    .map(parseChannel);
};
