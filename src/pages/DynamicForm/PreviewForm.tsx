import { useGetFormJsonQuery } from "@/features/dynamicForm/dynamicFormAPI"
import { Form } from "@formio/react"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Sidebar from "../Notes/components/Sidebar"
type SubmissionData = {
  form_id: string
  submission_data: string
}
const PreviewForm = () => {
  const { id } = useParams<{ id: string }>()
  const [formJson, setFormJson] = useState<any>(null)
  const {data,isLoading} = useGetFormJsonQuery(id || "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  })
  
  console.log({data},"formJsonData")

  useEffect(() => {
    // fetch(`${SHEETDB_API}/search?id=${id}`)
    //   .then((res) => res.json())
    //   .then((data: FormData[]) => setFormJson(JSON.parse(data[0]?.formjson)))
  }, [id])
  useEffect(() => {
    if (data?.[0]?.formjson) {
      try {
        const parsedJson = JSON.parse(data?.[0]?.formjson);  // Safely parse JSON
        setFormJson(parsedJson);
      } catch (error) {
        console.error("Invalid JSON format:", error);
        setFormJson(null);  // Fallback if parsing fails
      }
    }
  }, [data?.[0]?.formjson]);  // Run effect only when data.formjson changes

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

  return <div className=" md:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 w-full">
          <Sidebar />
          {/* <DrawInput /> */}
          {/* <div className=" w-full flex flex-col items-start space-y-4 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
            <Input
              type="text"
              placeholder="🔍 Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">📜 Oldest First</option>
            </select>
            <Link to={ROUTES.CREATE_FORMS} className=" ml-4" >
            <Button>
            Create Form
            </Button>
            </Link>
          </div> */}
        </div>
      </div>
      {isLoading ? (
    <p>Loading...</p>
  ) : (
    <Form src={""} form={formJson} onSubmit={handleSubmit} />
  )}
  </div>

}

export default PreviewForm
