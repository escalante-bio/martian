"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCodeLanguage = parseCodeLanguage;
exports.parseCalloutEmoji = parseCalloutEmoji;
const common_1 = require("./common");
const languageMap_json_1 = __importDefault(require("./languageMap.json"));
__exportStar(require("./blocks"), exports);
__exportStar(require("./common"), exports);
function parseCodeLanguage(lang) {
    return lang
        ? languageMap_json_1.default[lang.toLowerCase()]
        : undefined;
}
/**
 * Parses text to find a leading emoji and determines its corresponding Notion callout color
 * Uses Unicode 15.0 emoji pattern to detect emoji at start of text
 * @returns Emoji and color data if text starts with an emoji, null otherwise
 */
function parseCalloutEmoji(text) {
    if (!text)
        return null;
    // Get the first line of text
    const firstLine = text.split('\n')[0];
    // Match text that starts with an emoji (with optional variation selector)
    const match = firstLine.match(/^([\p{Emoji_Presentation}\p{Extended_Pictographic}][\u{FE0F}\u{FE0E}]?).*$/u);
    if (!match)
        return null;
    const emoji = match[1];
    return {
        emoji: emoji,
        color: common_1.SUPPORTED_EMOJI_COLOR_MAP[emoji] || 'default',
    };
}
//# sourceMappingURL=index.js.map