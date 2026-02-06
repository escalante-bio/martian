import { supportedCodeLang, TableRowBlock } from './common';
import { AppendBlockChildrenParameters } from '@notionhq/client/build/src/api-endpoints';
export type Block = AppendBlockChildrenParameters['children'][number];
export type BlockWithoutChildren = Exclude<(Block & {
    type: 'paragraph';
})['paragraph']['children'], undefined>[number];
export type RichText = (Block & {
    type: 'paragraph';
})['paragraph']['rich_text'][number];
export type EmojiRequest = ((Block & {
    object: 'block';
    type: 'callout';
})['callout']['icon'] & {
    type: 'emoji';
})['emoji'];
export type ApiColor = Exclude<(Block & {
    object: 'block';
    type: 'callout';
})['callout']['color'], undefined>;
export declare function divider(): Block;
export declare function paragraph(text: RichText[]): Block;
export declare function code(text: RichText[], lang?: supportedCodeLang): Block;
export declare function blockquote(text?: RichText[], children?: Block[]): Block;
export declare function image(url: string): Block;
export declare function table_of_contents(): Block;
export declare function headingOne(text: RichText[]): Block;
export declare function headingTwo(text: RichText[]): Block;
export declare function headingThree(text: RichText[]): Block;
export declare function bulletedListItem(text: RichText[], children?: BlockWithoutChildren[]): Block;
export declare function numberedListItem(text: RichText[], children?: BlockWithoutChildren[]): Block;
export declare function toDo(checked: boolean, text: RichText[], children?: BlockWithoutChildren[]): Block;
export declare function table(children: TableRowBlock[], tableWidth: number): Block;
export declare function tableRow(cells?: RichText[][]): TableRowBlock;
export declare function equation(value: string): Block;
export declare function callout(text?: RichText[], emoji?: EmojiRequest, color?: ApiColor, children?: Block[]): Block;
