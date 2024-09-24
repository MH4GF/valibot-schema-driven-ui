import type { FC, PropsWithChildren, ReactElement, ReactNode } from "react";
import type { Block, Button, Paragraph, Image, Division, BlockWithChildren } from "../schema";

interface BlockProps<T extends Block> {
  block: T;
}

const ButtonBlock: FC<BlockProps<Button>> = ({ block }) => (
  <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded">
    {block.text}
  </button>
);

const ParagraphBlock: FC<BlockProps<Paragraph>> = ({ block }) => (
  <p className="my-2">{block.text}</p>
);

const ImageBlock: FC<BlockProps<Image>> = ({ block }) => (
  <img src={block.src} alt={block.alt || ""} className="max-w-full h-auto" />
);

const DivisionBlock: FC<BlockProps<Division> & PropsWithChildren> = ({ children }) => (
  <div className="p-2 border">{children}</div>
);

interface Props {
  block: BlockWithChildren;
}

export const BlockRenderer: FC<Props> = ({ block }) => {
  switch (block.type) {
    case "button":
      return <ButtonBlock key={block.id} block={block} />;
    case "paragraph":
      return <ParagraphBlock key={block.id} block={block} />;
    case "image":
      return <ImageBlock key={block.id} block={block} />;
    case "division":
      return (
        <DivisionBlock key={block.id} block={block}>
          {block.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </DivisionBlock>
      );
    default:
      return null;
  }
};
