"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToBlocks = markdownToBlocks;
exports.markdownToRichText = markdownToRichText;
const unified_1 = require("unified");
const remark_parse_1 = __importDefault(require("remark-parse"));
const internal_1 = require("./parser/internal");
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const remark_math_1 = __importDefault(require("remark-math"));
/**
 * Parses Markdown content into Notion Blocks.
 *
 * @param body Any Markdown or GFM content
 * @param options Any additional options
 * @param options.enableMath Enable LaTeX math parsing (default: false).
 *   When false, dollar signs like $100 will be treated as plain text.
 *   When true, $...$ will be parsed as inline math and $$...$$ as block math.
 */
function markdownToBlocks(body, options) {
    // Build the unified processor with optional math support
    // Parse in separate branches to avoid TypeScript type union issues
    const root = options?.enableMath
        ? (0, unified_1.unified)().use(remark_parse_1.default).use(remark_gfm_1.default).use(remark_math_1.default).parse(body)
        : (0, unified_1.unified)().use(remark_parse_1.default).use(remark_gfm_1.default).parse(body);
    return (0, internal_1.parseBlocks)(root, options);
}
/**
 * Parses inline Markdown content into Notion RichText objects.
 * Only supports plain text, italics, bold, strikethrough, inline code, and hyperlinks.
 *
 * @param text any inline Markdown or GFM content
 * @param options Any additional option
 */
function markdownToRichText(text, options) {
    const root = (0, unified_1.unified)().use(remark_parse_1.default).use(remark_gfm_1.default).parse(text);
    return (0, internal_1.parseRichText)(root, options);
}
//# sourceMappingURL=index.js.map