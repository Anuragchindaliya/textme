import { History } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { CodeViewer } from "./components/code-viewer"
import { Icons } from "./components/icons"
import { MaxLengthSelector } from "./components/maxlength-selector"
import { ModelSelector } from "./components/model-selector"
import { PresetActions } from "./components/preset-actions"
import { PresetSave } from "./components/preset-save"
import { PresetSelector } from "./components/preset-selector"
import { PresetShare } from "./components/preset-share"
import { TemperatureSelector } from "./components/temperature-selector"
import { TopPSelector } from "./components/top-p-selector"
import { models, types } from "./data/models"
import { presets } from "./data/presets"
import "./styles.css"
import { useEffect, useState } from "react"
import { Search } from "./components/search"
import { Input } from "@/components/ui/input"
import { useGetNoteMutation } from "@/features/note/noteAPI"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
const noteFormSchema = z.object({
  note: z.string().nonempty(),
})
type noteFormType = z.infer<typeof noteFormSchema>
export default function Notes() {
  const [getNote, { isLoading }] = useGetNoteMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<noteFormType>({
    resolver: zodResolver(noteFormSchema),
  })
  const [noteContent, setNoteContent] = useState("")

  const onNoteContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value)
  }
  const onNoteSubmit = async (formData: noteFormType) => {
    console.log({ formData })
    const result = await getNote(formData.note).unwrap()
    if (result.statusCode === 200) {
      setNoteContent(result?.data?.content || "")
    }
  }
  useEffect(() => {
    const att = "data-section"
    document.body.setAttribute(att, "playground")
    return () => {
      document.body.setAttribute(att, "")
    }
  }, [])
  return (
    <div className="">
      <div className="h-screen flex-col flex">
        <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-20">
          {/* <h2 className="text-lg font-semibold">Playground</h2> */}
          {/* <PresetSelector presets={presets}  /> */}
          <div className="py-1 pt-3 ml-auto flex w-full space-x-2 sm:justify-end">
            <form
              className="flex w-full space-x-2 "
              onSubmit={handleSubmit(onNoteSubmit)}
            >
              <div className="w-full relative">
                <Input
                  // name="note"
                  type="search"
                  placeholder="Search..."
                  className=" w-full"
                  {...register("note")}
                />
                {errors?.note && (
                  <p className="absolute top-full px-1 text-xs text-red-600">
                    {errors?.note.message}
                  </p>
                )}
              </div>
              <Button type="submit" variant="secondary">
                Submit
              </Button>
            </form>
            {/* <PresetSave /> */}
            {/* <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions /> */}
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
              <div className="md:order-1">
                <TabsContent
                  value="complete"
                  className="mt-0 border-0 p-0 h-full"
                >
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Write a tagline for an ice cream shop"
                      className=" flex-1 p-4 "
                      value={noteContent}
                      onChange={onNoteContentChange}
                    />
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
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
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
