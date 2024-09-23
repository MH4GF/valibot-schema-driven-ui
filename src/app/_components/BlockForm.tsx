import type { ChangeEvent, FC } from "react";
import type { Block } from "../schema";

interface Props {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

export const BlockForm: FC<Props> = ({ block, onUpdate, onDelete }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Edit {block.type}</h3>
      {block.type === "button" && (
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
      <button type="button" onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded">
        Delete Block
      </button>
    </div>
  );
};
