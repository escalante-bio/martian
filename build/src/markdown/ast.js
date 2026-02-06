"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text = text;
exports.image = image;
exports.emphasis = emphasis;
exports.strong = strong;
exports.inlineCode = inlineCode;
exports.inlineMath = inlineMath;
exports.paragraph = paragraph;
exports.root = root;
exports.link = link;
exports.thematicBreak = thematicBreak;
exports.heading = heading;
exports.code = code;
exports.math = math;
exports.blockquote = blockquote;
exports.listItem = listItem;
exports.checkedListItem = checkedListItem;
exports.unorderedList = unorderedList;
exports.orderedList = orderedList;
exports.strikethrough = strikethrough;
exports.table = table;
exports.tableRow = tableRow;
exports.tableCell = tableCell;
function text(value) {
    return {
        type: 'text',
        value: value,
    };
}
function image(url, alt, title) {
    return {
        type: 'image',
        url: url,
        title: title,
    };
}
function emphasis(...children) {
    return {
        type: 'emphasis',
        children: children,
    };
}
function strong(...children) {
    return {
        type: 'strong',
        children: children,
    };
}
function inlineCode(value) {
    return {
        type: 'inlineCode',
        value: value,
    };
}
function inlineMath(value) {
    return {
        type: 'inlineMath',
        value,
    };
}
function paragraph(...children) {
    return {
        type: 'paragraph',
        children: children,
    };
}
function root(...children) {
    return {
        type: 'root',
        children: children,
    };
}
function link(url, ...children) {
    return {
        type: 'link',
        children: children,
        url: url,
    };
}
function thematicBreak() {
    return {
        type: 'thematicBreak',
    };
}
function heading(depth, ...children) {
    return {
        type: 'heading',
        depth: depth,
        children: children,
    };
}
function code(value, lang) {
    return {
        type: 'code',
        lang: lang,
        value: value,
    };
}
function math(value) {
    return {
        type: 'math',
        value,
    };
}
function blockquote(...children) {
    return {
        type: 'blockquote',
        children: children,
    };
}
function listItem(...children) {
    return {
        type: 'listitem',
        children: children,
    };
}
function checkedListItem(checked, ...children) {
    return {
        type: 'listitem',
        checked: checked,
        children: children,
    };
}
function unorderedList(...children) {
    return {
        type: 'list',
        children: children,
        ordered: false,
    };
}
function orderedList(...children) {
    return {
        type: 'list',
        children: children,
        start: 0,
        ordered: true,
    };
}
function strikethrough(...children) {
    return {
        type: 'delete',
        children: children,
    };
}
function table(...children) {
    return {
        type: 'table',
        children: children,
    };
}
function tableRow(...children) {
    return {
        type: 'tableRow',
        children: children,
    };
}
function tableCell(...children) {
    return {
        type: 'tableCell',
        children: children,
    };
}
//# sourceMappingURL=ast.js.map