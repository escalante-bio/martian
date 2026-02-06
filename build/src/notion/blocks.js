"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divider = divider;
exports.paragraph = paragraph;
exports.code = code;
exports.blockquote = blockquote;
exports.image = image;
exports.table_of_contents = table_of_contents;
exports.headingOne = headingOne;
exports.headingTwo = headingTwo;
exports.headingThree = headingThree;
exports.bulletedListItem = bulletedListItem;
exports.numberedListItem = numberedListItem;
exports.toDo = toDo;
exports.table = table;
exports.tableRow = tableRow;
exports.equation = equation;
exports.callout = callout;
const common_1 = require("./common");
function divider() {
    return {
        object: 'block',
        type: 'divider',
        divider: {},
    };
}
function paragraph(text) {
    return {
        object: 'block',
        type: 'paragraph',
        paragraph: {
            rich_text: text,
        },
    };
}
function code(text, lang = 'plain text') {
    return {
        object: 'block',
        type: 'code',
        code: {
            rich_text: text,
            language: lang,
        },
    };
}
function blockquote(text = [], children = []) {
    return {
        object: 'block',
        type: 'quote',
        quote: {
            // By setting an empty rich text we prevent the "Empty quote" line from showing up at all
            rich_text: text.length ? text : [(0, common_1.richText)('')],
            // @ts-expect-error Typings are not perfect
            children,
        },
    };
}
function image(url) {
    return {
        object: 'block',
        type: 'image',
        image: {
            type: 'external',
            external: {
                url: url,
            },
        },
    };
}
function table_of_contents() {
    return {
        object: 'block',
        type: 'table_of_contents',
        table_of_contents: {},
    };
}
function headingOne(text) {
    return {
        object: 'block',
        type: 'heading_1',
        heading_1: {
            rich_text: text,
        },
    };
}
function headingTwo(text) {
    return {
        object: 'block',
        type: 'heading_2',
        heading_2: {
            rich_text: text,
        },
    };
}
function headingThree(text) {
    return {
        object: 'block',
        type: 'heading_3',
        heading_3: {
            rich_text: text,
        },
    };
}
function bulletedListItem(text, children = []) {
    return {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
            rich_text: text,
            children: children.length ? children : undefined,
        },
    };
}
function numberedListItem(text, children = []) {
    return {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
            rich_text: text,
            children: children.length ? children : undefined,
        },
    };
}
function toDo(checked, text, children = []) {
    return {
        object: 'block',
        type: 'to_do',
        to_do: {
            rich_text: text,
            checked: checked,
            children: children.length ? children : undefined,
        },
    };
}
function table(children, tableWidth) {
    return {
        object: 'block',
        type: 'table',
        table: {
            table_width: tableWidth,
            has_column_header: true,
            children: children?.length ? children : [],
        },
    };
}
function tableRow(cells = []) {
    return {
        object: 'block',
        type: 'table_row',
        table_row: {
            cells: cells.length ? cells : [],
        },
    };
}
function equation(value) {
    return {
        type: 'equation',
        equation: {
            expression: value,
        },
    };
}
function callout(text = [], emoji = '👍', color = 'default', children = []) {
    return {
        object: 'block',
        type: 'callout',
        callout: {
            rich_text: text.length ? text : [(0, common_1.richText)('')],
            icon: {
                type: 'emoji',
                emoji,
            },
            // @ts-expect-error See https://github.com/makenotion/notion-sdk-js/issues/575
            children,
            color,
        },
    };
}
//# sourceMappingURL=blocks.js.map