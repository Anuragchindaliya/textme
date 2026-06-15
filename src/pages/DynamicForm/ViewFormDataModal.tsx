import { DialogTitle } from "@/components/ui/dialog"
import React from "react"
// Define types for the response structure
interface Response {
  data: Record<string, any>
  metadata: Record<string, any>
  state: string
  _vnote: string
}

// Define types for ignored keys
interface IgnoreKeys {
  [key: string]: string[]
}
// Keys to ignore while rendering
const ignoreKeys: IgnoreKeys = {
  data: ["submit"],
  metadata: ["onLine", "offset"],
  "": ["_vnote", "state"],
}
// Utility function to convert camelCase to human-readable form
const formatLabel = (label: string): string =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())

const ViewFormDataModal = ({ formData }: { formData: any }) => {
  // console.log({fo})
  // Reusable function to render object data conditionally
  const renderObject = (
    obj: Record<string, any>,
    parentKey: string = "",
  ): JSX.Element[] => {
    return Object.entries(obj)
      .filter(([key]) => {
        const ignoreList = ignoreKeys[parentKey] || []
        return !ignoreList.includes(key)
      })
      .flatMap(([key, value]) => {
        const formattedKey = formatLabel(key)
        if (value && typeof value === "object" && !Array.isArray(value)) {
          // Recursively render nested objects
          return (
            <div key={key} className="ml-4 mb-2">
              <h3 className="font-semibold">{formattedKey}:</h3>
              <div className="ml-4">{renderObject(value, key)}</div>
            </div>
          )
        } else {
          // Render simple key-value pairs
          return (
            <div key={key} className="mb-2">
              <strong>{formattedKey}:</strong> {String(value)}
            </div>
          )
        }
      })
  }
  return (
    <div className="p-4">
      <DialogTitle>Filtered Data Render</DialogTitle>
      <div className="mt-2">{renderObject(formData?.formdata)}</div>
      <div>
        Created At {formData?.format_created_at}
        Modified At {formData?.format_created_at}
      </div>
    </div>
  )
}

export default ViewFormDataModal
