import React, { useEffect, useState } from "react"
import { Excalidraw, Footer } from "@excalidraw/excalidraw"
import { useTheme } from "next-themes"
import Sidebar from "../Notes/components/Sidebar"
import DrawInput from "./components/DrawInput"
import { useSearchParams } from "react-router-dom"
import {
  useCreateDrawFileQuery,
  useGetDrawFileDataQuery,
  usePostDrawFileContentMutation,
} from "@/features/draw/drawAPI"
import { useToast } from "@/components/ui/use-toast"
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
const Draw = () => {
  const { theme } = useTheme()
  const [drawData, setDrawData] = useState<any>()
  const [searchParams] = useSearchParams()
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const fileName = searchParams.get("t")
  const { data, refetch } = useGetDrawFileDataQuery(fileName || "", {
    skip: !fileName,
    refetchOnMountOrArgChange: true,
  })
  const { isSuccess } = useCreateDrawFileQuery(fileName, {
    skip: data?.length !== 0,
  })
  const { toast } = useToast()
  const [postDrawContent, { isLoading: isLoadingUpdate }] =
    usePostDrawFileContentMutation()
  const onSave = async ()=>{
    console.log({drawData})
    if(!fileName){
      return;
    }
    const resData = await postDrawContent({
      filename:fileName,
      content:JSON.stringify(drawData) || ""
    }).unwrap()
    console.log({resData})
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "File created",
      })
      // editorRef.current?.clear()
      setDrawData([])
    }
  }, [isSuccess])
  useEffect(() => {
    if (data?.[0]?.content) {
      try {
        const output = JSON.parse(data[0].content) || []
        // setDrawData(output)
        console.log({output})
        excalidrawAPI?.updateScene({elements:output})
        // .then((data) => {
        //   console.log("render", data)
        // })
        // .catch((data) => {
        //   console.log(data)
        // })
      } catch (error) {
        // console.log(error)
      }
      
    }
  }, [data])
  return (
    <div style={{ height: "87vh" }}>
      <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
          <Sidebar />
          <DrawInput />
        </div>
      </div>

      <Excalidraw
      excalidrawAPI={(api) => setExcalidrawAPI(api)}
        theme={theme as any}
        onChange={(data) => {
          // console.log(rest,"draw")
          setDrawData(data)
        }}
        initialData={drawData}
      >
        <Footer>
          <button
            className=" ml-auto bg-green-600 text-white p-2 px-4 rounded-md"
            // onClick={() => alert("This is dummy footer")}
            onClick={onSave}
          >
            Save
          </button>
        </Footer>
      </Excalidraw>
    </div>
  )
}

export default Draw
