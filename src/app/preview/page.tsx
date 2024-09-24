import { parse } from "valibot";
import { buildHierarchy, pageSchema } from "../schema";
import { BlockRenderer } from "../_components/BlockRenderer";
import { notFound } from "next/navigation";

export default function Preview({ searchParams }: { searchParams: Record<string, string> }) {
  const data = searchParams.data;

  if (!data) {
    return notFound();
  }

  const page = parse(pageSchema, JSON.parse(decodeURIComponent(data)));
  return (
    <main className="p-4 min-h-screen bg-white text-black">
      {buildHierarchy(Object.values(page.blocks)).map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  );
}
