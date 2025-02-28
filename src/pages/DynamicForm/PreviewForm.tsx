import { useGetFormJsonQuery } from "@/features/dynamicForm/dynamicFormAPI"
import { Form } from "@formio/react"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
type SubmissionData = {
  form_id: string
  submission_data: string
}
const PreviewForm = () => {
  const { id } = useParams<{ id: string }>()
  const [formJson, setFormJson] = useState<any>(null)
  const {data} = useGetFormJsonQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  })
  // const { data, refetch } = useGetDrawFileDataQuery(fileName || "", {
  //   skip: !fileName,
  //   refetchOnMountOrArgChange: true,
  // })
  console.log({data},"formJsonData")

  useEffect(() => {
    // fetch(`${SHEETDB_API}/search?id=${id}`)
    //   .then((res) => res.json())
    //   .then((data: FormData[]) => setFormJson(JSON.parse(data[0]?.formjson)))
  }, [id])

  const handleSubmit = async (submission: any) => {
    const submissionEntry: SubmissionData = {
      form_id: id!,
      submission_data: JSON.stringify(submission),
    }

    // await fetch(`${SHEETDB_API}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ data: [submissionEntry] }),
    // })
    alert("Form submitted successfully!")
  }

  return formJson ? (
    <Form src={""} form={formJson} onSubmit={handleSubmit} />
  ) : (
    <p>Loading...</p>
  )
}

export default PreviewForm
