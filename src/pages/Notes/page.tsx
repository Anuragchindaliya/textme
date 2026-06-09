import { useEffect, useState } from "react"
import { History, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import "./styles.css"
import {
  NoteContentForm,
  noteContentFormSchema,
  useCreateNoteQuery,
  useGetNoteDataQuery,
  usePostNoteContentMutation,
} from "@/features/note/noteAPI"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import NoteTitleInput from "./components/NoteTitleInput"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import ToolLayout from "@/components/ToolLayout"

export default function Notes() {
  const [searchParams] = useSearchParams()

  const noteTitle = searchParams.get("t")
  const { data, refetch } = useGetNoteDataQuery(noteTitle || "", {
    skip: !noteTitle,
    refetchOnMountOrArgChange: true,
  })
  const { isSuccess } = useCreateNoteQuery(noteTitle, {
    skip: data?.length !== 0,
  })
  const { toast } = useToast()

  const [postNoteContent, { isLoading: isLoadingUpdate }] =
    usePostNoteContentMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    resetField,
    watch,
  } = useForm<NoteContentForm>({
    resolver: zodResolver(noteContentFormSchema),
    values: {
      content: data?.[0]?.content || "",
      title: noteTitle || "",
    },
  })
  const noteContent = watch("content")
  console.log({ errors })
  const onNoteContentSubmit = async (formData: NoteContentForm) => {
    console.log("formData", formData.title)
    const result = await postNoteContent(formData).unwrap()
    console.log({ result })
    if (result.statusCode === 200) {
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
    <ToolLayout
      title="Notes Playground"
      description="Write summaries, save code snippets, and store persistent workspace notes."
      actions={
        <div className="flex items-center gap-2">
          <NoteTitleInput />
        </div>
      }
    >
      <Tabs defaultValue="complete" className="flex-1 w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-6">
          <TabsTrigger value="complete">Complete</TabsTrigger>
          <TabsTrigger value="insert">Insert Mode</TabsTrigger>
          <TabsTrigger value="edit">Edit Mode</TabsTrigger>
        </TabsList>
        
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onNoteContentSubmit)}
        >
          <TabsContent
            value="complete"
            className="mt-0 border-0 p-0 h-full"
          >
            <div className="flex flex-col space-y-4 min-h-[300px]">
              <Textarea
                placeholder="Write description to save..."
                className="flex-1 p-4 min-h-[320px] font-mono text-sm leading-relaxed"
                {...register("content")}
              />
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                  type="submit"
                  disabled={!noteTitle || !dirtyFields.content}
                >
                  Update Note
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
                    })}
                  />
                </Button>
                {errors?.content && (
                  <p className="px-1 text-sm text-red-600">
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
                  placeholder="We're writing to [insert]. Congrats from OpenAI!"
                  className="h-full min-h-[300px]"
                />
                <div className="rounded-md border bg-slate-50 dark:bg-slate-900/60 p-4 text-xs text-slate-400 font-mono">
                  Preview workspace
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button type="button">Submit</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="mt-0 border-0 p-0">
            <div className="flex flex-col space-y-4">
              <div className="grid h-full gap-6 lg:grid-cols-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label htmlFor="input">Input Text</Label>
                    <Textarea
                      id="input"
                      placeholder="We is going to the market."
                      className="flex-1 min-h-[150px]"
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
                <div className="min-h-[200px] rounded-md border bg-slate-50 dark:bg-slate-900/60 p-4 text-xs text-slate-400 font-mono">
                  Diff adjustments
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <Button type="button">Submit Changes</Button>
              </div>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </ToolLayout>
  )
}
