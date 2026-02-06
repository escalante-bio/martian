import { supportedCodeLang } from './common';
import type { EmojiRequest, ApiColor } from './blocks';
export * from './blocks';
export * from './common';
export declare function parseCodeLanguage(lang?: string): supportedCodeLang | undefined;
/**
 * Parses text to find a leading emoji and determines its corresponding Notion callout color
 * Uses Unicode 15.0 emoji pattern to detect emoji at start of text
 * @returns Emoji and color data if text starts with an emoji, null otherwise
 */
export declare function parseCalloutEmoji(text: string): {
    emoji: EmojiRequest;
    color: ApiColor;
} | null;
