import { useGetFormSubmissionListQuery } from "@/features/dynamicForm/dynamicFormAPI"
import React, { useState } from "react"
import Sidebar from "../Notes/components/Sidebar"
import { Input } from "@/components/ui/input"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Database, Grid } from "lucide-react"
import { ROUTES } from "@/Router"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import { FcDocument } from "react-icons/fc"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ViewFormDataModal from "./ViewFormDataModal"

const FormSubmissionList = () => {
  const { id } = useParams<{ id: string }>()

  const { isLoading, data } = useGetFormSubmissionListQuery(id || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  console.log({ data }, "formList")
  const navigate = useNavigate()
  const [formData,setFormData]=useState<any>(null)
  // Filter & sort logic
  const filteredForms = (data || [])
    .filter((form) =>
      form.formname.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((item) => ({
      ...item,
      format_created_at: new Date(+item?.created_at).toLocaleString(),
      format_modified_at: new Date(+item?.modified_at).toLocaleDateString(),
      date_created_at: new Date(+item?.created_at),
      date_modified_at: new Date(+item?.modified_at),
    }))
    .sort((a, b) => {
      const dateA = a.date_created_at.getTime() // Convert to timestamp
      const dateB = b.date_created_at.getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    console.log({formData})
  return (
    <div className=" md:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 w-full">
          <Sidebar />
          {/* <DrawInput /> */}
          <div className=" w-full flex flex-col items-start space-y-4 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
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
            <Link to={ROUTES.FORMS} className=" ml-4">
              <Button>
                <Grid className="size-4 mr-1" />
                View Forms
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">📋 Your Form submission</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeleton loader while loading
            Array(6)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="p-4 border border-gray-200">
                  <CardContent>
                    <Skeleton
                      height={20}
                      width="60%"
                      className="dark:bg-gray-600"
                    />
                    <Skeleton
                      height={15}
                      width="80%"
                      className="mt-2 dark:bg-gray-700"
                    />
                    <Skeleton
                      height={15}
                      width="50%"
                      className="mt-2 dark:bg-gray-700"
                    />
                    <Skeleton
                      height={15}
                      width="70%"
                      className="mt-2 dark:bg-gray-700"
                    />
                  </CardContent>
                </Card>
              ))
          ) : // Show form list when loaded
          filteredForms?.length ? (
            filteredForms?.map((form, index) => (
              <motion.div
                key={form.id}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                // whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                // className="glass-card cursor-pointer"
              >
                <Card className="p-4 cursor-pointer  hover:shadow-lg transition-shadow duration-200">
                  <CardContent>
                    <h2 className="text-lg font-medium">{form.formname}</h2>
                    <p className="text-sm text-gray-500">🆔 {form.key}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      📅 Created: {form.format_created_at}
                    </p>
                    <p className="text-sm text-gray-400">
                      ✏️ Modified: {form.format_modified_at}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/form/${form?.key}`}>
                        <Button variant={"outline"} className="text-xs">
                          <FcDocument className="mr-1 size-4" /> Preview Form
                        </Button>
                      </Link>
                        <Button onClick={()=>{
                          setFormData({...form,formdata:JSON.parse(form?.formdata)})
                        }} variant={"secondary"} className="text-xs">
                          <Database className="mr-1 size-3" /> View Details{" "}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div>No Data Available</div>
          )}
        </div>
      </div>

      <Dialog
        open={!!formData}
        onOpenChange={()=>{
          setFormData(null)
        }}
      >
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent
          className=" sm:max-w-[80%] h-[70vh]"
          aria-describedby=""
        >
          <ViewFormDataModal formData={formData} />
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default FormSubmissionList
