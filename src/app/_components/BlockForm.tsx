import type { ChangeEvent, FC } from "react";
import type { Block } from "../schema";

interface Props {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const BlockForm: FC<Props> = ({ block, onUpdate, onDelete }) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // styles 内のプロパティを更新する場合
    if (name.startsWith("styles.")) {
      const styleProp = name.split(".")[1];
      onUpdate({ styles: { ...block.styles, [styleProp]: value } });
    } else {
      // その他のプロパティを更新する場合
      onUpdate({ [name]: value });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Edit {block.type}</h3>
      {block.type === "button" && (
        <>
          <div>
            <label htmlFor="text">Button text</label>
            <input
              type="text"
              name="text"
              value={block.text}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-black"
              placeholder="Button text"
            />
          </div>
          <div>
            <label htmlFor="onClick">onClick JavaScript</label>
            <textarea
              name="onClick"
              value={block.onClick || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-black"
              placeholder="JavaScript code"
            />
          </div>
        </>
      )}
      {block.type === "paragraph" && (
        <div>
          <label htmlFor="text">Paragraph text</label>
          <textarea
            name="text"
            value={block.text}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-black"
            placeholder="Paragraph text"
          />
        </div>
      )}
      {block.type === "image" && (
        <>
          <div>
            <label htmlFor="src">Image URL</label>
            <input
              type="text"
              name="src"
              value={block.src}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-black"
              placeholder="Image URL"
            />
          </div>
          <div>
            <label htmlFor="alt">Alt text</label>
            <input
              type="text"
              name="alt"
              value={block.alt || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded text-black"
              placeholder="Alt text"
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="color">Text Color</label>
        <input
          type="text"
          name="styles.color"
          value={block.styles?.color || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded text-black"
          placeholder="e.g., #000000"
        />
      </div>
      <div>
        <label htmlFor="backgroundColor">Background Color</label>
        <input
          type="text"
          name="styles.backgroundColor"
          value={block.styles?.backgroundColor || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded text-black"
          placeholder="e.g., #ffffff"
        />
      </div>
      <div>
        <label htmlFor="fontSize">Font Size</label>
        <input
          type="text"
          name="styles.fontSize"
          value={block.styles?.fontSize || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded text-black"
          placeholder="e.g., 16px"
        />
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete Block
      </button>
    </div>
  );
};
