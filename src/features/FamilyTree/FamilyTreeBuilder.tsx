// src/features/family-tree/FamilyTreeBuilder.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"

import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import FamilyCardNode, { FamilyCardNodeData } from "./FamilyCardNode"
import { FamilyNode, FamilyTree, ThemeId } from "./type"
import { toast } from "react-toastify"
import { themes } from "./utils/themes"
import { exportToPDF } from "./utils/exportPdf"
import Sidebar from "@/pages/Notes/components/Sidebar"
import { useCreateFamilyTreeMutation, useGetFamilyTreeQuery, useUpdateFamilyTreeMutation } from "./familyTreeAPI"
import { loadLocal, saveLocal } from "./utils/localStorage"
import { autoRelation } from "./utils/relationship"

const nodeTypes: NodeTypes = {
  familyCard: FamilyCardNode as any,
}

// const themes: { id: ThemeId; label: string }[] = [
//   { id: "classic", label: "Classic" },
//   { id: "minimal", label: "Minimal" },
//   { id: "cinematic", label: "Cinematic" },
// ]

interface EditState {
  nodeId: string | null
  name: string
  photoUrl: string
  relationLabel: string
}

const defaultTreeName = "my-family-tree"

function createInitialTree(name: string): FamilyTree {
  const rootId = uuidv4()
  const now = new Date().toISOString()

  const rootNode: FamilyNode = {
    id: rootId,
    name: "You",
    photoUrl: "",
    relationLabel: "Root",
    parentIds: [],
    partnerIds: [],
    childIds: [],
  }

  return {
    name,
    nodes: [rootNode],
    rootId,
    themeId: "classic",
    createdAt: now,
    updatedAt: now,
  }
}

function treeToFlowNodes(tree: FamilyTree): Node<FamilyCardNodeData>[] {
  // Basic layout: stack vertically. User can drag to refine.
  return tree.nodes.map((n, index) => ({
    id: n.id,
    type: "familyCard",
    position: { x: index * 50, y: index * 80 }, // starting positions
    data: {} as any, // will be filled later in map
  }))
}

function treeToFlowEdges(tree: FamilyTree): Edge[] {
  const edges: Edge[] = []

  tree.nodes.forEach((node) => {
    // Parent-child edges
    node.childIds.forEach((childId) => {
      edges.push({
        id: `parent-${node.id}-${childId}`,
        source: node.id,
        target: childId,
        type: "smoothstep",
      })
    })

    // Partner edges
    node.partnerIds.forEach((partnerId) => {
      const id = `partner-${node.id}-${partnerId}`
      // avoid duplicates
      if (
        !edges.find(
          (e) => e.id === id || e.id === `partner-${partnerId}-${node.id}`,
        )
      ) {
        edges.push({
          id,
          source: node.id,
          target: partnerId,
          type: "straight",
          animated: true,
        })
      }
    })
  })

  return edges
}




// function treeToFlowEdges(tree: FamilyTree): Edge[] {
//   const edges: Edge[] = [];

//   tree.nodes.forEach((node) => {

//     // ---------------------
//     // PARENT → CHILD (vertical)
//     // ---------------------
//     node.childIds.forEach((childId) => {
//       edges.push({
//         id: `pc-${node.id}-${childId}`,
//         source: node.id,
//         target: childId,
//         sourceHandle: "child",
//         targetHandle: "parent",
//         type: "smoothstep",
//       });
//     });

//     // ---------------------
//     // PARTNERS (horizontal)
//     // ---------------------
//     node.partnerIds.forEach((partnerId) => {
//       const exists = edges.some(
//         (e) => e.id === `pt-${partnerId}-${node.id}`
//       );

//       if (!exists) {
//         edges.push({
//           id: `pt-${node.id}-${partnerId}`,
//           source: node.id,
//           target: partnerId,
//           sourceHandle: "partner-right",
//           targetHandle: "partner-left",
//           type: "straight",
//           animated: true,
//         });
//       }
//     });

//     // ---------------------
//     // SIBLINGS (horizontal)
//     // ---------------------
//     const siblings = tree.nodes.filter(
//       (s) =>
//         s.id !== node.id &&
//         s.parentIds.some((p) => node.parentIds.includes(p))
//     );

//     siblings.forEach((sib) => {
//       const exists = edges.some((e) => e.id === `sb-${sib.id}-${node.id}`);
//       if (!exists) {
//         edges.push({
//           id: `sb-${node.id}-${sib.id}`,
//           source: node.id,
//           target: sib.id,
//           sourceHandle: "sibling-right",
//           targetHandle: "sibling-left",
//           type: "straight",
//         });
//       }
//     });
//   });

//   return edges;
// }


export const FamilyTreeBuilder: React.FC = () => {
  const [treeName, setTreeName] = useState(defaultTreeName)
  const [tree, setTree] = useState<FamilyTree>(() =>
    createInitialTree(defaultTreeName),
  )

  const { data: sheetTree } = useGetFamilyTreeQuery(treeName, {
  skip: !treeName,
});

const [createTree] = useCreateFamilyTreeMutation();
const [updateTreeApi] = useUpdateFamilyTreeMutation();

async function handleSave() {
  try {
    const payload = { name: treeName, tree };
    const exists = sheetTree !== null;

    if (!exists) {
      await createTree(payload).unwrap();
      toast.success("Tree created in SheetDB");
    } else {
      await updateTreeApi(payload).unwrap();
      toast.success("Tree updated in SheetDB");
    }
  } catch (err) {
    toast.error("Failed to save to SheetDB");
  }
}



  const flowWrapperRef = useRef<HTMLDivElement | null>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<FamilyCardNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [editState, setEditState] = useState<EditState>({
    nodeId: null,
    name: "",
    photoUrl: "",
    relationLabel: "",
  })

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Sync ReactFlow nodes from tree (but keep positions when possible)
  useEffect(() => {
    setNodes((prevNodes) => {
      const byId = new Map(prevNodes.map((n) => [n.id, n]))
      return tree.nodes.map((n, index) => {
        const existing = byId.get(n.id)
        return {
          id: n.id,
          type: "familyCard",
          position: existing?.position ?? { x: index * 80, y: index * 80 },
          data: existing?.data ?? ({} as any),
        }
      })
    })

    setEdges(treeToFlowEdges(tree))
  }, [tree, setNodes, setEdges])

  // Attach handlers and node data
  const enhancedNodes = useMemo(
    () =>
      nodes.map<Node<FamilyCardNodeData>>((node) => {
        const fn = tree.nodes.find((n) => n.id === node.id)!
        return {
          ...node,
          data: {
            node: fn,
            onEdit: handleOpenEdit,
            onAddSibling: handleAddSibling,
            onAddPartner: handleAddPartner,
            onAddChild: handleAddChild,
            onAddParent: handleAddParent,
            onDelete: handleDelete
          },
        }
      }),
    [nodes, tree],
  )

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  function updateTree(fn: (prev: FamilyTree) => FamilyTree) {
    setTree((prev) => {
      const updated = fn(prev)
      saveLocal(updated);
      return {
        ...updated,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  function handleOpenEdit(nodeId: string) {
    const node = tree.nodes.find((n) => n.id === nodeId)
    if (!node) return
    setEditState({
      nodeId: node.id,
      name: node.name,
      photoUrl: node.photoUrl ?? "",
      relationLabel: node.relationLabel ?? "",
    })
    setIsEditOpen(true)
  }

  function handleEditSave() {
    if (!editState.nodeId) return
    updateTree((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === editState.nodeId
          ? {
              ...n,
              name: editState.name || "Unnamed",
              photoUrl: editState.photoUrl || undefined,
              relationLabel: editState.relationLabel || undefined,
            }
          : n,
      ),
    }))
    setIsEditOpen(false)
  }

  function createNode(partial?: Partial<FamilyNode>): FamilyNode {
    return {
      id: uuidv4(),
      name: "New Member",
      photoUrl: "",
      relationLabel: "",
      parentIds: [],
      partnerIds: [],
      childIds: [],
      ...partial,
    }
  }

  function handleAddSibling(nodeId: string) {
    updateTree((prev) => {
      const target = prev.nodes.find((n) => n.id === nodeId)
      if (!target) return prev
      const newNode = createNode({ relationLabel: "Sibling" })

      // share same parents
      newNode.parentIds = [...target.parentIds]

      // add this new node as child of those parents
      const updatedNodes = prev.nodes.map((n) =>
        target.parentIds.includes(n.id)
          ? { ...n, childIds: [...n.childIds, newNode.id] }
          : n,
      )

      return {
        ...prev,
        nodes: [...updatedNodes, newNode],
      }
    })
  }

  function handleAddPartner(nodeId: string) {
    updateTree((prev) => {
      const target = prev.nodes.find((n) => n.id === nodeId)
      if (!target) return prev
      const newNode = createNode({ relationLabel: "Partner" })

      target.partnerIds = [...target.partnerIds, newNode.id]
      newNode.partnerIds = [target.id]

      return {
        ...prev,
        nodes: [
          ...prev.nodes.map((n) => (n.id === target.id ? target : n)),
          newNode,
        ],
      }
    })
  }

  function handleAddChild(nodeId: string) {
    updateTree((prev) => {
      const parent = prev.nodes.find((n) => n.id === nodeId)
      if (!parent) return prev

      const newNode = createNode({
        relationLabel: "Child",
        parentIds: [parent.id],
      })
       newNode.relationLabel = autoRelation(newNode, prev.nodes);
      parent.childIds = [...parent.childIds, newNode.id]

      return {
        ...prev,
        nodes: [
          ...prev.nodes.map((n) => (n.id === parent.id ? parent : n)),
          newNode,
        ],
      }
    })
  }

  function handleAddParent(nodeId: string) {
    updateTree((prev) => {
      const child = prev.nodes.find((n) => n.id === nodeId)
      if (!child) return prev

      const newParent = createNode({
        relationLabel: "Parent",
        childIds: [child.id],
      })
      child.parentIds = [...child.parentIds, newParent.id]

      return {
        ...prev,
        nodes: [
          ...prev.nodes.map((n) => (n.id === child.id ? child : n)),
          newParent,
        ],
      }
    })
  }
  function handleDelete(nodeId: string) {
  updateTree((prev) => {
    let updatedNodes = prev.nodes.filter((n) => n.id !== nodeId);

    updatedNodes = updatedNodes.map((n) => ({
      ...n,
      parentIds: n.parentIds.filter((p) => p !== nodeId),
      childIds: n.childIds.filter((c) => c !== nodeId),
      partnerIds: n.partnerIds.filter((p) => p !== nodeId),
    }));

    return {
      ...prev,
      nodes: updatedNodes,
      rootId: prev.rootId === nodeId ? null : prev.rootId,
    };
  });
}

  // async function handleSave() {
  //   try {
  //     setIsSaving(true)
  //     const treeToSave: FamilyTree = { ...tree, name: treeName }
  //     // await saveTree(treeToSave);
  //     setTree(treeToSave)
  //     toast.success("Family tree saved to SheetDB")
  //   } catch (err: any) {
  //     console.error(err)
  //     toast.error(err?.message || "Failed to save")
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  async function handleLoad() {
    try {
      setIsLoading(true)
      // const loaded = await loadTreeByName(treeName);
      // if (!loaded) {
      //   toast.info("No tree found with this name, creating new one.");
      //   setTree(createInitialTree(treeName));
      // } else {
      //   setTree(loaded);
      // }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Failed to load")
    } finally {
      setIsLoading(false)
    }
  }

  function handleThemeChange(value: ThemeId) {
    updateTree((prev) => ({ ...prev, themeId: value }))
  }

  async function handleExportPng() {
    if (!flowWrapperRef.current) return
    try {
      // const dataUrl = await htmlToImage.toPng(flowWrapperRef.current, {
      //   cacheBust: true,
      //   pixelRatio: 2,
      // });
      // const link = document.createElement("a");
      // link.href = dataUrl;
      // link.download = `${tree.name || "family-tree"}.png`;
      // link.click();
    } catch (error) {
      console.error(error)
      toast.error("Failed to export image")
    }
  }
  async function handleExportPdf() {
    if (!flowWrapperRef.current) return
    await exportToPDF(flowWrapperRef.current, tree.name)
  }

  function handleReset() {
  const fresh = createInitialTree(treeName);

  setTree(fresh);       // update react state
  saveLocal(fresh);     // update localStorage
  setNodes(treeToFlowNodes(fresh)); // refresh nodes visually
  setEdges([]);         // clear all edges

  toast.success("Family tree reset. Fresh card created.");
}
  // Style tweaks based on theme
  const wrapperThemeClass = useMemo(() => {
    const themeObj = themes.find((t) => t.id === tree.themeId)
    return themeObj?.className || ""
  }, [tree.themeId])

  useEffect(() => {
  const local = loadLocal();
  if (local) setTree(local);
}, []);

useEffect(() => {
  if (sheetTree) setTree(sheetTree);
}, [sheetTree]);

  return (
    <div className="flex flex-col h-screen gap-2 p-3">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <div className="">
          <Sidebar />
        </div>
        <Input
          className="max-w-xs"
          placeholder="Family Tree Name"
          value={treeName}
          onChange={(e) => setTreeName(e.target.value)}
        />
        <Button variant="outline" onClick={handleLoad} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load"}
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !treeName.trim()}>
          {isSaving ? "Saving..." : "Save to SheetDB"}
        </Button>

        <Select value={tree.themeId} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleExportPng}>
          Export as PNG
        </Button>
        <Button variant="outline" onClick={handleExportPdf}>
          Export PDF
        </Button>
        <Button
  variant="destructive"
  onClick={handleReset}
>
  Reset Tree
</Button>
      </div>

      {/* Canvas */}
      <div
        ref={flowWrapperRef}
        className={`flex-1 rounded-lg border overflow-hidden ${wrapperThemeClass}`}
      >
        <ReactFlow
          fitView
          nodes={enhancedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          panOnScroll
          zoomOnScroll
          panOnDrag
          
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={editState.name}
                onChange={(e) =>
                  setEditState((s) => ({ ...s, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Photo URL</Label>
              <Input
                value={editState.photoUrl}
                onChange={(e) =>
                  setEditState((s) => ({ ...s, photoUrl: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Relation Label</Label>
              <Input
                placeholder="Father, Cousin, Nana ji..."
                value={editState.relationLabel}
                onChange={(e) =>
                  setEditState((s) => ({ ...s, relationLabel: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
