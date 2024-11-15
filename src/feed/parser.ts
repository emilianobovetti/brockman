import type { LogLevel } from 'xmldom';
import { DOMParser } from 'xmldom';
import type { Result } from '@fpc/result';
import { Ok, Err } from '@fpc/result';
import Stream from '@fpc/stream';

interface ErrorLog {
  message: any;
  lineNumber: string | number;
  columnNumber: string | number;
}

interface ParseLogs {
  warning: ErrorLog[];
  error: ErrorLog[];
  fatalError: ErrorLog[];
}

export interface XMLParseErrors {
  type: 'parsing';
  text: string;
  warnings: ErrorLog[];
  errors: ErrorLog[];
  fatalErrors: ErrorLog[];
}

export function parseXML(text: string): Result<XMLParseErrors, Document> {
  const logs: ParseLogs = {
    warning: [],
    error: [],
    fatalError: [],
  };

  const domparserOpts = {
    locator: { lineNumber: 'none', columnNumber: 'none' },
    errorHandler(level: LogLevel, message: any) {
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
        fatalErrors: logs.fatalError,
      })
    : Ok(document);
}

export function attributesStream(node: Node): Stream<Attr> {
  return Stream.fromArrayLike((node as Element).attributes ?? []);
}

export function childrenStream<T extends Node>(node: {
  childNodes: NodeListOf<T>;
}): Stream<T> {
  return Stream.fromArrayLike(node.childNodes);
}

export function extractTextNode(node: Node) {
  const element: Element = node as Element;

  if (element.tagName == null) {
    return [];
  }

  const [text = ''] = childrenStream<ChildNode>(element)
    .filter((child) => typeof (child as Text)?.data === 'string')
    .map((child) => (child as Text).data.trim());

  return text === '' ? [] : [element.tagName, text];
}

type RSSFlatData = { [name: string]: string | null | undefined };

function extractAttributes(attributes: Stream<Attr>, json: RSSFlatData = {}) {
  for (const { nodeName, nodeValue } of attributes) {
    if (nodeValue != null) {
      json[nodeName] = nodeValue;
    }
  }

  return json;
}

function extractTextNodes(children: Stream<Node>, json: RSSFlatData = {}) {
  for (const child of children.filter((child) => child.childNodes != null)) {
    const [childTag, childText] = extractTextNode(child);

    if (childTag != null) {
      json[childTag] = childText;
    }
  }

  return json;
}

function rssNodeToJson(node: Node): RSSFlatData {
  let json = {};

  json = extractAttributes(attributesStream(node), json);
  json = extractTextNodes(childrenStream(node), json);

  return json;
}

export type RSSParseError = {
  type: 'structure';
  message: string;
  node: Node;
};

export type RSSData = {
  type: 'rss';
  title: string | null;
  link: string | null;
  description: string | null;
  items: RSSItem[];
};

export interface RSSItem {
  type: 'rss';
  key: string;
  title: string | null;
  link: string | null;
  pubDate: Date | null;
  description: string | null;
}

export function parseRSS(root: Node): Result<RSSParseError, RSSData> {
  const [channel] = childrenStream(root).filter(
    (node) => (node as Element).tagName === 'channel',
  );

  if (channel == null) {
    return Err({
      type: 'structure',
      message: "Tag 'channel' not found in rss tree",
      node: root,
    });
  }

  const {
    title = null,
    link = null,
    description = null,
  } = rssNodeToJson(channel as Element);

  const items = childrenStream(channel)
    .filter((node) => (node as Element).tagName === 'item')
    .map(rssNodeToJson)
    .map(parseRSSItem)
    .toArray();

  return Ok({ type: 'rss', title, link, description, items });
}

function parseRSSItem(item: RSSFlatData): RSSItem {
  const { title = null, link = null, description = null } = item;
  const pubDate = item.pubDate == null ? null : new Date(item.pubDate);

  return { type: 'rss', key: randomKey(), title, link, pubDate, description };
}

function atomNodeToJson(node: Node) {
  let json: RSSFlatData = {};

  const children = childrenStream(node);

  for (const child of children) {
    if ((child as Element).tagName === 'link') {
      const attrs = extractAttributes(attributesStream(child));

      if (attrs.rel !== 'self' && typeof attrs.href === 'string') {
        json.link = attrs.href.trim();
      }
    }
  }

  json = extractAttributes(attributesStream(node), json);
  json = extractTextNodes(children, json);

  return json;
}

export type AtomData = {
  type: 'atom';
  title: string | null;
  subtitle: string | null;
  link: string | null;
  entries: AtomEntry[];
};

export interface AtomEntry {
  type: 'atom';
  key: string;
  title: string | null;
  link: string | null;
  updated: Date | null;
  content: string | null;
}

export function parseAtom(root: Node): Result<any, AtomData> {
  const { title = null, subtitle = null, link = null } = atomNodeToJson(root);

  const entries = childrenStream(root)
    .filter((node) => (node as Element).tagName === 'entry')
    .map(atomNodeToJson)
    .map(parseAtomEntry)
    .toArray();

  return Ok({ type: 'atom', title, subtitle, link, entries });
}

function parseAtomEntry(entry: RSSFlatData): AtomEntry {
  const { title = null, link = null, content = null } = entry;
  const updated = entry.updated == null ? null : new Date(entry.updated);

  return { type: 'atom', key: randomKey(), title, link, updated, content };
}

export type ParsedFeed = RSSData | AtomData;
export type FeedResult = Result<XMLParseErrors | RSSParseError, ParsedFeed>;

export function parseNewsFeed(text: string): FeedResult {
  return parseXML(text).map((document: Document) => {
    const [root] = childrenStream(document).filter((node: ChildNode) => {
      const { tagName } = node as Element;

      return tagName === 'rss' || tagName === 'feed';
    });

    if (root == null) {
      return Err({
        type: 'structure',
        message: 'No known tag found in XML root',
        node: document as Node,
      });
    }

    const { tagName } = root as Element;

    switch (tagName) {
      case 'rss':
        return parseRSS(root);
      case 'feed':
        return parseAtom(root);
      default:
        throw new Error(`Unknown tagName: '${tagName}'`);
    }
  });
}

function randomChunk() {
  return String((Math.random() * 2147483647) | 0).padStart(10, '0');
}

function randomKey() {
  return Array(4).fill(null).map(randomChunk).join('');
}

function restoreDates(feed: ParsedFeed): ParsedFeed {
  switch (feed.type) {
    case 'rss':
      feed.items = feed.items.map(reHydrateRSSItem);
      break;
    case 'atom':
      feed.entries = feed.entries.map(reHydrateAtomEntry);
      break;
  }

  return feed;
}

export function reHydrateFeed(feed: ParsedFeed): ParsedFeed {
  return restoreDates(feed);
}

export function reHydrateElement(elem: RSSItem | AtomEntry) {
  switch (elem.type) {
    case 'rss':
      return reHydrateRSSItem(elem);
    case 'atom':
      return reHydrateAtomEntry(elem);
  }
}

export function reHydrateRSSItem(item: RSSItem): RSSItem {
  item.pubDate = item.pubDate == null ? null : new Date(item.pubDate);

  return item;
}

export function reHydrateAtomEntry(entry: AtomEntry): AtomEntry {
  entry.updated = entry.updated == null ? null : new Date(entry.updated);

  return entry;
}
