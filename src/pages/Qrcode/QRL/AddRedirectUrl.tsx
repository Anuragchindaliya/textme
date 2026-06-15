// src/pages/AddRedirectUrl.tsx
import React, { useEffect, useMemo, useRef, useState } from "react"
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
import { QRCodeCanvas } from "qrcode.react"
import { Edit, ExternalLink, Save, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import EditQRL from "./EditQRL"
import Sidebar from "@/pages/Notes/components/Sidebar"

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
    reset,
  } = useForm<AddRedirectUrlFormData>({
    resolver: zodResolver(AddRedirectUrlSchema),
    // mode: "onBlur",
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [editModal, setEditModal] = useState(false)
  const [addRedirect, { isLoading: isAddingURL }] = useAddRedirectMutation()
  const { toast } = useToast()
  const {
    isLoading: isLoadingList,
    data: dataList,
    refetch,
    isFetching,
  } = useGetQrDataListQuery()
  const [selectedItem, setSelectedItem] = useState<DynamicQrItemType>()
  useEffect(() => {
    if (dataList?.length) {
      setSelectedItem(dataList.at(-1))
    }
  }, [isFetching, dataList?.length])

  const baseLink = useMemo(() => {
    return `${window.location.origin}/qrl?url=${selectedItem?.key}`
  }, [selectedItem])
  console.log({ baseLink })
  console.log(window.location)

  const onSubmit = async (data: AddRedirectUrlFormData) => {
    if (dataList?.some((item) => item.key === data.key)) {
      setError("key", {
        message: "Key is already exist",
      })
      return
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

  const handleSave = () => {
    const canvas = canvasRef.current
    console.log("canvas ele,emt", canvas)
    if (canvas) {
      const imgData = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = imgData
      link.download = "qrcode.png"
      link.click()
      console.log("check canvas")
    }
  }
  // Share functionality
  const handleShare = () => {
    const canvas = canvasRef.current

    if (navigator.share && canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "qrcode.png", { type: "image/png" })
          navigator
            .share({
              title: "Check out this QR Code!",
              text: "Here is a QR code to share!",
              files: [file],
            })
            .then(() => console.log("QR Code shared successfully!"))
            .catch((error) => console.error("Error sharing QR Code:", error))
        }
      })
    } else {
      alert("Your browser does not support sharing files.")
    }
  }

  return (
    <QRLayout>
      <div className="relative">
        <div className="pl-4 py-2">
          <Sidebar />
        </div>
        <div className="flex  h-screen">
          <div className="sm:w-3/6 px-4 w-full ">
            <div className=" flex items-center">
              <SidebarTrigger className=" " />
              <h1>Recently Createddsd</h1>
            </div>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="flex flex-col gap-4 py-4 h-full">
                {isLoadingList ? (
                  <div className="h-full flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : dataList?.length === 0 ? (
                  <div>No Data Found</div>
                ) : (
                  dataList
                    ?.toSorted((a, b) => +b.created_at - +a.created_at)
                    ?.map((item) => (
                      <button
                        key={item.id}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent",
                          selectedItem?.id === item.id && "bg-muted",
                        )}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex w-full flex-col gap-1">
                          <div className="flex items-center">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-lg">
                                {item.key}
                              </div>
                              {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                            </div>
                            {item?.created_at && (
                              <div
                                className={cn(
                                  "ml-auto text-xs",
                                  selectedItem?.id === item.id
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {formatDistanceToNow(
                                  new Date(+item?.created_at * 1000),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </div>
                            )}
                          </div>
                          <div className=" font-medium">{item.url}</div>
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
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="container mx-auto p-6 hidden sm:flex flex-col ">
            <div className="flex-1">
              <h2 className="text-xl font-bold m-4 ">Add Redirect URL</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-x-4 flex  border-b pb-4"
              >
                <div className="flex-1">
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    {...register("key")}
                    placeholder="Unique Key"
                  />
                  {errors.key && (
                    <p className="text-red-500">{errors.key.message}</p>
                  )}
                </div>
                <div className="flex-[2]">
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
                <Button
                  type="submit"
                  disabled={isLoadingList}
                  className="w-32 mt-6"
                >
                  {isAddingURL ? "Submitting..." : "Add Redirect"}
                </Button>
              </form>
            </div>
            <div className="flex-[4] mt-4 flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all ">
              {selectedItem && (
                <>
                  <h2 className="text-3xl font-bold capitalize">
                    {selectedItem?.key}
                  </h2>
                  <div>{selectedItem?.url}</div>
                  <div>
                    <QRCodeCanvas
                      value={baseLink}
                      size={356}
                      ref={canvasRef}
                      className={`border rounded-sm`}
                      marginSize={2}
                      title="Build by anurag"
                    />
                  </div>
                  <Link to={baseLink} className="flex">
                    {" "}
                    {baseLink} <ExternalLink className="w-5 h-5 ml-1" />
                  </Link>

                  <div className="mt-2 flex gap-2 mx-auto">
                    <Button
                      variant="secondary"
                      className="p-0 w-10"
                      onClick={handleShare}
                    >
                      <Share2 />
                    </Button>
                    <Button
                      variant="secondary"
                      className="p-0 w-10"
                      onClick={handleSave}
                    >
                      <Save />
                    </Button>
                    <Button
                      variant="secondary"
                      className="p-0 w-10"
                      onClick={() => {
                        setEditModal(true)
                      }}
                    >
                      <Edit />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={editModal}
        onOpenChange={() => {
          setEditModal((b) => !b)
        }}
      >
        <DialogContent className="md:max-w-2xl">
          {selectedItem && (
            <EditQRL
              defaultValues={selectedItem}
              onSuccess={() => {
                setEditModal(false)
                refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </QRLayout>
  )
}

export default AddRedirectUrl
