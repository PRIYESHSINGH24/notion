import { PartialBlock } from '@blocknote/core';

export interface Page {
  id: string;
  title: string;
  icon: string;
  coverImage?: string;
  parentId: string | null;
  blocks: PartialBlock[];
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  isTrash?: boolean;
}
