import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import Checklist from "@editorjs/checklist"
import EditorJS, { OutputData } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import { History, RefreshCcw } from "lucide-react"
import { useEffect, useRef } from "react"

import { useToast } from "@/components/ui/use-toast"
import {
  EditorContentForm,
  editorContentFormSchema,
  useCreateEditorFileQuery,
  useGetEditorFileDataQuery,
  usePostEditorFileContentMutation,
} from "@/features/editor/editorAPI"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import EditorFileInput from "./components/NoteTitleInput"
import Sidebar from "../Notes/components/Sidebar"

export default function Editor() {
  // const [noteContent, setNoteContent] = useState("")
  // const noteData = useGetNoteMutation({ fixedCacheKey: "get-note-data" })
  const editorRef = useRef<EditorJS | null>()
  const [searchParams] = useSearchParams()

  const fileName = searchParams.get("t")
  const { data, refetch } = useGetEditorFileDataQuery(fileName || "", {
    skip: !fileName,
    refetchOnMountOrArgChange: true,
  })
  const { isSuccess } = useCreateEditorFileQuery(fileName, {
    skip: data?.length !== 0,
  })
  const { toast } = useToast()

  const [postEditorContent, { isLoading: isLoadingUpdate }] =
    usePostEditorFileContentMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    resetField,
    watch,
  } = useForm<EditorContentForm>({
    resolver: zodResolver(editorContentFormSchema),
    values: {
      content: data?.[0]?.content || "",
      filename: fileName || "",
    },
  })
  const noteContent = watch("content")
  const onNoteContentSubmit = async (formData: EditorContentForm) => {
    if (!fileName) {
      return
    }
    try {
      const saveContent = await editorRef.current?.save()

      const result = await postEditorContent({
        content: JSON.stringify(saveContent),
        filename: fileName,
      }).unwrap()
      if (result.statusCode === 200) {
        // setNoteContent(result?.data?.content || "")
      }
    } catch (error) {
      console.log("Saving failed: ", error)
    }
  }
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "File created",
      })
      editorRef.current?.clear()
    }
  }, [isSuccess])
  // const onNoteResult = ({
  //   content,
  //   title,
  // }: {
  //   content: string
  //   title: string
  // }) => {
  //   console.log({ content })
  //   // setNoteContent(content)
  //   setValue("content", content)
  //   setValue("title", title)
  // }
  // const onNoteContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setNoteContent(e.target.value)
  // }

  const initEditor = () => {
    const editor = new EditorJS({
      /**
       * Id of Element that should contain Editor instance
       */
      onReady: () => {
        editorRef.current = editor
      },
      holder: "editorjs",
      tools: {
        header: Header,
        list: List,
        checklist: Checklist,
      },
      onChange: (api, event) => {
        editorRef.current?.save().then((data: OutputData) => {
          setValue("content", JSON.stringify(data), {
            shouldValidate: true,
            shouldDirty: true,
          })
        })
        // console.log({api,event},api.save)
      },
    })
  }
  useEffect(() => {
    if (!editorRef.current?.isReady) {
      initEditor()
    }

    const att = "data-section"
    document.body.setAttribute(att, "playground")

    return () => {
      editorRef.current?.destroy?.()
      editorRef.current = null
      document.body.setAttribute(att, "")
    }
  }, [])
  useEffect(() => {
    if (data?.[0]?.content && editorRef.current?.isReady) {
      try {
        const output = JSON.parse(data[0].content)
        editorRef.current?.render?.(output)
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
    <div className="">
      <div className="app-h-screen flex-col flex">
        <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
          {/* <h2 className="text-lg font-semibold">Playground</h2> */}
          {/* <PresetSelector presets={presets}  /> */}

          <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
            <Sidebar />
            <EditorFileInput />
            {/* <PresetSave /> */}
            {/* <div className="hidden space-x-2 md:flex">
              <CodeViewer /> */}
            {/* <PresetShare /> */}
            {/* </div> */}
            {/* <PresetActions /> */}
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div
              className="grid h-full items-stretch gap-6 "
              // md:grid-cols-[1fr_200px]"
            >
              {/* <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="complete">
                      <span className="sr-only">Complete</span>
                      <Icons.completeMode className="h-5 w-5" />
                    </TabsTrigger>
                    <TabsTrigger value="insert">
                      <span className="sr-only">Insert</span>
                      <Icons.insertMode className="h-5 w-5" />
                    </TabsTrigger>
                    <TabsTrigger value="edit">
                      <span className="sr-only">Edit</span>
                      <Icons.editMode className="h-5 w-5" />
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ModelSelector types={types} models={models} />
                <TemperatureSelector defaultValue={[0.56]} />
                <MaxLengthSelector defaultValue={[256]} />
                <TopPSelector defaultValue={[0.9]} />
              </div> */}
              <form
                className="md:order-1"
                onSubmit={handleSubmit(onNoteContentSubmit)}
              >
                <TabsContent
                  value="complete"
                  className="mt-0 border-0 p-0 h-full"
                >
                  <div className="flex h-full flex-col space-y-4">
                    <div
                      id="editorjs"
                      className="border dark:bg-gray-700 w-full h-full flex-1 selection:bg-slate-700"
                    ></div>
                    {/* <Textarea
                      placeholder="Write deescription to save"
                      className=" flex-1 p-4 "
                      // value={noteContent}
                      // onChange={onNoteContentChange}
                      {...register("content")}
                    /> */}
                    <div className="flex items-center space-x-2">
                      <Button
                        type="submit"
                        disabled={
                          !fileName
                          // || !dirtyFields.content
                        }
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!fileName}
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
                      {/* <Button
                        type="button"
                        variant="secondary"
                        disabled={!fileName}
                        className="!ml-auto"
                      >
                        <span className="sr-only">Show history</span>
                        <History
                          className={cn("h-4 w-4", {
                            "animate-spin":
                              isLoadingUpdate || noteData[1].isLoading,
                          })}
                        />
                      </Button> */}

                      {/* <p>
                        {noteData[1].data?.data.created_at &&
                          formatDistance(
                            new Date(noteData[1].data?.data.created_at),
                            new Date(),
                            {
                              addSuffix: true,
                            },
                          )}
                      </p> */}
                      {/* <div className="!ml-auto ">
                        {noteData[1].data?.data.updated_at &&
                          formatDistance(
                            new Date(noteData[1].data?.data.updated_at),
                            new Date(),
                            {
                              addSuffix: true,
                            },
                          )}
                      </div> */}
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
