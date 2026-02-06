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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlocks = parseBlocks;
exports.parseRichText = parseRichText;
const notion = __importStar(require("../notion"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const notion_1 = require("../notion");
function ensureLength(text, copy) {
    const chunks = text.match(/[^]{1,2000}/g) || [];
    return chunks.flatMap((item) => notion.richText(item, copy));
}
function ensureCodeBlockLanguage(lang) {
    if (lang) {
        lang = lang.toLowerCase();
        return (0, notion_1.isSupportedCodeLang)(lang) ? lang : notion.parseCodeLanguage(lang);
    }
    return undefined;
}
function parseInline(element, options) {
    const copy = {
        annotations: {
            ...(options?.annotations ?? {}),
        },
        url: options?.url,
    };
    switch (element.type) {
        case 'text':
            return ensureLength(element.value, copy);
        case 'delete':
            copy.annotations.strikethrough = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'emphasis':
            copy.annotations.italic = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'strong':
            copy.annotations.bold = true;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'link':
            copy.url = element.url;
            return element.children.flatMap(child => parseInline(child, copy));
        case 'inlineCode':
            copy.annotations.code = true;
            return [notion.richText(element.value, copy)];
        case 'inlineMath':
            return [notion.richText(element.value, { ...copy, type: 'equation' })];
        default:
            return [];
    }
}
function parseImage(image, options) {
    // https://developers.notion.com/reference/block#image-blocks
    const allowedTypes = [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.tif',
        '.tiff',
        '.bmp',
        '.svg',
        '.heic',
        '.webp',
    ];
    function dealWithError() {
        return notion.paragraph([notion.richText(image.url)]);
    }
    try {
        if (options.strictImageUrls ?? true) {
            const parsedUrl = new url_1.URL(image.url);
            const fileType = path_1.default.extname(parsedUrl.pathname);
            if (allowedTypes.includes(fileType)) {
                return notion.image(image.url);
            }
            else {
                return dealWithError();
            }
        }
        else {
            return notion.image(image.url);
        }
    }
    catch (error) {
        return dealWithError();
    }
}
function parseParagraph(element, options) {
    // Paragraphs can also be legacy 'TOC' from some markdown, so we check first
    const mightBeToc = element.children.length > 2 &&
        element.children[0].type === 'text' &&
        element.children[0].value === '[[' &&
        element.children[1].type === 'emphasis';
    if (mightBeToc) {
        const emphasisItem = element.children[1];
        const emphasisTextItem = emphasisItem.children[0];
        if (emphasisTextItem.value === 'TOC') {
            return [notion.table_of_contents()];
        }
    }
    // Notion doesn't deal with inline images, so we need to parse them all out
    // of the paragraph into individual blocks
    const images = [];
    const paragraphs = [];
    let currentParagraph = [];
    const pushParagraph = () => {
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph);
            currentParagraph = [];
        }
    };
    element.children.forEach(item => {
        if (item.type === 'image') {
            images.push(parseImage(item, options));
            return;
        }
        if (item.type === 'break') {
            pushParagraph();
            return;
        }
        const richText = parseInline(item);
        currentParagraph.push(...richText);
    });
    pushParagraph();
    return [...paragraphs.map(notion.paragraph), ...images];
}
function parseBlockquote(element, options) {
    const firstChild = element.children[0];
    const firstTextNode = firstChild?.type === 'paragraph'
        ? firstChild.children[0]
        : null;
    if (firstTextNode?.type === 'text') {
        // Helper to parse subsequent blocks
        const parseSubsequentBlocks = () => element.children.length > 1
            ? element.children.slice(1).flatMap(child => parseNode(child, options))
            : [];
        // Check for GFM alert syntax first (both escaped and unescaped)
        const firstLine = firstTextNode.value.split('\n')[0];
        const gfmMatch = firstLine.match(/^(?:\\\[|\[)!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/);
        if (gfmMatch && notion.isGfmAlertType(gfmMatch[1])) {
            const alertType = gfmMatch[1];
            const alertConfig = notion.GFM_ALERT_MAP[alertType];
            const displayType = alertType.charAt(0).toUpperCase() + alertType.slice(1).toLowerCase();
            const children = [];
            const contentLines = firstTextNode.value.split('\n').slice(1);
            if (contentLines.length > 0) {
                children.push(notion.paragraph(parseInline({
                    type: 'text',
                    value: contentLines.join('\n'),
                })));
            }
            children.push(...parseSubsequentBlocks());
            return notion.callout([notion.richText(displayType)], alertConfig.emoji, alertConfig.color, children);
        }
        // Check for emoji syntax if enabled
        if (options.enableEmojiCallouts) {
            const emojiData = notion.parseCalloutEmoji(firstTextNode.value);
            if (emojiData) {
                const paragraph = firstChild;
                const textWithoutEmoji = firstTextNode.value
                    .slice(emojiData.emoji.length)
                    .trimStart();
                // Process inline content from first paragraph
                const richText = paragraph.children.flatMap(child => child === firstTextNode
                    ? textWithoutEmoji
                        ? parseInline({ type: 'text', value: textWithoutEmoji })
                        : []
                    : parseInline(child));
                return notion.callout(richText, emojiData.emoji, emojiData.color, parseSubsequentBlocks());
            }
        }
    }
    // Parse all children as blocks
    const children = element.children.flatMap(child => parseNode(child, options));
    // Fix Issue #70: Extract rich_text from first paragraph child to avoid "Empty quote"
    // If the first child is a paragraph, use its rich_text content for the blockquote
    // and move remaining children to the blockquote's children array
    if (children.length > 0 && children[0].type === 'paragraph') {
        const firstParagraph = children[0];
        const richText = firstParagraph.paragraph.rich_text;
        const remainingChildren = children.slice(1);
        return notion.blockquote(richText, remainingChildren);
    }
    // Fallback: if no paragraph children, create a quote with placeholder text
    // to avoid Notion API rejecting empty rich_text arrays
    return notion.blockquote([notion.richText('')], children);
}
function parseHeading(element) {
    const text = element.children.flatMap(child => parseInline(child));
    switch (element.depth) {
        case 1:
            return notion.headingOne(text);
        case 2:
            return notion.headingTwo(text);
        default:
            return notion.headingThree(text);
    }
}
function parseCode(element) {
    const text = ensureLength(element.value);
    const lang = ensureCodeBlockLanguage(element.lang);
    return notion.code(text, lang);
}
function parseList(element, options) {
    return element.children.flatMap(item => {
        const paragraph = item.children.shift();
        if (paragraph === undefined || paragraph.type !== 'paragraph') {
            return [];
        }
        const text = paragraph.children.flatMap(child => parseInline(child));
        // Now process any of the children
        const parsedChildren = item.children.flatMap(child => parseNode(child, options));
        if (element.start !== null && element.start !== undefined) {
            return [notion.numberedListItem(text, parsedChildren)];
        }
        else if (item.checked !== null && item.checked !== undefined) {
            return [notion.toDo(item.checked, text, parsedChildren)];
        }
        else {
            return [notion.bulletedListItem(text, parsedChildren)];
        }
    });
}
function parseTableCell(node) {
    return node.children.flatMap(child => parseInline(child));
}
/**
 * Parse a table row, padding with empty cells if needed to match table width.
 * Fixes Issue #71: Tables with fewer cells in subsequent rows.
 */
function parseTableRow(node, expectedWidth) {
    const cells = node.children.map(child => parseTableCell(child));
    // Pad with empty cells if this row has fewer cells than the table width
    while (cells.length < expectedWidth) {
        cells.push([notion.richText('')]);
    }
    return notion.tableRow(cells);
}
function parseTable(node) {
    // The width of the table is the amount of cells in the first row, as all rows must have the same number of cells
    const tableWidth = node.children?.length
        ? node.children[0].children.length
        : 0;
    const tableRows = node.children.map(child => parseTableRow(child, tableWidth));
    return [notion.table(tableRows, tableWidth)];
}
function parseMath(node) {
    const textWithKatexNewlines = node.value.split('\n').join('\\\\\n');
    return notion.equation(textWithKatexNewlines);
}
function parseNode(node, options) {
    switch (node.type) {
        case 'heading':
            return [parseHeading(node)];
        case 'paragraph':
            return parseParagraph(node, options);
        case 'code':
            return [parseCode(node)];
        case 'blockquote':
            return [parseBlockquote(node, options)];
        case 'list':
            return parseList(node, options);
        case 'table':
            return parseTable(node);
        case 'math':
            return [parseMath(node)];
        case 'thematicBreak':
            return [notion.divider()];
        default:
            return [];
    }
}
/**
 * Split blocks that have rich_text arrays exceeding Notion's 100-item limit.
 * Fixes Issue #51: Notion rich_text[] max length is 100.
 */
function splitLargeRichTextArrays(blocks, limitCallback) {
    const MAX_RICH_TEXT = notion_1.LIMITS.RICH_TEXT_ARRAYS;
    return blocks.flatMap(block => {
        // Handle paragraph blocks
        if (block.type === 'paragraph' &&
            'paragraph' in block &&
            block.paragraph.rich_text.length > MAX_RICH_TEXT) {
            limitCallback(new Error(`Paragraph rich_text array exceeds Notion limit (${MAX_RICH_TEXT}), splitting into multiple blocks`));
            const chunks = [];
            for (let i = 0; i < block.paragraph.rich_text.length; i += MAX_RICH_TEXT) {
                chunks.push(notion.paragraph(block.paragraph.rich_text.slice(i, i + MAX_RICH_TEXT)));
            }
            return chunks;
        }
        return [block];
    });
}
function parseBlocks(root, options) {
    const parsed = root.children.flatMap(item => parseNode(item, options || {}));
    const truncate = !!(options?.notionLimits?.truncate ?? true), limitCallback = options?.notionLimits?.onError ?? (() => { });
    // Fix Issue #51: Split blocks with rich_text arrays exceeding 100 items
    const splitBlocks = splitLargeRichTextArrays(parsed, limitCallback);
    if (splitBlocks.length > notion_1.LIMITS.PAYLOAD_BLOCKS)
        limitCallback(new Error(`Resulting blocks array exceeds Notion limit (${notion_1.LIMITS.PAYLOAD_BLOCKS})`));
    return truncate ? splitBlocks.slice(0, notion_1.LIMITS.PAYLOAD_BLOCKS) : splitBlocks;
}
function parseRichText(root, options) {
    const richTexts = [];
    root.children.forEach(child => {
        if (child.type === 'paragraph')
            child.children.forEach(child => richTexts.push(...parseInline(child)));
        else if (options?.nonInline === 'throw')
            throw new Error(`Unsupported markdown element: ${JSON.stringify(child)}`);
    });
    const truncate = !!(options?.notionLimits?.truncate ?? true), limitCallback = options?.notionLimits?.onError ?? (() => { });
    if (richTexts.length > notion_1.LIMITS.RICH_TEXT_ARRAYS)
        limitCallback(new Error(`Resulting richTexts array exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT_ARRAYS})`));
    return (truncate ? richTexts.slice(0, notion_1.LIMITS.RICH_TEXT_ARRAYS) : richTexts).map(rt => {
        if (rt.type !== 'text')
            return rt;
        if (rt.text.content.length > notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT) {
            limitCallback(new Error(`Resulting text content exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT})`));
            if (truncate)
                rt.text.content =
                    rt.text.content.slice(0, notion_1.LIMITS.RICH_TEXT.TEXT_CONTENT - 3) + '...';
        }
        if (rt.text.link?.url &&
            rt.text.link.url.length > notion_1.LIMITS.RICH_TEXT.LINK_URL)
            // There's no point in truncating URLs
            limitCallback(new Error(`Resulting text URL exceeds Notion limit (${notion_1.LIMITS.RICH_TEXT.LINK_URL})`));
        // Notion equations are not supported by this library, since they don't exist in Markdown
        return rt;
    });
}
//# sourceMappingURL=internal.js.map