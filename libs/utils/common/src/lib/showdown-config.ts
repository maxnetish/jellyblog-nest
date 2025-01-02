import { ShowdownOptions } from 'showdown';

/**
 * Showdown converter options
 * 
 * @see https://showdownjs.com/docs/available-options/
 */
export const showdownConfig: Readonly<ShowdownOptions> = {
  backslashEscapesHTMLTags: true,
  completeHTMLDocument: false,
  customizedHeaderId: true,
  disableForced4SpacesIndentedSublists: false,
  emoji: true,
  ellipsis: true,
  encodeEmails: true,
  ghCodeBlocks: true,
  ghCompatibleHeaderId: true,
  ghMentions: false,
  headerLevelStart: 1,
  literalMidWordUnderscores: false,
  metadata: false,
  noHeaderId: false,
  omitExtraWLInCodeBlocks: false,
  openLinksInNewWindow: false,
  parseImgDimensions: true,
  prefixHeaderId: true,
  rawHeaderId: false,
  rawPrefixHeaderId: false,
  requireSpaceBeforeHeadingText: true,
  simpleLineBreaks: true,
  simplifiedAutoLink: false,
  smartIndentationFix: true,
  smoothLivePreview: true,
  splitAdjacentBlockquotes: false,
  strikethrough: true,
  tables: true,
  tablesHeaderId: false,
  tasklists: true,
  underline: true,
}