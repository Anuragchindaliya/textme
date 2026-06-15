import React, { useState } from "react"
import { useGetFormJsonListQuery } from "@/features/dynamicForm/dynamicFormAPI"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/Router"
import { Database, Plus } from "lucide-react"
import { FcDocument } from "react-icons/fc"
import { startTourActive } from "@/features/dynamicForm/dynamicFormSlice"
import { useAppDispatch } from "@/app/hooks"
import ToolLayout from "@/components/ToolLayout"
import { theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

const FormList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const { data, isLoading } = useGetFormJsonListQuery()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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
      const dateA = a.date_created_at.getTime()
      const dateB = b.date_created_at.getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  return (
    <ToolLayout
      title="📋 Custom Form Builder"
      description="Create, customize, and analyze interactive online forms and submission databases."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className={theme.classes.buttonSecondary}
            onClick={() => dispatch(startTourActive())}
          >
            Start onboarding tour
          </Button>
          <Link to={ROUTES.CREATE_FORMS} className="create-form-button">
            <Button className={theme.classes.buttonPrimary}>
              <Plus className="size-4 mr-1.5" />
              Create Form
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:max-w-md">
            <Input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(theme.classes.input, "pl-9 form-search-input")}
            />
            <span className="absolute left-3 top-2 text-slate-400 dark:text-slate-500">
              🔍
            </span>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={cn(
              theme.classes.input,
              "sm:w-48 bg-transparent cursor-pointer form-sort-button",
            )}
          >
            <option
              value="newest"
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              📅 Newest First
            </option>
            <option
              value="oldest"
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              📜 Oldest First
            </option>
          </select>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6)
              .fill(null)
              .map((_, index) => (
                <Card
                  key={index}
                  className="p-5 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
                >
                  <CardContent className="p-0 space-y-3">
                    <Skeleton
                      height={20}
                      width="60%"
                      className="dark:bg-slate-800"
                    />
                    <Skeleton
                      height={14}
                      width="40%"
                      className="dark:bg-slate-800"
                    />
                    <div className="space-y-2 pt-2">
                      <Skeleton
                        height={12}
                        width="80%"
                        className="dark:bg-slate-800"
                      />
                      <Skeleton
                        height={12}
                        width="70%"
                        className="dark:bg-slate-800"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : filteredForms?.length ? (
            filteredForms?.map((form, index) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-pointer form-card-details"
                onClick={() => navigate(`/form/${form?.key}`)}
              >
                <Card className={theme.classes.cardInteractive}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <h2 className={theme.typography.cardTitle}>
                        {form.formname}
                      </h2>
                      <div>
                        <span className={theme.classes.badgeIndigo}>
                          Key: {form.key}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">
                          {form.format_created_at}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modified:</span>
                        <span className="font-medium">
                          {form.format_modified_at}
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to={`/form/${form?.key}`}
                        className="flex-1 form-preview-button"
                      >
                        <Button
                          variant="outline"
                          className="w-full text-xs gap-1.5"
                        >
                          <FcDocument className="size-4" /> Preview
                        </Button>
                      </Link>
                      <Link
                        to={`${ROUTES.FORM_DATA}/${form?.key}`}
                        className="flex-1 form-submissions-button"
                      >
                        <Button
                          variant="secondary"
                          className="w-full text-xs gap-1.5"
                        >
                          <Database className="size-3 text-slate-500" /> Data
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500">
              No forms created yet. Click &quot;Create Form&quot; to get
              started!
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}

export default FormList
