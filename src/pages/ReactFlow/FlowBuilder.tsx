import React, { useEffect, useRef, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  MarkerType,
  ReactFlowInstance,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { debounce } from "@/lib/debounce"

const nodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(["input", "dropdown", "text"]),
})

type NodeForm = z.infer<typeof nodeSchema>

const LOCAL_STORAGE_KEY = "formflow_nodes"
const LOCAL_STORAGE_EDGES_KEY = "formflow_edges"

const initialNodes: Node[] = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
)
const initialEdges: Edge[] = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_EDGES_KEY) || "[]",
)

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const reactFlowWrapper = useRef(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NodeForm>({
    resolver: zodResolver(nodeSchema),
  })

  const onConnect = (params: Edge | Connection) =>
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
        eds,
      ),
    )

  const onSubmit = (data: NodeForm) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${data.label} (${data.type})`, type: data.type },
      type: "default",
    }
    setNodes((nds) => [...nds, newNode])
    reset()
  }

  const exportToJSON = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flow.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (json.nodes && json.edges) {
          setNodes(json.nodes)
          setEdges(json.edges)
        }
      } catch (err) {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }

  const saveToLocalStorage = debounce((nodes: Node[], edges: Edge[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nodes))
    localStorage.setItem(LOCAL_STORAGE_EDGES_KEY, JSON.stringify(edges))
  }, 500)

  useEffect(() => {
    saveToLocalStorage(nodes, edges)
  }, [nodes, edges])

  const syncToSheetDB = async () => {
    const res = await fetch("https://sheetdb.io/api/v1/YOUR_SHEETDB_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [{ nodes: JSON.stringify(nodes), edges: JSON.stringify(edges) }],
      }),
    })
    if (res.ok) alert("Synced to SheetDB successfully")
    else alert("Failed to sync")
  }

  const handleNodeClick = (_event: any, node: Node) => {
    setSelectedNodeId(node.id)
  }

  const updateSelectedNodeLabel = (label: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n,
      ),
    )
  }

  const exportToImage = async () => {
    if (!reactFlowWrapper.current) return
    const canvas = await html2canvas(reactFlowWrapper.current as HTMLElement)
    const link = document.createElement("a")
    link.download = "flowchart.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const exportToPDF = async () => {
    if (!reactFlowWrapper.current) return
    const canvas = await html2canvas(reactFlowWrapper.current as HTMLElement)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF()
    pdf.addImage(imgData, "PNG", 10, 10, canvas.width / 4, canvas.height / 4)
    pdf.save("flowchart.pdf")
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <div className="w-full md:w-1/4 p-4 border-r space-y-4 overflow-auto">
        <h2 className="text-xl font-semibold">Add Node</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <input
            {...register("label")}
            className="border p-2 rounded w-full"
            placeholder="Node Label"
          />
          <select {...register("type")} className="border p-2 rounded w-full">
            <option value="">Select Type</option>
            <option value="input">Input</option>
            <option value="dropdown">Dropdown</option>
            <option value="text">Text</option>
          </select>
          {errors.label && (
            <p className="text-red-500 text-sm">{errors.label.message}</p>
          )}
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
          <Button type="submit" className="w-full">
            Add Node
          </Button>
        </form>

        {selectedNodeId && (
          <div className="space-y-2">
            <h3 className="font-semibold">Edit Selected Node</h3>
            <input
              className="border p-2 rounded w-full"
              onChange={(e) => updateSelectedNodeLabel(e.target.value)}
              value={
                nodes.find((n) => n.id === selectedNodeId)?.data.label || ""
              }
            />
          </div>
        )}

        <Button onClick={exportToJSON} className="w-full">
          Export to JSON
        </Button>
        <input
          type="file"
          accept=".json"
          onChange={importFromJSON}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          Import from JSON
        </Button>
        <Button
          onClick={syncToSheetDB}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Sync to SheetDB
        </Button>
        <Button onClick={exportToImage} className="w-full">
          Export as Image
        </Button>
        <Button onClick={exportToPDF} className="w-full">
          Export as PDF
        </Button>
        <Button onClick={() => setPreviewMode(!previewMode)} className="w-full">
          {previewMode ? "Edit Mode" : "Preview Form"}
        </Button>
      </div>

      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        {!previewMode ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="p-10 space-y-4">
            {nodes.map((node) => (
              <div key={node.id} className="border p-4 rounded">
                <label className="block font-semibold mb-1">
                  {node.data.label}
                </label>
                {node.data.type === "input" && (
                  <input
                    className="border p-2 w-full rounded"
                    placeholder="Type here..."
                  />
                )}
                {node.data.type === "dropdown" && (
                  <select className="border p-2 w-full rounded">
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                )}
                {node.data.type === "text" && (
                  <textarea className="border p-2 w-full rounded" rows={3} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
