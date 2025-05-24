import { BackgroundVariant } from "@xyflow/react"
import React, { useCallback, useState } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState
} from "reactflow"
import "reactflow/dist/style.css"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { syntaxStyleName, themeOptionsConfig } from "./stylesthemeCode"
interface PackageInfo {
  version: string
  requires?: Record<string, string>
}

interface PackageLockJson {
  name: string
  dependencies: Record<string, string>
}
interface PackageJson {
  name: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function parsePackageJson(json: PackageJson): {
  nodes: Node[]
  edges: Edge[]
  stats: any
} {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const seen = new Set<string>()
  let yOffset = 0
  let directCount = 0
  let devCount = 0

  const addNode = (name: string, version: string, isDev: boolean) => {
    const id = `${name}@${version}`
    if (!seen.has(id)) {
      seen.add(id)
      nodes.push({
        id,
        data: {
          label: `${name}\n${version}`,
          tooltip: `Type: ${isDev ? "devDependency" : "dependency"}`,
        },
        position: { x: 100, y: yOffset },
      })
      yOffset += 80
      isDev ? devCount++ : directCount++
    }
  }

  if (json.dependencies) {
    for (const [name, version] of Object.entries(json.dependencies)) {
      addNode(name, version, false)
    }
  }

  if (json.devDependencies) {
    for (const [name, version] of Object.entries(json.devDependencies)) {
      addNode(name, version, true)
    }
  }

  const stats = {
    dependencies: directCount,
    devDependencies: devCount,
  }

  return { nodes, edges, stats }
}

function parsePackageLockJson(json: PackageLockJson): {
  nodes: Node[]
  edges: Edge[]
} {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const seen = new Set<string>()
  let yOffset = 0

  function addNode(name: string, version: string) {
    const id = `${name}@${version}`
    if (!seen.has(id)) {
      seen.add(id)
      nodes.push({
        id,
        data: { label: `${name}\n${version}` },
        position: { x: 100, y: yOffset },
      })
      yOffset += 80
    }
  }

  function traverse(name: string, version: string) {
    const id = `${name}@${version}`
    addNode(name, version)

    // if (info.requires) {
    //   for (const depName of Object.keys(info.requires)) {
    //     const depInfo = json.dependencies[depName];
    //     if (depInfo) {
    //       const depId = `${depName}@${depInfo.version}`;
    //       addNode(depName, depInfo.version);
    //       edges.push({ id: `e-${id}-${depId}`, source: id, target: depId });
    //       traverse(depName, depInfo);
    //     }
    //   }
    // }
  }

  for (const [name, version] of Object.entries(json.dependencies)) {
    traverse(name, version)
  }

  return { nodes, edges }
}

export default function DependencyGraphViewer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [jsonContent, setJsonContent] = useState<string>("")
  const [selectedTheme, setSelectedTheme] = useState<any>(themeOptionsConfig[syntaxStyleName[0]]);
  const [codeStyle, setCodeStyle] = useState<string>(syntaxStyleName[0]);
  const onThemeChange = useCallback(
    async (value: string) => {
      setCodeStyle(value)
      setSelectedTheme(themeOptionsConfig[value]);
    },
    [setSelectedTheme, setCodeStyle],
  )
  const onFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const json = JSON.parse(content) as PackageLockJson
          const { nodes: parsedNodes, edges: parsedEdges } =
            parsePackageJson(json)
          setNodes(parsedNodes)
          setEdges(parsedEdges)
          setJsonContent(JSON.stringify(json, null, 2))
        } catch (error) {
          alert("Invalid JSON file")
        }
      }
      reader.readAsText(file)
    },
    [setNodes, setEdges],
  )
  

  return (
    <div className="w-screen h-[calc(100vh-3rem)] flex">
      <ResizablePanelGroup direction="horizontal" className="flex  h-full ">
        <ResizablePanel
          id="qrCanvas"
          className="flex-[3]  h-full relative"
          minSize={25}
          defaultSize={50}
        >
          <div className=" h-full  p-4 bg-gray-100">
            <div className="flex">
              <Input
                type="file"
                accept=".json"
                onChange={onFileUpload}
                className="mb-4 bg-white flex-[2]"
              />
              <div className="flex-1 ml-2">
                <Select onValueChange={onThemeChange} defaultValue={codeStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] overflow-auto">
                    {syntaxStyleName.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-auto h-[95%] pb-4">
              {/* <pre className="bg-white p-2 rounded text-sm whitespace-pre-wrap ">
          {jsonContent || 'Upload a package-lock.json file to see content here...'}
        </pre> */}
              <SyntaxHighlighter
                language="javascript"
                style={selectedTheme}
                showLineNumbers
              >
                {jsonContent ||
                  "Upload a package.json file to see content here..."}
              </SyntaxHighlighter>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          // iconClass="bg-gray-300"
          className="dark:bg-gray-800"
        />
        <ResizablePanel
          minSize={45}
          defaultSize={50}
          id="qrOptions"
          className="relative"
        >
          <div className=" h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              // onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
                  proOptions={{hideAttribution:true}}
            >
              <MiniMap />
              <Controls />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            </ReactFlow>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
