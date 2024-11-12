import type {
  XMLParseErrors,
  RSSParseError,
  RSSData,
  AtomData,
} from './parsers'
import { parseXML, parseRSS, parseAtom, childrenStream } from './parsers'
import type { Result } from '@fpc/result'
import { Err } from '@fpc/result'

export type ParsedFeed = RSSData | AtomData
export type ParserResult = Result<XMLParseErrors | RSSParseError, ParsedFeed>
export type Parser = (node: Node) => ParserResult
type ParserMap = { [key: string]: Parser }

const parsers: ParserMap = {
  rss: parseRSS,
  feed: parseAtom,
}

export function parseNewsFeed(text: string): ParserResult {
  return parseXML(text).map((document: Document) => {
    const [root] = childrenStream(document).filter(
      (node: ChildNode) => parsers[(node as Element).tagName] != null
    )

    if (root == null) {
      return Err({
        type: 'structure',
        message: 'No known tag found in XML root',
        node: document as Node,
      })
    }

    return parsers[(root as Element).tagName](root)
  })
}
