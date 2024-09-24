import { Block } from "@/app/schema";

export interface BlockProps<T extends Block> {
  block: T;
}
