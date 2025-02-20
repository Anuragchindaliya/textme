import React, { useState, useEffect } from "react"
import { FormBuilder, Form, FormBuilderProps } from "@formio/react"
import { v4 as uuidv4 } from "uuid"
import { useParams, useNavigate } from "react-router-dom"
import ReactJson from "@microlink/react-json-view"
import DrawInput from "../Draw/components/DrawInput"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type FormData = {
  id: string
  form_json: string
}

type SubmissionData = {
  form_id: string
  submission_data: string
}

const SHEETDB_API = "https://sheetdb.io/api/v1/YOUR_SHEETDB_ID" // Replace with your SheetDB API URL

export const FormBuilderPage: React.FC = () => {
  const [formJson, setFormJson] = useState<any>({})
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()

  const saveForm = async () => {
    const formId = uuidv4()
    const formEntry: FormData = {
      id: formId,
      form_json: JSON.stringify(formJson),
    }

    await fetch(`${SHEETDB_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [formEntry] }),
    })

    navigate(`/form/${formId}`)
  }
  useEffect(() => {
    const bootstrapLink = document.createElement("link")
    bootstrapLink.rel = "stylesheet"
    bootstrapLink.href =
      "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"

    const formioLink = document.createElement("link")
    formioLink.rel = "stylesheet"
    formioLink.href =
      "https://cdn.jsdelivr.net/npm/@formio/js/dist/formio.full.min.css"

    document.head.appendChild(bootstrapLink)
    document.head.appendChild(formioLink)

    return () => {
      document.head.removeChild(bootstrapLink)
      document.head.removeChild(formioLink)
    }
  }, [])

  return (
    <div className=" md:px-8">
      <div className="  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
          <Sidebar />
          <DrawInput />
        </div>
      </div>
      <Dialog
        open={!!showPreview}
        onOpenChange={() => {
          setShowPreview(false)
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="mb-2">Form Preview</DialogTitle>
            <Form src={""} form={formJson} onSubmit={()=>setShowPreview(false)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className=" ">
        <ResizablePanelGroup direction="horizontal" className="flex gap-2">
          <ResizablePanel className="flex-[3]" minSize={65}>
            <div className="text-white flex justify-between mb-2">
              <h2 className="text-gray-800 text-xl">Create a Form</h2>
              <Button
                className="text-white"
                onClick={() => {
                  setShowPreview(true)
                }}
              >
                Preview Form
              </Button>
            </div>
            <FormBuilder
              // form={formJson}
              onChange={setFormJson}
            />
            <Button className="ml-auto text-white" onClick={saveForm}>
              Save Form
            </Button>
          </ResizablePanel>
          <ResizableHandle withHandle iconClass="bg-white" />

          <ResizablePanel
            minSize={15}
            className="flex-1  flex flex-col bg-slate-50"
          >
            <h2 className="text-black text-lg border-b border-gray-300 px-2">
              As JSON Schema
            </h2>
            <div className=" flex-1 p-2 rounded">
              <ReactJson
                src={formJson}
                name={null}
                collapsed={true}
              ></ReactJson>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [formJson, setFormJson] = useState<any>(null)

  useEffect(() => {
    fetch(`${SHEETDB_API}/search?id=${id}`)
      .then((res) => res.json())
      .then((data: FormData[]) => setFormJson(JSON.parse(data[0]?.form_json)))
  }, [id])

  const handleSubmit = async (submission: any) => {
    const submissionEntry: SubmissionData = {
      form_id: id!,
      submission_data: JSON.stringify(submission),
    }

    await fetch(`${SHEETDB_API}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [submissionEntry] }),
    })
    alert("Form submitted successfully!")
  }

  return formJson ? (
    <Form src={""} form={formJson} onSubmit={handleSubmit} />
  ) : (
    <p>Loading...</p>
  )
}

// Router Setup
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Sidebar from "../Notes/components/Sidebar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<FormBuilderPage />} />
      <Route path="/form/:id" element={<FormPage />} />
    </Routes>
  </Router>
)

export default App
