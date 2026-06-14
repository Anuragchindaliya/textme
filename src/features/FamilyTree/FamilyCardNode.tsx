// src/components/FamilyCardNode.tsx
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Plus, Trash, Users, UserPlus } from "lucide-react";
import { FamilyNode } from "./type";
import { theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export interface FamilyCardNodeData {
  node: FamilyNode;
  onEdit: (nodeId: string) => void;
  onAddSibling: (nodeId: string) => void;
  onAddPartner: (nodeId: string) => void;
  onAddChild: (nodeId: string) => void;
  onAddParent: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
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

  return (
    <>
      <Handle type="target" position={Position.Top} id="parent" className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900" />
      <Handle type="source" position={Position.Bottom} id="child" className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-900" />
      <Handle type="source" position={Position.Left} id="partner-left" className="!bg-purple-500 !w-2.5 !h-2.5 !border-2 !border-white dark:!border-slate-900" />
      <Handle type="source" position={Position.Right} id="partner-right" className="!bg-purple-500 !w-2.5 !h-2.5 !border-2 !border-white dark:!border-slate-900" />

      <Card className="w-60 shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-800">
              {node?.photoUrl && <AvatarImage src={node.photoUrl} alt={node.name} />}
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold">
                {getInitials(node?.name || "")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                {node?.name || "Unnamed"}
              </div>
              {node?.relationLabel && (
                <div className="inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/20 dark:border-indigo-800/20">
                  {node?.relationLabel}
                </div>
              )}
            </div>

            <div className="flex gap-0.5 self-start">
              {/* EDIT */}
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={() => data.onEdit(node.id)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>

              {/* DELETE */}
              {node?.relationLabel !== "Root" && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-400 hover:text-red-500"
                  onClick={() => data.onDelete(node.id)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-medium justify-start px-2 py-1 rounded-lg gap-1 border-slate-200 dark:border-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
              onClick={() => data.onAddSibling(node.id)}
            >
              <Users className="h-3 w-3 text-slate-500" /> Sibling
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-medium justify-start px-2 py-1 rounded-lg gap-1 border-slate-200 dark:border-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
              onClick={() => data.onAddPartner(node.id)}
            >
              <UserPlus className="h-3 w-3 text-slate-500" /> Partner
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-medium justify-start px-2 py-1 rounded-lg gap-1 border-slate-200 dark:border-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
              onClick={() => data.onAddChild(node.id)}
            >
              <Plus className="h-3 w-3 text-slate-500" /> Child
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] font-medium justify-start px-2 py-1 rounded-lg gap-1 border-slate-200 dark:border-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 transition-all"
              onClick={() => data.onAddParent(node.id)}
            >
              <Plus className="h-3 w-3 text-slate-500" /> Parent
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
});

export default FamilyCardNode;
