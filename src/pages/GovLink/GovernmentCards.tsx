// src/components/GovernmentCards.js

import Spinner from "@/components/ui/spinner"
import { GovLinksRes, useGetGovLinksQuery } from "@/features/govSite/govAPI"
import { useDebounce } from "@/hooks/useDebounce"
import { Briefcase, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import Sidebar from "../Notes/components/Sidebar"
const categoryConfig = {
  Document: {
    bgColor: "bg-blue-100 ",
    btnColor: "bg-blue-600",
    textColor: "text-blue-700",
  },
  Job: {
    bgColor: "bg-orange-100",
    btnColor: "bg-orange-600",
    textColor: "text-orange-700",
  },
}
const GovernmentCards = () => {
  const { isLoading, data } = useGetGovLinksQuery()
  const [filterData, setFilterData] = useState<GovLinksRes[]>([])
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("All")
  const debouncedQuery = useDebounce(searchText) // 500ms debounce delay

  useEffect(() => {
    if (Array.isArray(data)) {
      setFilterData(data)
    }
  }, [data])
  const filteredData = filterData.filter((item) => {
    const macthesCategory = category == "All" || item.Category === category

    return (
      item.Name.toLowerCase().includes(debouncedQuery.toLowerCase()) &&
      macthesCategory
    )
  })

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <Sidebar />
        <h1 className="text-2xl font-bold mb-4 text-center flex-1">
          Government Websites
        </h1>
      </div>
      <div className="flex max-w-lg mx-auto space-x-3">
        <form
          className="  mb-4 flex-1 w-full"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              name="search"
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={`Search...       ${
                filteredData.length ? `${filteredData.length} record's` : ""
              }`}
              onChange={(e) => {
                setSearchText(e.currentTarget?.value)
              }}
              // required=""
            />
            {/* <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button> */}
          </div>
        </form>
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2  mb-4"
        >
          <option value="All">All Categories</option>
          <option value="Document">Document</option>
          <option value="Job">Job</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-[calc(100vh-100px)] items-center">
          <Spinner className="mx-auto" />{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {filteredData.length > 0 ? (
            filteredData?.map((site, index) => {
              return (
                <a
                  key={index}
                  href={site.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    " rounded-lg shadow-lg p-6 m-0  hover:bg-gray-200 transition duration-300 relative h-full" +
                    ` ${(categoryConfig as any)[site.Category].bgColor}`
                  }
                >
                  {site.Category === "Document" && (
                    <FileText
                      strokeWidth={1}
                      className="absolute  w-28 h-28 right-8 top-8 rotate-45 text-gray-100"
                    />
                  )}
                  {site.Category === "Job" && (
                    <Briefcase
                      strokeWidth={1}
                      className="absolute  w-28 h-28 right-8 top-8 rotate-45 text-gray-100"
                    />
                  )}
                  <div className="z-2 relative">
                    <h2
                      className={`text-lg font-semibold mb-2 dark:text-black ${
                        (categoryConfig as any)[site.Category].textColor
                      }`}
                    >
                      {site.Name}
                    </h2>
                    <p className="text-gray-700 mb-4 text-sm">
                      {site.Services}
                    </p>
                    <span
                      className={
                        "inline-block  text-white px-3 py-1 rounded-full text-xs font-semibold overflow-ellipsis overflow-hidden w-full " +
                        `${(categoryConfig as any)[site.Category].btnColor}`
                      }
                    >
                      {site.URL}
                    </span>
                  </div>
                </a>
              )
            })
          ) : (
            <div className="flex col-span-6  justify-center">No Data Found</div>
          )}
        </div>
      )}
    </div>
  )
}

export default GovernmentCards
