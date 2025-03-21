import { zodResolver } from "@hookform/resolvers/zod"
import {
  AtSign,
  Globe,
  IndianRupee,
  LocateFixed,
  MessageSquare,
  PhoneOutgoing,
  Save,
  Share2,
  Wifi
} from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { SidebarTrigger } from "@/components/AppSidebar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, RenderIcon } from "@/lib/utils"
import { animated, useSpring } from "@react-spring/web"
import { useGesture } from "@use-gesture/react"
import { AiOutlineWhatsApp } from "react-icons/ai"
import Sidebar from "../Notes/components/Sidebar"
import QRInput from "./components/QRInput"
import QRLayout from "./QRLayout"
import { getContrastRatio, isColorTooDark } from "./utils"

const linkTypesConfig = {
  url: {
    label: "Website URL",
    icon: <Globe className="w-4 h-4" />, // Website icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/globe.png",
    inputs: [{ label: "URL", name: "url", type: "url", required: true }],
  },
  tel: {
    label: "Phone Call",
    icon: <PhoneOutgoing className="w-4 h-4" />, // Phone icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/phone.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
    ],
  },
  sms: {
    label: "SMS",
    icon: <MessageSquare className="w-4 h-4" />, // SMS icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/sms.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
      { label: "Message", name: "body", type: "text", required: false },
    ],
  },
  mailto: {
    label: "Email",
    icon: <AtSign className="w-4 h-4" />, // Email icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/email.png",
    inputs: [
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Subject", name: "subject", type: "text", required: false },
      { label: "Body", name: "body", type: "text", required: false },
    ],
  },
  whatsapp: {
    label: "WhatsApp",
    icon: <AiOutlineWhatsApp className="w-4 h-4" />, // WhatsApp icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/whatsapp.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
      { label: "Message", name: "text", type: "text", required: false },
    ],
  },
  upi: {
    label: "UPI Payment",
    icon: <IndianRupee className="w-4 h-4" />, // UPI icon from UXWing
    iconUrl:"https://img.icons8.com/ios/452/bhim.png",
    inputs: [
      { label: "UPI ID", name: "pa", type: "text", required: true },
      { label: "Payee Name", name: "pn", type: "text", required: true },
      { label: "Merchant Code", name: "mc", type: "text", required: false },
      { label: "Transaction ID", name: "tid", type: "text", required: false },
      {
        label: "Transaction Ref ID",
        name: "tr",
        type: "text",
        required: false,
      },
      { label: "Transaction Note", name: "tn", type: "text", required: false },
      { label: "Amount", name: "am", type: "number", required: false },
      {
        label: "Currency",
        name: "cu",
        type: "text",
        required: false,
        default: "INR",
      },
    ],
  },
  wifi: {
    label: "Wi-Fi",
    icon: <Wifi className="w-4 h-4" />, // Wi-Fi icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/wifi.png",
    inputs: [
      { label: "SSID", name: "ssid", type: "text", required: true },
      { label: "Password", name: "password", type: "text", required: false },
      {
        label: "Encryption",
        name: "encryption",
        type: "text",
        required: false,
      },
    ],
  },
  geo: {
    label: "Geo Location",
    icon: <LocateFixed className="w-4 h-4" />, // Geo Location icon from Icons8
    iconUrl:"https://img.icons8.com/ios/452/marker.png",
    inputs: [
      { label: "Latitude", name: "lat", type: "number", required: true },
      { label: "Longitude", name: "lng", type: "number", required: true },
    ],
  },
}

// Zod Schema Generator
const generateZodSchema = (fields: any[]) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  fields.forEach((field) => {
    let validator: z.ZodTypeAny
    if (field.required) {
      if (field.type === "email") {
        validator = z
          .string()
          .email("Invalid email")
          .min(1, `${field.label} is required`)
      } else if (field.type === "tel") {
        validator = z
          .string()
          .regex(/^[6-9]\d{9}$/, "Invalid phone number")
          .min(1, `${field.label} is required`)
      } else if (field.type === "number") {
        validator = z.coerce.number()
      } else {
        validator = z.string().min(1, `${field.label} is required`)
      }
    } else {
      validator =
        field.type === "number"
          ? z.coerce.number().optional()
          : z.string().optional()
    }
    shape[field.name] = validator
  })

  return z.object(shape)
}

// import "./styles.css"
const noteFormSchema = z.object({
  note: z.string().nonempty("Enter text"),
})
type noteFormType = z.infer<typeof noteFormSchema>
const Qrcode = () => {
  const [{ scale, x, y }, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }))
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const canvasGradientRef = useRef<HTMLCanvasElement>(null)
  const [selectedFgColor, setSelectedFgColor] = useState("#000000")
  const [selectedBackColor, setSelectedBackColor] = useState("#ffffff")

  const [logoBorderRadius, setLogoBorderRadius] = useState(0)
  const [logoBgColor, setLogoBgColor] = useState("#ffffff")
  const [overlayText, setOverlayText] = useState("")
  const [imagePath, setImagePath] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const [activeBorder, setActiveBorder] = useState(false)

  const [currentTab, setCurrentTab] = useState("")

  const [open, setOpen] = useState(false)
  const [linkType, setLinkType] = useState<keyof typeof linkTypesConfig | null>(
    null,
  )
  const linkTypes = useMemo(
    () =>
      Object.entries(linkTypesConfig).map(([value, { label, icon }]) => ({
        value,
        label,
        icon,
      })),
    [],
  )
  const fields:{
    label: string;
    icon: JSX.Element;
    iconUrl?:string;
    inputs: {
        label: string;
        name: string;
        type: string;
        required: boolean;
    }[];
} | null  = useMemo(
    () => (linkType ? linkTypesConfig[linkType] : null),
    [linkType],
  )
  const schema = useMemo(
    () => (fields?.inputs.length ? generateZodSchema(fields.inputs) : z.object({})),
    [fields?.inputs],
  )
  console.log({ open, linkType, fields, schema })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const [imageSize, setImageSize] = useState(64)
  const [textColor, setTextColor] = useState("#000000")
  const [searchParams, setSearchParams] = useSearchParams()
  const form = useForm<noteFormType>({
    resolver: zodResolver(noteFormSchema),
    values: { note: searchParams.get("t") || "" },
  })
  const qrText = form.watch("note")
  const submittedValue = searchParams.get("t")
  const onNoteSubmit = async (formData: noteFormType) => {
    searchParams.set("t", formData.note)
    setSearchParams(searchParams)
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
  const handleDownload = () => {
    if (svgRef.current) {
      // Create a Blob from the SVG XML
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })

      // Create a download link and trigger download
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "qrcode.svg"
      link.click()
      URL.revokeObjectURL(link.href) // Clean up the URL
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
  const handleInputFocus = () => {
    form.setFocus("note")
  }
  const handleBackColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value
    if (isColorTooDark(selectedColor)) {
      alert("Please select a lighter color.")
    } else {
      const contrastRatio = getContrastRatio(selectedFgColor, selectedColor)

      if (contrastRatio < 3) {
        alert(
          "Contrast ratio is too low! Please select a color with higher contrast.",
        )
      } else {
        setSelectedBackColor(selectedColor)
      }
    }
  }
  const handleFgColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value
    const contrastRatio = getContrastRatio(selectedBackColor, selectedColor)

    if (contrastRatio < 3) {
      alert(
        "Contrast ratio is too low! Please select a color with higher contrast.",
      )
    } else {
      setSelectedFgColor(selectedColor)
    }
  }
  const handleLogoBgColor = (e: ChangeEvent<HTMLInputElement>) => {
    const currentBgColor = e.target.value
    const contrastRatio = getContrastRatio(currentBgColor, textColor)

    if (contrastRatio < 3) {
      alert(
        "Contrast ratio is too low! Please select a color with higher contrast.",
      )
    } else {
      setLogoBgColor(currentBgColor)

      generateTextImage({
        text: overlayText,
        color: textColor,
        size: imageSize,
        logoBgColor: currentBgColor,
        borderRadius: logoBorderRadius,
      })
    }
  }
  const handleTextColor = (e: ChangeEvent<HTMLInputElement>) => {
    const currentColor = e.target.value
    const contrastRatio = getContrastRatio(currentColor, logoBgColor)

    if (contrastRatio < 3) {
      alert(
        "Contrast ratio is too low! Please select a color with higher contrast.",
      )
    } else {
      setTextColor(currentColor)
      generateTextImage({
        text: overlayText,
        color: currentColor,
        size: imageSize,
        logoBgColor,
        borderRadius: logoBorderRadius,
      })
    }
  }
  const generateTextImage = ({
    text,
    color,
    size,
    logoBgColor,
    borderRadius,
  }: {
    text: string
    color: string
    size: number
    logoBgColor: string
    borderRadius: number
  }): void => {
    const canvas = document.createElement("canvas")
    // const size = imageSize // Adjusted size for the text image
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.fillStyle = logoBgColor // Background color
      // ctx.roundRect(size, size, size, size, 10)

      // Draw a rounded rectangle if the roundRect method is available
      if (activeBorder && ctx.roundRect) {
        const padding = size * 0.1 // Padding from the canvas edge
        ctx.beginPath()
        ctx.roundRect(
          padding, // x position
          padding, // y position
          size - padding * 2, // width
          size - padding * 2, // height
          borderRadius, // Corner radius
        )
        ctx.fill()
        console.log("round")
      } else {
        // Fallback: draw a standard rectangle if roundRect is not available
        ctx.fillRect(0, 0, size, size)
      }
      // ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = color // Text color
      ctx.font = `bold ${size / 4}px Arial` // Font size and style
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, size / 2, size / 2)
    }

    setImagePreview(canvas.toDataURL("image/png"))
  }

  // Generate text image whenever overlayText changes
  // useEffect(() => {
  //   const textImage = generateTextImage(overlayText)
  //   setTextImagePath(textImage)
  // }, [overlayText])

  useEffect(() => {
    console.log({ qrText })
    if (qrText.length === 0) {
      searchParams.delete("t")
      setSearchParams(searchParams)
    }
    
  }, [qrText])

  useEffect(() => {
    if (canvasGradientRef.current) {
      const canvas = canvasGradientRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Set the gradient as background
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        )
        gradient.addColorStop(0, "#ff7e5f") // Start color
        gradient.addColorStop(1, "#feb47b") // End color

        // Fill the canvas with gradient
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw the QR code on top of the gradient
        const qrCodeCanvas = document.querySelector(
          "#canvasG",
        ) as HTMLCanvasElement
        if (qrCodeCanvas) {
          ctx.drawImage(qrCodeCanvas, 0, 0)
        }
      }
    }
  }, [])

  // Gesture handling for pan and zoom
  useGesture(
    {
      // Handling drag movement
      onDrag: ({ offset: [dx, dy] }) => {
        api.start({ x: dx, y: dy })
      },
      // Handling pinch zoom
      onPinch: ({ offset: [d] }) => {
        api.start({ scale: 1 + d / 50 })
      },
    },
    {
      target: wrapperRef,
      // Setting initial values and limits for gestures
      drag: { from: () => [x.get(), y.get()] },
      pinch: {
        scaleBounds: { min: 1, max: 4 },
        // from: () => [scale.get(), scale.get()],
      },
    },
  )
  const onSubmit = (data: any) => {
    let url = ""

    switch (linkType) {
      case "mailto":
        url = `mailto:${data.email}`
        const mailParams = new URLSearchParams()
        if (data.subject) mailParams.append("subject", data.subject)
        if (data.body) mailParams.append("body", data.body)
        if (mailParams.toString()) url += `?${mailParams.toString()}`
        break

      case "tel":
        url = `tel:${data.phone}`
        break

      case "sms":
        url = `sms:${data.phone}`
        if (data.body) url += `?body=${encodeURIComponent(data.body)}`
        break

      case "whatsapp":
        url = `https://wa.me/${data.phone}`
        if (data.text) url += `?text=${encodeURIComponent(data.text)}`
        break

      case "upi":
        url = `upi://pay?`
        const upiParams = new URLSearchParams()
        Object.entries(data).forEach(([key, value]) => {
          if (value && typeof value === "string") upiParams.append(key, value)
        })
        url += upiParams.toString()
        break

      case "wifi":
        url = `WIFI:S:${data.ssid};T:${data.encryption || ""};P:${
          data.password || ""
        };;`
        break

      case "geo":
        url = `geo:${data.lat},${data.lng}`
        break

      case "url":
        url = data.url.startsWith("http") ? data.url : `https://${data.url}`
        break

      default:
        console.warn("Unknown link type")
        break
    }

    console.log("Generated Link:", {url,fields})
    if(fields?.iconUrl){
      setImagePath(fields?.iconUrl);
      setImagePreview(fields.iconUrl);
      setCurrentTab("logo")
    }

    form.setValue("note", url)
    reset()
    setOpen(false)
  }

  return (
    <QRLayout>
      <div className="">
        <div className="app-h-screen flex-col flex">
          <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
            {/* <h2 className="text-lg font-semibold">Playground</h2> */}
            {/* <PresetSelector presets={presets}  /> */}
            <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
              <Sidebar />
              <QRInput form={form} onNoteSubmit={onNoteSubmit} onChange={()=>{
                setLinkType(null)
              }} />
            </div>
          </div>
          <Separator />
          <div className="flex h-full  ">
            <ResizablePanelGroup
              direction="horizontal"
              className="flex  h-full "
            >
              <ResizablePanel
                id="qrCanvas"
                className="flex-[3]  h-full"
                minSize={70}
                
              >
                <SidebarTrigger className="m-2 p-2 absolute hover:bg-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-900 z-10" />
                <div className="flex-[3] overflow-hidden bg-gray-100 dark:bg-gray-900 h-full">
                  <Dialog
                    open={open}
                    onOpenChange={(o) => {
                      if (!o) reset()
                      setOpen(o)
                    }}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Create {linkType?.toUpperCase()} Link
                        </DialogTitle>
                        <DialogDescription>
                          Fill the form below to generate your dynamic link and
                          QR code.
                        </DialogDescription>
                      </DialogHeader>

                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {fields?.inputs.map((field) => (
                          <div key={field.name}>
                            <Input
                              placeholder={field.label}
                              {...register(field.name)}
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-xs">
                                {errors[field.name]?.message as string}
                              </p>
                            )}
                          </div>
                        ))}
                        <DialogFooter>
                          <Button type="submit" className="w-full">
                            Generate Link
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <div
                    className={cn(
                      // "absolute inset-0 flex flex-col",
                      "flex-[3]  flex justify-center items-center flex-col h-full relative",
                      "[background-size:20px_20px]",
                      "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                      "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                    )}
                  >
                    <div className="w-full">
                    <ScrollArea>
                      <div className="ml-10 flex w-max space-x-1 p-4 ">
                        {linkTypes.map((item) => {
                          return (
                            <button
                              onClick={() => {
                                setOpen(true)
                                setLinkType(item.value as any)
                              }}
                              type="button"
                              key={item.value}
                              className={`shadow-indigo-500/50 bg-white  text-gray-800 text-xs font-medium  px-2.5 py-1 rounded-full  dark:text-gray-300 flex gap-1 items-center border dark:border ${
                                item.value === linkType
                                  ? "dark:border-gray-50 border-gray-600"
                                  : ""
                              }`}
                            >
                              <RenderIcon icon={item.icon} />
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                    <animated.div
                      ref={wrapperRef}
                      className="flex-[3]  flex justify-center items-center flex-col h-full relative"
                      style={{
                        x,
                        y,
                        scale,
                        touchAction: "none",
                      }}
                    >
                      {qrText ? (
                        <div className="flex flex-col">
                          <div className="relative">
                            <QRCodeCanvas
                              value={qrText}
                              size={356}
                              ref={canvasRef}
                              className={`border rounded-sm`}
                              style={{ borderColor: selectedFgColor }}
                              marginSize={2}
                              fgColor={selectedFgColor}
                              bgColor={selectedBackColor}
                              title="Build by anurag"
                              imageSettings={{
                                src: imagePreview, // Replace with your logo URL
                                //   src: getRoundedLogo(imagePath, 64, 64), // Replace with your logo URL
                                height: imageSize, // Height of the logo
                                width: imageSize, // Width of the logo
                                excavate: true, // This option clears the area where the logo is placed so it's more readable
                              }}
                            />
                            {/* <canvas
                      id="canvasG"
                      ref={canvasGradientRef}
                      width={356}
                      height={356}
                      className="absolute top-0 mix-blend-screen"
                    /> */}

                            {/* <img
                    src="https://static.vecteezy.com/system/resources/previews/009/481/029/non_2x/geometric-icon-logo-geometric-abstract-element-free-vector.jpg" // Replace with your logo URL
                    alt="Logo"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "164px",
                      height: "164px", // Set the size of the logo
                      borderRadius: "50%", // Optional: make the logo circular
                    }}
                  /> */}
                          </div>

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
                          </div>
                        </div>
                      ) : (
                        <button onClick={handleInputFocus}>
                          Enter text to generate QR code{" "}
                        </button>
                      )}
                    </animated.div>
                  </div>
                </div>
              </ResizablePanel>
              {qrText && (
                <>
                  <ResizableHandle
                    withHandle
                    // iconClass="bg-gray-300"
                    className="bg-gray-500"
                  />
                  <ResizablePanel minSize={15} id="qrOptions">
                    <div className="flex-1 flex-col border-l hidden md:flex">
                      <div className="flex flex-col  mb-4 divide-y text-sm">
                        <div className="flex items-center gap-3 p-4">
                          <label
                            htmlFor="bgColor"
                            className="whitespace-nowrap"
                          >
                            View Size
                          </label>
                          <Slider
                            min={20}
                            max={70}
                            //   value={}
                            onValueChange={(e) => {
                              console.log(e, "currentTarget")
                              api.start({ scale: 1 + e[0] / 50 })
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-3 p-2 px-4">
                          <label htmlFor="bgColor">Back Ground color</label>
                          <input
                            id="bgColor"
                            type="color"
                            title="Change QR color"
                            className="w-10 h-10"
                            value={selectedBackColor}
                            onChange={handleBackColor}
                          />
                        </div>
                        <div className="flex items-center gap-3 p-1 px-4">
                          <label htmlFor="fgColor">Fore Ground color</label>
                          <input
                            id="fgColor"
                            type="color"
                            title="Change QR color"
                            className="w-10 h-10"
                            value={selectedFgColor}
                            onChange={handleFgColor}
                          />
                        </div>
                        <div className="p-2">
                          <div className="flex items-center gap-3 px-4 py-4">
                            <label
                              htmlFor="imagePath"
                              className="whitespace-nowrap"
                            >
                              Logo size
                            </label>
                            <Slider
                              min={20}
                              max={70}
                              value={[imageSize]}
                              onValueChange={(e) => {
                                console.log(e, "currentTarget")
                                const currentSize = e[0]
                                setImageSize(currentSize)
                                generateTextImage({
                                  text: overlayText,
                                  color: textColor,
                                  size: currentSize,
                                  logoBgColor,
                                  borderRadius: logoBorderRadius,
                                })
                              }}
                            />
                            <div>{(imageSize / 20).toFixed(1)}</div>
                          </div>
                          <Tabs defaultValue="account" value={currentTab}>
                            <TabsList className="w-full">
                              <TabsTrigger value="text" className="w-full">
                                Logo text
                              </TabsTrigger>
                              <TabsTrigger value="logo" className="w-full">
                                Logo link
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="text">
                              <div className="flex items-center gap-3 p-2 px-4">
                                <label
                                  htmlFor="imageText"
                                  className="whitespace-nowrap"
                                >
                                  Logo Text
                                </label>
                                <Input
                                  id="imageText"
                                  type="text"
                                  title="Enter logo text"
                                  className=" "
                                  placeholder="Enter logo text"
                                  value={overlayText}
                                  onChange={(e) => {
                                    const currentText = e.target.value
                                    setOverlayText(currentText)
                                    generateTextImage({
                                      text: currentText,
                                      color: textColor,
                                      size: imageSize,
                                      logoBgColor,
                                      borderRadius: logoBorderRadius,
                                    })
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-3 p-2 px-4">
                                <label
                                  htmlFor="imageColor"
                                  className="whitespace-nowrap"
                                >
                                  Logo Color
                                </label>
                                <Input
                                  id="imageColor"
                                  type="color"
                                  title="Enter logo color"
                                  className=""
                                  placeholder="Enter logo color"
                                  value={textColor}
                                  onChange={handleTextColor}
                                />
                              </div>
                              <div className="flex items-center gap-3 p-2 px-4">
                                <label
                                  htmlFor="imageColor"
                                  className="whitespace-nowrap"
                                >
                                  Logo Bg Color
                                </label>
                                <Input
                                  id="imageColor"
                                  type="color"
                                  title="Enter logo color"
                                  className=""
                                  placeholder="Enter logo color"
                                  value={logoBgColor}
                                  onChange={handleLogoBgColor}
                                />
                              </div>
                              <div className="flex flex-col  gap-3 px-4 py-4">
                                <div className="flex justify-between">
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id="logoRadius"
                                      checked={activeBorder}
                                      onCheckedChange={(e) => {
                                        setActiveBorder(Boolean(e))
                                      }}
                                    />
                                    <label
                                      htmlFor="logoRadius"
                                      className="whitespace-nowrap"
                                    >
                                      Logo border radius
                                    </label>
                                  </div>
                                  {activeBorder && (
                                    <div>
                                      {(logoBorderRadius / 20).toFixed(1)}
                                    </div>
                                  )}
                                </div>
                                <div className="relative flex gap-3">
                                  <Slider
                                    disabled={!activeBorder}
                                    min={20}
                                    max={70}
                                    value={[logoBorderRadius]}
                                    onValueChange={(e) => {
                                      console.log(e, "currentTarget")
                                      const currentSize = e[0]
                                      setLogoBorderRadius(currentSize)
                                      generateTextImage({
                                        text: overlayText,
                                        color: textColor,
                                        size: currentSize,
                                        logoBgColor,
                                        borderRadius: currentSize,
                                      })
                                    }}
                                  />
                                  {!activeBorder && (
                                    <div className="bg-gray-50 w-full h-[100%] absolute -top-1 opacity-40 "></div>
                                  )}
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="logo">
                              <div className="flex items-center gap-3 p-2 px-4">
                                <label
                                  htmlFor="imagePath"
                                  className="whitespace-nowrap"
                                >
                                  Logo Link
                                </label>
                                <Input
                                  id="imagePath"
                                  type="url"
                                  title="Paste logo link"
                                  className=" "
                                  placeholder="Paste logo link"
                                  value={imagePath}
                                  onChange={(e) => {
                                    const imageLink = e.target.value
                                    setImagePath(imageLink)
                                    setImagePreview(imageLink)
                                  }}
                                />
                              </div>
                              {/* {imagePath && (
                          <div className="flex items-center gap-3 px-4 py-2">
                            <label
                              htmlFor="imagePath"
                              className="whitespace-nowrap"
                            >
                              Logo size
                            </label>
                            <Slider
                              min={20}
                              max={70}
                              onValueChange={(e) => {
                                console.log(e, "currentTarget")
                                setImageSize(e[0])
                              }}
                            />
                            <div>{(imageSize / 20).toFixed(1)}</div>
                          </div>
                        )} */}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                      {/* <h2>
                Submitted text <u>{submittedValue}</u>
              </h2>
              {submittedValue && (
                <div className="flex flex-col ">
                  <QRCodeSVG
                    value={submittedValue}
                    size={356}
                    className="border"
                    marginSize={2}
                    level="H"
                    ref={svgRef}
                  />
                  <div className="mt-2 flex gap-2 mx-auto">
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      className="p-0 w-24"
                    >
                      <Share2 className="my-4 mr-2" /> SVG
                    </Button>
                  </div>
                </div>
              )} */}
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </QRLayout>
  )
}

export default Qrcode
