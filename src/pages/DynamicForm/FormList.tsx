import React, { useState } from "react"
import { useGetFormJsonListQuery } from "@/features/dynamicForm/dynamicFormAPI"
import Sidebar from "../Notes/components/Sidebar"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "./formList.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/Router"
import { Database, Plus } from "lucide-react"
import { FcDocument } from "react-icons/fc"
import { startTourActive } from "@/features/dynamicForm/dynamicFormSlice"
import { useAppDispatch } from "@/app/hooks"

const FormList = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const { data, isLoading } = useGetFormJsonListQuery()
  console.log({ data }, "formList")
  const navigate = useNavigate()
    const dispatch = useAppDispatch()
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
              className="form-search-input flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-sort-button p-2 border border-gray-300 rounded-lg ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">📜 Oldest First</option>
            </select>
            <Link to={ROUTES.CREATE_FORMS} className="create-form-button ml-4">
              <Button>
                <Plus className="size-4 mr-1" />
                Create Form
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">📋 Your Forms</h1>
        <Button onClick={()=>{
          dispatch(startTourActive())
        }}>Start onboarding tour</Button>
        </div>
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
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                // onClick={() => navigate(`/form/${form?.key}`)}
                className="form-card-details glass-card"
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
                      <Link to={`/form/${form?.key}`} className="form-preview-button">
                        <Button variant={"outline"} className="text-xs">
                          <FcDocument className="mr-1 size-4" /> Preview Form
                        </Button>
                      </Link>
                      <Link to={`${ROUTES.FORM_DATA}/${form?.key}`} className="form-submissions-button">
                        <Button variant={"secondary"} className="text-xs">
                          <Database className="mr-1 size-3" /> View Submission{" "}
                        </Button>
                      </Link>
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
    </div>
  )
}

export default FormList
