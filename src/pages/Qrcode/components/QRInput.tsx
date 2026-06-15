import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendIcon } from "lucide-react"
import { useForm, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { useSearchParams } from "react-router-dom"
import { Eraser } from "lucide-react"
import { PresetShare } from "@/pages/Notes/components/preset-share"
const noteFormSchema = z.object({
  note: z.string().nonempty("Enter text"),
})
type noteFormType = z.infer<typeof noteFormSchema>
type QRInputType = {
  form: UseFormReturn<
    {
      note: string
    },
    any,
    undefined
  >
  onNoteSubmit: (formData: noteFormType) => Promise<void>
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const QRInput = ({ form, onNoteSubmit, onChange }: QRInputType) => {
  const qrText = form.watch("note")
  return (
    <form
      className="flex w-full space-x-2 "
      onSubmit={form.handleSubmit(onNoteSubmit)}
    >
      <div className="w-full relative">
        <Input
          type="text"
          placeholder="Enter text to generate QR Code..."
          className=" w-full"
          {...form.register("note", { onChange: onChange })}
        />
        {form.formState.errors?.note && (
          <p className="absolute -bottom-[18px] px-1 text-xs text-red-600">
            {form.formState.errors?.note.message}
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

      <div className="hidden sm:block">
        <PresetShare />
      </div>
    </form>
  )
}

export default QRInput
