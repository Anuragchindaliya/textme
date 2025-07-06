import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { History, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"

import { useToast } from "@/components/ui/use-toast"
import {
  NoteContentForm,
  noteContentFormSchema,
  ShareContentForm,
  ShareContentFormSchema,
  useCreateNoteQuery,
  useGetContentDataQuery,
  // useGetNoteMutation,
  usePostNoteContentMutation,
  usePostShareContentMutation
} from "@/features/note/noteAPI"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { syntaxStyleName, themeOptionsConfig } from "../ReactFlow/stylesthemeCode"
// import "./styles.css"
import NoteTitleInput from "../Notes/components/NoteTitleInput"
import Sidebar from "../Notes/components/Sidebar"
import CodeEditor from "./components/CodeEditor"

export default function ShareContent() {
  // const [noteContent, setNoteContent] = useState("")
  // const noteData = useGetNoteMutation({ fixedCacheKey: "get-note-data" })
    const [selectedTheme, setSelectedTheme] = useState<any>(themeOptionsConfig[syntaxStyleName[0]]);
  
  const [searchParams] = useSearchParams()

  const noteTitle = searchParams.get("t")
  const { data, refetch } = useGetContentDataQuery(noteTitle || "", {
    skip: !noteTitle,
    refetchOnMountOrArgChange: true,
  })
  const { isSuccess } = useCreateNoteQuery(noteTitle, {
    skip: data?.length !== 0,
  })
  const { toast } = useToast()

  const [postNoteContent, { isLoading: isLoadingUpdate }] =
    usePostShareContentMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    resetField,
    watch,
    reset
  } = useForm<ShareContentForm>({
    resolver: zodResolver(ShareContentFormSchema),
    values: {
      content: data?.[0]?.content || "",
      title: noteTitle || "",
      tab: data?.[0]?.tab || "text",
    },
  })
  const noteContent = watch("content")
  console.log({ errors,noteContent,tab:watch("tab") })
  const onNoteContentSubmit = async (formData: ShareContentForm) => {
    console.log("formData", formData)
    // return;
    const result = await postNoteContent(formData).unwrap()
    console.log({ result })
    if (result?.updated === 1) {
      reset()
      // setNoteContent(result?.data?.content || "")
    }
  }
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Note created",
      })
    }
  }, [isSuccess])
  
  useEffect(() => {
    const att = "data-section"
    document.body.setAttribute(att, "playground")

    return () => {
      document.body.setAttribute(att, "")
    }
  }, [])
  return (
    <div className="">
      <div className="app-h-screen flex-col flex">
        <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
          {/* <h2 className="text-lg font-semibold">Playground</h2> */}
          {/* <PresetSelector presets={presets}  /> */}

          <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
            <Sidebar />
            <NoteTitleInput />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div
              className="grid h-full items-stretch gap-6 "
            >
              <form
                className="md:order-1"
                onSubmit={handleSubmit(onNoteContentSubmit)}
              >
                <TabsContent
                  value="complete"
                  className="mt-0 border-0 p-0 h-full"
                >
                  <div className="flex h-full flex-col space-y-4">
                    <CodeEditor setValue={setValue}  initialText={data?.[0]?.content || ""} initialTab={data?.[0]?.tab} key={data?.[0]?.content} />
                    <div className="flex items-center space-x-2">
                      <Button
                        type="submit"
                        disabled={!noteTitle || !dirtyFields.content}
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!noteTitle}
                        onClick={() => {
                          resetField("content", {
                            defaultValue: noteContent,
                          })
                          refetch()
                        }}
                      >
                        <span className="sr-only">Refresh</span>
                        <RefreshCcw
                          className={cn("h-4 w-4", {
                            "animate-spin": isLoadingUpdate,
                            // || noteData[1].isLoading,
                          })}
                        />
                      </Button>
                      {errors?.content && (
                        <p className=" px-1 text-red-600">
                          {errors?.content.message}
                        </p>
                      )}

                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <Textarea
                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                        className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                      />
                      <div className="rounded-md border bg-muted"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[580px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
