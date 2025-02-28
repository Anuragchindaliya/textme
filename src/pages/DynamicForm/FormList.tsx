import { useGetFormJsonListQuery } from "@/features/dynamicForm/dynamicFormAPI"
import React, { useState } from "react"
import Sidebar from "../Notes/components/Sidebar"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "./formList.css"
import { Input } from "@/components/ui/input"
const FormList = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const { data, isLoading } = useGetFormJsonListQuery()
  console.log({ data }, "formList")
  const navigate = useNavigate()
  // Filter & sort logic
  const filteredForms = (data || [])
  .filter((form) =>
    form.formname.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    const dateA = new Date(a.created_at).getTime(); // Convert to timestamp
    const dateB = new Date(b.created_at).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
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
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col items-start space-y-4 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <input
          type="text"
          placeholder="🔍 Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/3"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📜 Oldest First</option>
        </select>
      </div> */}

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">📋 Your Forms</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {isLoading
            ? // Show skeleton loader while loading
              Array(6)
                .fill(null)
                .map((_, index) => (
                  <Card key={index} className="p-4 border border-gray-200">
                    <CardContent>
                      <Skeleton height={20} width="60%" />
                      <Skeleton height={15} width="80%" className="mt-2" />
                      <Skeleton height={15} width="50%" className="mt-2" />
                      <Skeleton height={15} width="70%" className="mt-2" />
                    </CardContent>
                  </Card>
                ))
            : // Show form list when loaded
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
                  onClick={() => navigate(`/form/${form.id}`)}
                  className="glass-card cursor-pointer"
                >
                  <Card className="p-4 cursor-pointer  hover:shadow-lg transition-shadow duration-200">
                    <CardContent>
                      <h2 className="text-lg font-medium">{form.formname}</h2>
                      <p className="text-sm text-gray-500">🆔 {form.key}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        📅 Created: {form.created_at}
                      </p>
                      <p className="text-sm text-gray-400">
                        ✏️ Modified: {form.modified_at}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  )
}

export default FormList
