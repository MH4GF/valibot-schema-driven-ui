"use client";

import { useState, useEffect, useMemo, type FC } from "react";
import { nanoid } from "nanoid";
import { parse } from "valibot";
import {
  type Page,
  type Block,
  type BlockType,
  pageSchema,
  blockSchema,
  newBlock,
} from "../schema";
import { BlockForm } from "../_components/BlockForm";
import { BlockRenderer } from "../_components/BlockRenderer";
import { Eye, Image, Plus, Type } from "lucide-react";
import Link from "next/link";

export default function Editor({ searchParams }: { searchParams: Record<string, string> }) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [page, setPage] = useState<Page>(() => {
    const savedData = searchParams.data;
    if (savedData) {
      return parse(pageSchema, JSON.parse(decodeURIComponent(savedData)));
    }
    return { name: "New Page", blocks: {} };
  });
  const queryData = useMemo(() => encodeURIComponent(JSON.stringify(page)), [page]);

  useEffect(() => {
    window.history.replaceState({}, "", `?data=${queryData}`);
  }, [queryData]);

  const addBlock = (type: BlockType) => {
    const id = nanoid();
    setPage((prevPage) => ({
      ...prevPage,
      blocks: {
        ...prevPage.blocks,
        [id]: newBlock(type, id),
      },
    }));
    setSelectedBlockId(id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setPage((prevPage) => ({
      ...prevPage,
      blocks: {
        ...prevPage.blocks,
        [id]: parse(blockSchema, { ...prevPage.blocks[id], ...updates }),
      },
    }));
  };

  const deleteBlock = (id: string) => {
    setPage((prevPage) => {
      const { [id]: _, ...remainingBlocks } = prevPage.blocks;
      return { ...prevPage, blocks: remainingBlocks };
    });
    setSelectedBlockId(null);
  };

  return (
    <>
      <header className="flex justify-between items-center px-4 border-b border-gray-700 sticky top-0 bg-gray-800 h-16">
        <h1 className="text-2xl font-bold">No-Code UI Builder</h1>
        <Link
          href={`/preview?data=${queryData}`}
          className="bg-gray-700 hover:bg-gray-600 border rounded-md inline-flex py-2 px-4 items-center"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Link>
      </header>
      <main className="flex overflow-hidden">
        <div className="w-1/4 border-r border-gray-700">
          <div className="space-y-2 p-4 border-b border-gray-700">
            {(
              [
                ["button", Plus],
                ["paragraph", Type],
                ["image", Image],
              ] as const
            ).map(([type, Icon]) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="w-full px-4 py-2 text-white rounded bg-gray-700 hover:bg-gray-600 flex items-center"
              >
                <Icon className="mr-2 h-4 w-4" />
                Add {type}
              </button>
            ))}
          </div>
          {selectedBlockId && (
            <div className="p-4">
              <BlockForm
                block={page.blocks[selectedBlockId]}
                onUpdate={(updates) => updateBlock(selectedBlockId, updates)}
                onDelete={() => deleteBlock(selectedBlockId)}
              />
            </div>
          )}
        </div>
        <div className="w-3/4 h-[calc(100vh-64px)] p-4">
          <div className="bg-white p-4 h-full text-black overflow-y-scroll">
            {Object.values(page.blocks).map((block) => (
              <div onClick={() => onSelectBlock?.(block.id)} key={block.id}>
                <BlockRenderer block={block} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
