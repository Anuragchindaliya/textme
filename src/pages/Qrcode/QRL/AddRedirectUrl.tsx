// src/pages/AddRedirectUrl.tsx
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import {
  DynamicQrItemType,
  useAddRedirectMutation,
  useGetQrDataListQuery,
} from "@/features/qr/qrAPI"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import QRLayout from "../QRLayout"
import { SidebarTrigger } from "@/components/AppSidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import Spinner from "@/components/ui/spinner"

const AddRedirectUrlSchema = z.object({
  key: z.string().min(1, "Key is required"),
  url: z.string().url("Invalid URL format"),
})

type AddRedirectUrlFormData = z.infer<typeof AddRedirectUrlSchema>

const AddRedirectUrl: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<AddRedirectUrlFormData>({
    resolver: zodResolver(AddRedirectUrlSchema),
    // mode: "onBlur",
  })
  const [addRedirect, { isLoading: isAddingURL }] = useAddRedirectMutation()
  const { toast } = useToast()
  const { isLoading:isLoadingList, data:dataList,refetch } = useGetQrDataListQuery()
  const [selectedItem, setSelectedItem] = useState<DynamicQrItemType>()

  const onSubmit = async (data: AddRedirectUrlFormData) => {
    if(dataList?.some(item=>item.key === data.key)){
      setError("key",{
        message:"Key is already exist"
      })
      return;
    }
    try {
      const result = await addRedirect(data).unwrap()
      if (result.created) {
        reset()
        refetch()
        toast({
          title: "Success",
          description: "Redirect URL added successfully!",
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add redirect URL." })
    }
  }

  return (
    <QRLayout>
      <div className="relative">
        <SidebarTrigger className="absolute left-1 top-1" />
        <div className="flex">
          <div className="container mx-auto p-6">
            <h2 className="text-xl font-bold m-4 ">Add Redirect URL</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="key">Key</Label>
                <Input id="key" {...register("key")} placeholder="Unique Key" />
                {errors.key && (
                  <p className="text-red-500">{errors.key.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="redirectUrl">Redirect URL</Label>
                <Input
                  id="redirectUrl"
                  type="url"
                  {...register("url")}
                  placeholder="https://example.com"
                />
                {errors.url && (
                  <p className="text-red-500">{errors.url.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoadingList}>
                {isAddingURL ? "Submitting..." : "Add Redirect"}
              </Button>
            </form>
          </div>
          <div className="w-2/6 px-4 pt-8">
          <h2>Recently Created</h2>
            <ScrollArea className="h-screen">
              <div className="flex flex-col gap-2 py-4 h-full">
                {isLoadingList ? <div className="h-full flex items-center justify-center"><Spinner /></div>:
                dataList?.toSorted((a,b)=>(+b.created_at)-(+a.created_at))?.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      selectedItem?.id === item.id && "bg-muted",
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{item.key}</div>
                          {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                        </div>
                        {item?.created_at && <div
                          className={cn(
                            "ml-auto text-xs",
                            selectedItem?.id === item.id
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatDistanceToNow(new Date(+item?.created_at*1000), {
                            addSuffix: true,
                          })}
                        </div>}
                      </div>
                      <div className="text-xs font-medium">{item.url}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {/* {item.text.substring(0, 300)} */}
                    </div>
                    {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </QRLayout>
  )
}

export default AddRedirectUrl
