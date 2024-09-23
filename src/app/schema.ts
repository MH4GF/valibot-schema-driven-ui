import { type InferOutput, object, string, optional, literal, union, intersect, record } from 'valibot';

// ブロックの共通情報を持つスキーマ
const baseBlockSchema = object({
  id: string(),
});

const buttonBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal('button'),
    text: string(),
  }),
]);

const paragraphBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal('paragraph'),
    text: string(),
  }),
]);

const imageBlockSchema = intersect([
  baseBlockSchema,
  object({
    type: literal('image'),
    src: string(),
    alt: optional(string()),
  }),
]);

// 全ブロックタイプのユニオン
export const blockSchema = union([buttonBlockSchema, paragraphBlockSchema, imageBlockSchema]);

// ページレイアウトのスキーマ
export const pageSchema = object({
  name: string(),
  blocks: record(string(), blockSchema), // IDによる全ブロックのマップ
});

// Valibotスキーマから型を推論
export type Page = InferOutput<typeof pageSchema>;
export type Block = InferOutput<typeof blockSchema>;
export type BlockType = Block['type'];
export type Button = InferOutput<typeof buttonBlockSchema>;
export type Paragraph = InferOutput<typeof paragraphBlockSchema>;
export type Image = InferOutput<typeof imageBlockSchema>;

const newButton = (id: string): Button => ({
  id,
  type: 'button',
  text: 'Click me',
})

const newParagraph = (id: string): Paragraph => ({
  id,
  type: 'paragraph',
  text: 'Paragraph text',
})

const newImage = (id: string): Image => ({
  id,
  type: 'image',
  src: 'https://via.placeholder.com/150',
  alt: '',
})

export const newBlock = (type: BlockType, id: string): Block => {
  switch (type) {
    case 'button':
      return newButton(id);
    case 'paragraph':
      return newParagraph(id);
    case 'image':
      return newImage(id);
  }
}