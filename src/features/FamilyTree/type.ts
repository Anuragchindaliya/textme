// src/types/familyTree.ts
export type NodeId = string;

export interface FamilyNode {
  id: NodeId;
  name: string;
  photoUrl?: string;
  relationLabel?: string; // e.g., "Father", "Cousin", "Nana ji"
  parentIds: NodeId[];
  partnerIds: NodeId[];
  childIds: NodeId[];
  position?: { x: number; y: number };   
}

export type ThemeId = "classic" | "minimal" | "cinematic";

export interface FamilyTree {
  name: string;        // unique key
  nodes: FamilyNode[];
  rootId: NodeId | null;
  themeId: ThemeId;
  createdAt: string;
  updatedAt: string;
}
