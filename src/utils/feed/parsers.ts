import type { LogLevel } from 'xmldom'
import { DOMParser } from 'xmldom'
import type { Result } from '@fpc/result'
import { Ok, Err } from '@fpc/result'
import Stream from '@fpc/stream'

interface ErrorLog {
  message: any
  lineNumber: string | number
  columnNumber: string | number
}

interface ParseLogs {
  warning: ErrorLog[]
  error: ErrorLog[]
  fatalError: ErrorLog[]
}

export interface XMLParseErrors {
  type: 'parsing'
  text: string
  warnings: ErrorLog[]
  errors: ErrorLog[]
  fatalErrors: ErrorLog[]
}

export function parseXML(text: string): Result<XMLParseErrors, Document> {
  const logs: ParseLogs = {
    warning: [],
    error: [],
    fatalError: [],
  }

  const domparserOpts = {
    locator: { lineNumber: 'none', columnNumber: 'none' },
    errorHandler(level: LogLevel, message: any) {
      const { lineNumber, columnNumber } = domparserOpts.locator

      logs[level].push({ message, lineNumber, columnNumber })
    },
  }

  const domparser = new DOMParser(domparserOpts)
  const document = domparser.parseFromString(text, 'text/xml')

  return logs.error.length > 0 || logs.fatalError.length > 0
    ? Err({
        type: 'parsing',
        text,
        warnings: logs.warning,
        errors: logs.error,
        fatalErrors: logs.fatalError,
      })
    : Ok(document)
}

export function attributesStream(node: Node): Stream<Attr> {
  return Stream.fromArrayLike((node as Element).attributes ?? [])
}

export function childrenStream<T extends Node>(node: {
  childNodes: NodeListOf<T>
}): Stream<T> {
  return Stream.fromArrayLike(node.childNodes)
}

export function extractTextNode(node: Node) {
  const element: Element = node as Element

  if (element.tagName == null) {
    return []
  }

  const [text = ''] = childrenStream<ChildNode>(element)
    .filter(child => typeof (child as Text)?.data === 'string')
    .map(child => (child as Text).data.trim())

  return text === '' ? [] : [element.tagName, text]
}

export type RSSFlatData = { [name: string]: string | null }

function extractAttributes(attributes: Stream<Attr>, json: RSSFlatData = {}) {
  for (const { nodeName, nodeValue } of attributes) {
    if (nodeValue != null) {
      json[nodeName] = nodeValue
    }
  }

  return json
}

function extractTextNodes(children: Stream<Node>, json: RSSFlatData = {}) {
  for (const child of children.filter(child => child.childNodes != null)) {
    const [childTag, childText] = extractTextNode(child)

    if (childTag != null) {
      json[childTag] = childText
    }
  }

  return json
}

function rssNodeToJson(node: Node): RSSFlatData {
  let json = {}

  json = extractAttributes(attributesStream(node), json)
  json = extractTextNodes(childrenStream(node), json)

  return json
}

export type RSSParseError = {
  type: 'structure'
  message: string
  node: Node
}

export type RSSData = {
  type: 'rss'
  items: RSSFlatData[]
  data: RSSFlatData
}

export function parseRSS(root: Node): Result<RSSParseError, RSSData> {
  const [channel] = childrenStream(root).filter(
    node => (node as Element).tagName === 'channel'
  )

  if (channel == null) {
    return Err({
      type: 'structure',
      message: "Tag 'channel' not found in rss tree",
      node: root,
    })
  }

  const data = rssNodeToJson(channel as Element)

  const items = childrenStream(channel)
    .filter(node => (node as Element).tagName === 'item')
    .map(rssNodeToJson)
    .toArray()

  return Ok({
    type: 'rss',
    items,
    data,
  })
}

function atomNodeToJson(node: Node) {
  let json: RSSFlatData = {}

  const children = childrenStream(node)

  for (const child of children) {
    if ((child as Element).tagName === 'link') {
      const attrs = extractAttributes(attributesStream(child))

      if (attrs.rel !== 'self' && typeof attrs.href === 'string') {
        json.link = attrs.href.trim()
      }
    }
  }

  json = extractAttributes(attributesStream(node), json)
  json = extractTextNodes(children, json)

  return json
}

export type AtomData = {
  type: 'atom'
  entries: RSSFlatData[]
  data: RSSFlatData
}

export function parseAtom(root: Node): Result<any, AtomData> {
  const data = atomNodeToJson(root)

  const entries = childrenStream(root)
    .filter(node => (node as Element).tagName === 'entry')
    .map(atomNodeToJson)
    .toArray()

  return Ok({
    type: 'atom',
    entries,
    data,
  })
}
