// src/components/FamilyCardNode.tsx
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Plus, Trash, Users } from "lucide-react";
import { FamilyNode } from "./type";
import { getRelationIcon } from "./utils/icons";

export interface FamilyCardNodeData {
  node: FamilyNode;
  onEdit: (nodeId: string) => void;
  onAddSibling: (nodeId: string) => void;
  onAddPartner: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
  onAddParent: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;   // 🆕 ADD THIS
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const FamilyCardNode = memo((props: NodeProps<FamilyCardNodeData>) => {
  const { data } = props;
  const { node } = data;
  // const Icon = getRelationIcon(node?.relationLabel || "");

  return (
    <>
      {/* Connection handles */}
      {/* <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} /> */}
      {/* Parent comes from TOP */}
      <Handle type="target" position={Position.Top} id="parent" />

      {/* Child goes DOWN */}
      <Handle type="source" position={Position.Bottom} id="child" />

      {/* Partner Left/Right */}
      <Handle type="source" position={Position.Left} id="partner-left" />
      <Handle type="source" position={Position.Right} id="partner-right" />

      {/* Sibling Left/Right */}
      <Handle type="source" position={Position.Left} id="sibling-left" />
      <Handle type="source" position={Position.Right} id="sibling-right" />

      <Card className="w-56 shadow-md border border-border bg-background/90 backdrop-blur-sm">
        <CardContent className="p-3 flex flex-col gap-2">

          <div className="flex items-center gap-3">

            <Avatar>
              {node?.photoUrl && <AvatarImage src={node.photoUrl} alt={node.name} />}
              <AvatarFallback>{getInitials(node?.name || "")}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{node?.name || "Unnamed"}</div>

              {node?.relationLabel && (
                <div className="text-xs text-muted-foreground truncate">
                  {node?.relationLabel}
                </div>
              )}
            </div>

            {/* EDIT */}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => data.onEdit(node.id)}
            >
              <Pencil className="h-3 w-3" />
            </Button>

            {/* DELETE */}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-500"
              onClick={() => data.onDelete(node.id)}
            >
              <Trash className="h-3 w-3" />
            </Button>

          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            <Button size="sm" variant="outline" onClick={() => data.onAddSibling(node.id)}>
              <Users className="h-3 w-3 mr-1" /> Sibling
            </Button>

            <Button size="sm" variant="outline" onClick={() => data.onAddPartner(node.id)}>
              <Plus className="h-3 w-3 mr-1" /> Partner
            </Button>

            <Button size="sm" variant="outline" onClick={() => data.onAddChild(node.id)}>
              <Plus className="h-3 w-3 mr-1" /> Child
            </Button>

            <Button size="sm" variant="outline" onClick={() => data.onAddParent(node.id)}>
              <Plus className="h-3 w-3 mr-1" /> Parent
            </Button>
          </div>

        </CardContent>
      </Card>
    </>
  );
});

export default FamilyCardNode;
