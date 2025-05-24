import "@xyflow/react/dist/style.css"
import Sidebar from "../Notes/components/Sidebar"
import DependencyGraphViewer from "./DependencyVisual"

const ReactFlowPage = () => {
  return (
    <div className="container mx-auto p-4 h-screen">
        <div className="flex">
          <div className="flex pr-2 absolute left-8">
            <Sidebar />
          </div>
          <DependencyGraphViewer />
        </div>
      {/* <ReactFlow>
          <Background />
          <Controls />
          </ReactFlow> */}
    </div>
  )
}

export default ReactFlowPage
