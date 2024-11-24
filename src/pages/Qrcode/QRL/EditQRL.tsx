import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DynamicQrItemType,
  useUpdateRedirectUrlMutation,
} from "@/features/qr/qrAPI"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
const AddRedirectUrlSchema = z.object({
  key: z.string().min(1, "Key is required"),
  url: z.string().url("Invalid URL format"),
})

type AddRedirectUrlFormData = z.infer<typeof AddRedirectUrlSchema>
type EditQrlType = {
  defaultValues: DynamicQrItemType
  onSuccess: () => void
}
const EditQRL = ({ defaultValues, onSuccess }: EditQrlType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<AddRedirectUrlFormData>({
    resolver: zodResolver(AddRedirectUrlSchema),
    defaultValues,
    // mode: "onBlur",
  })
  const [updateUrl, { isLoading }] = useUpdateRedirectUrlMutation()
  const onSubmit = async (data: AddRedirectUrlFormData) => {
    try {
      const result = await updateUrl({
        id: defaultValues.id,
        url: data.url,
      }).unwrap()
      if (result.updated) {
        reset()
        toast.success("Redirect URL updated successfully!")
        onSuccess()
      }
    } catch (error) {
      toast.error("Failed to update redirect URL.")
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-x-4 flex pb-4">
        <div className="flex-1">
          <Label htmlFor="key">Key</Label>
          <Input
            id="key"
            {...register("key")}
            placeholder="Unique Key"
            disabled
          />
          {errors.key && <p className="text-red-500">{errors.key.message}</p>}
        </div>
        <div className="flex-[2]">
          <Label htmlFor="redirectUrl">Redirect URL</Label>
          <Input
            id="redirectUrl"
            type="url"
            {...register("url")}
            placeholder="https://example.com"
            disabled={isLoading}
          />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
        </div>
        <Button
          type="submit"
          // disabled={isLoadingList}
          className="w-20 mt-6"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : "Update"}
        </Button>
      </form>
    </div>
  )
}

export default EditQRL
