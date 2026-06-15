import {
  useAddFormDataMutation,
  useGetFormJsonQuery,
} from "@/features/dynamicForm/dynamicFormAPI"
import { Form } from "@formio/react"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "../Notes/components/Sidebar"
import { v4 as uuidv4 } from "uuid"
import { toast } from "react-toastify"
import Spinner from "@/components/ui/spinner"

type SubmissionData = {
  key: string
  formname: string
  formdata: string
}
const PreviewForm = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetFormJsonQuery(id || "", {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  })

  const currentFormData = data?.[0]

  return (
    <div className="container md:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 w-full">
          <Sidebar />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="flex items-center">
            <Spinner />
            Loading...
          </div>
        </div>
      ) : (
        <FormUI currentFormData={currentFormData} />
      )}
    </div>
  )
}
const FormUI = ({ currentFormData }: { currentFormData: any }) => {
  const [formKey, setFormKey] = useState(uuidv4())
  const [addFormData, { isLoading }] = useAddFormDataMutation()
  const [formJson, setFormJson] = useState<any>(null)

  const handleSubmit = async (submission: any) => {
    const submissionEntry: SubmissionData = {
      key: currentFormData?.key,
      formname: currentFormData?.formname || "",
      formdata: JSON.stringify(submission),
    }
    console.log({ submissionEntry, submission })
    try {
      const result = await addFormData(submissionEntry).unwrap()
      if (result?.created) {
        toast.success("Form submitted successfully!")
        setFormKey(uuidv4())
      }
    } catch (error) {
      toast.error("Fail to submitted successfully!")
      console.log({ error })
    }
  }
  useEffect(() => {
    if (currentFormData?.formjson) {
      try {
        const parsedJson = JSON.parse(currentFormData?.formjson) // Safely parse JSON
        setFormJson(parsedJson)
      } catch (error) {
        console.error("Invalid JSON format:", error)
        setFormJson(null) // Fallback if parsing fails
      }
    }
  }, [currentFormData?.formjson]) // Run effect only when data.formjson changes
  return (
    <div>
      <h2 className="text-center capitalize">{currentFormData?.formname}</h2>
      <div className="bg-gray-100 p-4 rounded">
        <Form key={formKey} src={""} form={formJson} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default PreviewForm
