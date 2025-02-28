import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormBuilder, FormBuilderProps, FormType } from "@formio/react"
import ReactJson from "@microlink/react-json-view"
import React, { FormEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { FormBuilder as FormioFormBuilder } from "@formio/js"
// Router Setup
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAddFormJsonMutation } from "@/features/dynamicForm/dynamicFormAPI"
import { Eye, Loader, Plus } from "lucide-react"
import { AiOutlineClear } from "react-icons/ai"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { toast } from "react-toastify"
import Sidebar from "../Notes/components/Sidebar"
import { Input } from "@/components/ui/input"
import { CopyButton } from "../Notes/components/CopyButton"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SuccessIcon from "@/components/ui/successIcon"
import SuccessAnimation from "@/components/ui/successAnimation"

type FormData = {
  key: string
  formname: string
  formjson: string
}

type SubmissionData = {
  form_id: string
  submission_data: string
}

const SHEETDB_API = "https://sheetdb.io/api/v1/YOUR_SHEETDB_ID" // Replace with your SheetDB API URL
const FORM_STORAGE_KEY = "savedFormJson"
const minimizeFormJson = (obj: any): any => {
  if (Array.isArray(obj)) {
    const filteredArray = obj
      .map(minimizeFormJson)
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          !(Array.isArray(item) && item.length === 0) &&
          !(typeof item === "object" && Object.keys(item).length === 0),
      )
    return filteredArray.length > 0 ? filteredArray : undefined
  } else if (typeof obj === "object" && obj !== null) {
    const filteredObject = Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, minimizeFormJson(value)])
        .filter(
          ([_, value]) =>
            Boolean(value) &&
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === "object" && Object.keys(value).length === 0),
        ),
    )
    return Object.keys(filteredObject).length > 0 ? filteredObject : undefined
  }
  return obj
}
// const initialFormJson: FormType = { display: "form", components: [] }
const formSubmissionSchema = z.object({
  formname: z
    .string()
    .nonempty("Enter Form Name")
    .regex(/^[A-Za-z0-9\s]+$/, {
      message: "Only letters and spaces are allowed",
    }),
})
type formSubmissionType = z.infer<typeof formSubmissionSchema>
export const FormBuilderPage: React.FC = () => {
  const [addFormJson, { isLoading: addingForm, isSuccess }] =
    useAddFormJsonMutation()
  const formBuilderRef = useRef<FormioFormBuilder>()
  const [showPreview, setShowPreview] = useState(false)
  const [showClearWarning, setShowClearWarning] = useState(false)
  const [formKey, setFormKey] = useState<string>(uuidv4()) // Unique key for re-render
  const [formJson, setFormJson] = useState<FormType>((): any => {
    try {
      const formJsonString = localStorage.getItem(FORM_STORAGE_KEY) || ""
      const localFormJson = JSON.parse(formJsonString)
      console.log({ localFormJson })
      if (localFormJson) {
        setFormKey(uuidv4())
        return localFormJson
      }
    } catch (error) {
      return {}
    }

    return {}
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formSubmissionType>({
    resolver: zodResolver(formSubmissionSchema),
    defaultValues: {
      formname: "",
    },
  })
  const navigate = useNavigate()
  const isFormJsonCreated = formJson?.components?.length

  const saveForm = async (formData: any) => {
    console.log({ formJson, formData })
    if (!formJson?.components?.length) {
      toast.error("Please design form")
      return
    }
    const formId = uuidv4()
    const formEntry: FormData = {
      key: formId,
      formname: formData.formname,
      formjson: JSON.stringify(formJson),
    }
    console.log({ formEntry })

    const result = (await addFormJson(formEntry)) as any
    console.log(result)
    if (result?.data?.created) {
      // toast.success("From Json added successfully")
    } else {
      toast.error("Event creation failed")
    }

    // await fetch(`${SHEETDB_API}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ data: [formEntry] }),
    // })

    // navigate(`/form/${formId}`)
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
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formJson))
  }, [formJson])
  console.log({ formJson })
  console.log({ formBuilderRef })

  return (
    <div className=" md:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 w-full">
          <Sidebar />
          {/* <DrawInput /> */}
        </div>
      </div>
      <Dialog
        open={!!showPreview}
        onOpenChange={() => {
          setShowPreview(false)
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent
          className="bg-white sm:max-w-[80%] h-[70vh]"
          aria-describedby=""
        >
          {isSuccess  ? (
            <div className="text-center m-auto">
              <div className="w-40 m-auto">
              <SuccessAnimation />
              </div>
              <h2>🎉 Form Created Successfully!</h2>
              <p>Your form is now live. Click the link below to preview it:</p>
              {/* <a href={""} target="_blank" rel="noopener noreferrer">
                🔗 Preview Form
              </a> */}
            </div>
          ) : (
            <>
              <form
                className="flex   mt-4 gap-2"
                onSubmit={handleSubmit(saveForm)}
              >
                <div className="flex-[4]">
                  <Input
                    placeholder="Enter Form Name"
                    style={{ outline: "none" }}
                    {...register("formname", { required: true })}
                  />
                  <span className="text-destructive text-xs">
                    {errors?.formname?.message}
                  </span>
                </div>
                <Button
                  type="submit"
                  variant={"success"}
                  disabled={addingForm}
                  className="ml-auto text-white text-xs flex-1"
                  // onClick={saveForm}
                >
                  {addingForm ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <span className="flex items-center">
                      <Plus className="mr-1" style={{ width: 14 }} /> Add Form
                    </span>
                  )}
                </Button>
              </form>
              <DialogHeader className="border-b border-gray-300">
                <DialogTitle className="">Form Preview</DialogTitle>
              </DialogHeader>

              <ScrollArea className="p-4" >
                <Form
                  src={""}
                  // className="border border-gray-300 p-2 shadow-sm rounded"
                  form={formJson}
                  onSubmit={() => setShowPreview(false)}
                />
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!showClearWarning}
        onOpenChange={() => {
          setShowClearWarning(false)
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="bg-white" aria-describedby="">
          <DialogHeader>
            <DialogTitle className="mb-2">
              Are you sure you want to clear this form? This action cannot be
              undone.
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mx-auto">
            <Button
              variant={"outline"}
              onClick={() => setShowClearWarning(false)}
            >
              No, Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                setFormJson({} as any)
                setShowClearWarning(false)
                setFormKey(uuidv4()) // Change key to force re-render
              }}
            >
              Yes, Clear it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="  h-[86vh]">
        <ResizablePanelGroup
          direction="horizontal"
          className="flex gap-2 h-full "
        >
          <ResizablePanel className="flex-[3]  h-full" minSize={70}>
            <div className="text-white flex justify-between mb-2 ">
              <h2 className="text-gray-800 text-xl">Create a Form</h2>
              <div className="flex gap-2">
                {isFormJsonCreated && (
                  <>
                    <Button
                      variant={"destructive"}
                      className="text-xs px-3"
                      onClick={() => {
                        setShowClearWarning(true)
                      }}
                    >
                      <AiOutlineClear className="mr-1 text-sm" />
                      Clear Form
                    </Button>
                    <Button
                      className="text-white text-xs"
                      onClick={() => {
                        setShowPreview(true)
                      }}
                    >
                      <Eye className="mr-1" style={{ width: 14 }} />
                      Preview/Save Form
                    </Button>
                  </>
                )}
              </div>
            </div>
            <ScrollArea className="h-full pb-2">
              <FormBuilder
                // key={JSON.stringify(formJson)}

                // @ts-ignore
                form={formJson}
                onChange={(e: FormType) => {
                  console.count("onChange")
                  console.log({ e })
                  if (!e?.components) {
                    console.error("Invalid form structure")
                    return
                  }
                  // const minifyJson = minimizeFormJson(e)
                  setFormJson(e)
                }}

                // onBuilderReady={(builder)=>{
                //   formBuilderRef.current = builder
                // }}

                // onSaveComponent={(component, original, parent) => {
                //   const minifyJson = minimizeFormJson(parent)
                //   localStorage.setItem("formjson",JSON.stringify(minifyJson))
                // }}
              />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle iconClass="bg-white" />

          <ResizablePanel
            minSize={15}
            className="flex-1  flex flex-col bg-slate-50 h-full "
          >
            <div className="flex  justify-between items-center">
              <h2 className="text-black text-lg  px-2">As JSON Schema</h2>
              <CopyButton
                title="Copy JSON"
                value={JSON.stringify(formJson, null, 2)}
              />
            </div>
            <div className=" flex-1 p-2 rounded  h-full ">
              <ScrollArea className="h-full pb-2">
                <ReactJson
                  src={formJson}
                  name={null}
                  collapsed={true}
                  displayDataTypes={false}
                ></ReactJson>
              </ScrollArea>
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
      .then((data: FormData[]) => setFormJson(JSON.parse(data[0]?.formjson)))
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

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<FormBuilderPage />} />
      <Route path="/form/:id" element={<FormPage />} />
    </Routes>
  </Router>
)

export default App
