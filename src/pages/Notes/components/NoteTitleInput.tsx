import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useGetNoteDataQuery,
  useGetNoteMutation,
} from "@/features/note/noteAPI"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendIcon } from "lucide-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PresetShare } from "./preset-share"
import { useSearchParams } from "react-router-dom"
import { Eraser } from "lucide-react"
const noteFormSchema = z.object({
  note: z.string().nonempty("Enter title"),
})
type noteFormType = z.infer<typeof noteFormSchema>
const NoteTitleInput = () => {
  // const [getNote, { isLoading }] = useGetNoteMutation({
  //   fixedCacheKey: "get-note-data",
  // })
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<noteFormType>({
    resolver: zodResolver(noteFormSchema),
    values: { note: searchParams.get("t") || "" },
  })
  const noteTitle = watch("note")
  // const { data } = useGetNoteDataQuery(noteTitle, { skip: !Boolean(noteTitle) })
  // console.log({ data }, "note title data")
  const onNoteSubmit = async (formData: noteFormType) => {
    // try {
    //   const result = await getNote(formData.note).unwrap()
    //   console.log({ formData, result })
    //   if (result.statusCode === 200) {
    //     const { title, content } = result?.data
    //     onNoteResult({
    //       title,
    //       content,
    //     })
    //     searchParams.set("t", title)
    //   }
    // } catch (err) {
    //   console.log({ err })
    // }
    searchParams.set("t", formData.note)
    setSearchParams(searchParams)
  }
  useEffect(() => {
    console.log({ noteTitle })
    if (noteTitle.length === 0) {
      searchParams.delete("t")
      setSearchParams(searchParams)
    }
  }, [noteTitle])
  return (
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
          <p className="absolute -bottom-[18px] px-1 text-xs text-red-600">
            {errors?.note.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="secondary" title="Submit">
        <SendIcon
          className="pr-1 rotate-45"
          // className="block sm:hidden"
        />
        {/* <span className="hidden sm:block">Submit</span> */}
      </Button>
      {/* <Button title="Remove title" type="submit" variant="secondary">
        <Eraser
        // className="block sm:hidden"
        />
      </Button> */}
      <div className="hidden sm:block">
        <PresetShare />
      </div>
    </form>
  )
}

export default NoteTitleInput
