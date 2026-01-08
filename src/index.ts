import { unified } from 'unified';
import markdown from 'remark-parse';
import type * as notion from './notion';
import {
  BlocksOptions,
  parseBlocks,
  parseRichText,
  RichTextOptions,
} from './parser/internal';
import type * as md from './markdown';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';

/**
 * Parses Markdown content into Notion Blocks.
 *
 * @param body Any Markdown or GFM content
 * @param options Any additional options
 * @param options.enableMath Enable LaTeX math parsing (default: false).
 *   When false, dollar signs like $100 will be treated as plain text.
 *   When true, $...$ will be parsed as inline math and $$...$$ as block math.
 */
export function markdownToBlocks(
  body: string,
  options?: BlocksOptions,
): notion.Block[] {
  // Build the unified processor with optional math support
  // Parse in separate branches to avoid TypeScript type union issues
  const root = options?.enableMath
    ? unified().use(markdown).use(gfm).use(remarkMath).parse(body)
    : unified().use(markdown).use(gfm).parse(body);
  return parseBlocks(root as unknown as md.Root, options);
}

/**
 * Parses inline Markdown content into Notion RichText objects.
 * Only supports plain text, italics, bold, strikethrough, inline code, and hyperlinks.
 *
 * @param text any inline Markdown or GFM content
 * @param options Any additional option
 */
export function markdownToRichText(
  text: string,
  options?: RichTextOptions,
): notion.RichText[] {
  const root = unified().use(markdown).use(gfm).parse(text);
  return parseRichText(root as unknown as md.Root, options);
}
