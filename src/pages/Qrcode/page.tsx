import { zodResolver } from "@hookform/resolvers/zod"
import {
  AtSign,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  FileDown,
  Globe,
  IndianRupee,
  LocateFixed,
  MessageSquare,
  PhoneOutgoing,
  Plus,
  QrCode,
  Save,
  Share2,
  Wifi,
  X,
} from "lucide-react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { z } from "zod"

import { Button, ButtonTooltip } from "@/components/ui/button"
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
import { Menu } from "./components/menu"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "react-toastify"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import jsPDF from "jspdf"
import { svg2pdf } from "svg2pdf.js"

type LinkType = {
  label: string
  icon: JSX.Element
  iconUrl?: string
  inputs: {
    label: string
    name: string
    type: string
    required: boolean
  }[]
}
const linkTypesConfig = {
  url: {
    label: "Website URL",
    icon: <Globe className="w-4 h-4" />, // Website icon from Icons8
    iconUrl: "https://img.icons8.com/ios/452/globe.png",
    inputs: [{ label: "URL", name: "url", type: "url", required: true }],
  },
  tel: {
    label: "Phone Call",
    icon: <PhoneOutgoing className="w-4 h-4" />, // Phone icon from Icons8
    iconUrl: "https://img.icons8.com/ios/452/phone.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
    ],
  },
  sms: {
    label: "SMS",
    icon: <MessageSquare className="w-4 h-4" />, // SMS icon from Icons8
    iconUrl: "https://img.icons8.com/ios/452/sms.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
      { label: "Message", name: "body", type: "text", required: false },
    ],
  },
  mailto: {
    label: "Email",
    icon: <AtSign className="w-4 h-4" />, // Email icon from Icons8
    iconUrl: "https://img.icons8.com/ios/452/email.png",
    inputs: [
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Subject", name: "subject", type: "text", required: false },
      { label: "Body", name: "body", type: "text", required: false },
    ],
  },
  whatsapp: {
    label: "WhatsApp",
    icon: <AiOutlineWhatsApp className="w-4 h-4" />, // WhatsApp icon from Icons8
    iconUrl: "https://img.icons8.com/ios/452/whatsapp.png",
    inputs: [
      { label: "Phone Number", name: "phone", type: "tel", required: true },
      { label: "Message", name: "text", type: "text", required: false },
    ],
  },
  upi: {
    label: "UPI Payment",
    icon: <IndianRupee className="w-4 h-4" />, // UPI icon from UXWing
    iconUrl: "https://img.icons8.com/ios/452/bhim.png",
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
    iconUrl: "https://img.icons8.com/ios/452/wifi.png",
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
    iconUrl: "https://img.icons8.com/ios/452/marker.png",
    inputs: [
      { label: "Latitude", name: "lat", type: "number", required: true },
      { label: "Longitude", name: "lng", type: "number", required: true },
    ],
  },
}
type QRTab = {
  id: string
  label: string
  url?: string
  linkType?: LinkType
}

// Zod Schema Generator
const generateZodSchema = (currentLinkType: any[]) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  currentLinkType.forEach((field) => {
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
const initialTabs = [{ id: `tab-${Date.now()}`, label: "New QR 1" }]

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
  const [rightSidebar, setRightSidebar] = useState(true)
  const [showGrid, setShowGrid] = useLocalStorage<boolean>("showGrid", false)

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

  const currentLinkType: LinkType | null = useMemo(
    () => (linkType ? linkTypesConfig[linkType] : null),
    [linkType],
  )
  const schema = useMemo(
    () =>
      currentLinkType?.inputs.length
        ? generateZodSchema(currentLinkType.inputs)
        : z.object({}),
    [currentLinkType?.inputs],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const [imageSize, setImageSize] = useState(34)
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
    if (canvas) {
      const imgData = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = imgData
      link.download = "qrcode.png"
      link.click()
      console.log("check canvas")
    }
  }
  // Function to copy the QR image to clipboard
  const handleCopyImage = async () => {
    try {
      const canvas = canvasRef.current
      console.log("canvas ele,emt", canvas)

      if (canvas) {
        const imgData = canvas.toDataURL("image/png")
        const response = await fetch(imgData)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new window.ClipboardItem({
            ["image/png"]: blob,
          }),
        ])
        // alert("QR Code copied to clipboard!")
        toast.success("QR Code copied to clipboard!", {
          position: "bottom-right",
        })
      }
    } catch (error) {
      console.error("Failed to copy image", error)
      // alert("Copy failed. Your browser may not support this.")
      toast.error("Copy failed. Your browser may not support this.")
    }
  }
  const handleDownloadSvg = () => {
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
          if (value) {
            if (typeof value === "number") {
              upiParams.append(key, value.toString())
            } else if (typeof value === "string") {
              upiParams.append(key, value)
            }
          }
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

    console.log("Generated Link:", { url, currentLinkType })
    if (currentLinkType?.iconUrl) {
      setImagePath(currentLinkType?.iconUrl)
      setImagePreview(currentLinkType.iconUrl)
      setCurrentTab("logo")
    }
    if (!rightSidebar) {
      setRightSidebar(true)
    }
    form.clearErrors()
    form.setValue("note", url)
    if (currentLinkType) {
      setTabs((tabs) => {
        const updatedTabs = tabs.map((tab) =>
          tab.id === activeTab.id
            ? {
                ...tab,
                label: url,
                url,
                linkType: currentLinkType,
              }
            : tab,
        )
        return updatedTabs
      })
    }
    reset()
    setOpen(false)
  }
  const [tabs, setTabs] = useState<QRTab[]>(initialTabs)
  const [activeTab, setActiveTab] = useState(tabs[0])

  const addNewTab = () => {
    const newId = `tab-${Date.now()}`
    const newTab = {
      id: newId,
      label: `New QR ${tabs.length + 1}`,
    }
    setTabs([...tabs, newTab])
    setActiveTab(newTab)
    form.setValue("note", "")
    form.setFocus("note")
    setLinkType(null)
    setImagePath("")
    setImagePreview("")
  }

  const removeTab = (id: string) => {
    if (tabs.length === 1) {
      return
    }
    const newTabs = tabs.filter((tab) => tab.id !== id)
    setTabs(newTabs)
    if (activeTab.id === id && newTabs.length) {
      const newActiveTab = newTabs[newTabs.length - 1]
      // setActiveTab(newTabs[0].id)
      setActiveTab(newActiveTab)
    }
  }
  const removeAllTab = () => {
    setTabs(initialTabs)
    setActiveTab(initialTabs[0])
    form.setValue("note", "")
  }

  const handleDownloadPDF = async () => {
    const svgElement = svgRef.current
    // const svgElement = canvasRef.current

    if (!svgElement) return

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [300, 300], // Adjust size if needed
    })

    // Render SVG into the PDF
    await svg2pdf(svgElement, pdf, {
      x: 0,
      y: 0,
      width: 300,
      height: 300,
    })

    pdf.save("qr-code.pdf")
  }
  // console.log({ activeTab, tabs })

  return (
    <QRLayout>
      <div className="">
        <div className="app-h-screen flex-col flex">
          <Menu
            onGrid={{
              checked: showGrid,
              onClick: () => {
                setShowGrid(!showGrid)
              },
            }}
          />
          <div className="container pt-0  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
            {/* <h2 className="text-lg font-semibold">Playground</h2> */}
            {/* <PresetSelector presets={presets}  /> */}
            <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
              <Sidebar />
              <QRInput
                form={form}
                onNoteSubmit={onNoteSubmit}
                onChange={(e) => {
                  // console.log({e:e.target.value})
                  setLinkType(null)
                  const updatedTabs = tabs.map((tab, index) =>
                    tab.id === activeTab.id
                      ? {
                          ...tab,
                          label: e.target.value || `New QR ${index + 1}`,
                          url: e.target.value,
                          linkType: undefined,
                        }
                      : tab,
                  )
                  setTabs(updatedTabs)
                  if (!rightSidebar) {
                    setRightSidebar(true)
                  }
                }}
              />
            </div>
          </div>
          <Tabs
            value={activeTab.id}
            onValueChange={(valueId) => {
              console.log({ valueId })
              const newTab = tabs.find((tab) => tab.id === valueId)
              if (newTab) {
                setActiveTab(newTab)
                if (newTab?.linkType?.iconUrl) {
                  setImagePreview(newTab.linkType.iconUrl)
                  setImagePath(newTab.linkType.iconUrl)
                }
              }
              const tabUrl = newTab?.url
              if (tabUrl) {
                form.setValue("note", tabUrl)
              }
            }}
          >
            <div className="flex items-center gap-2 ">
              <TabsList className="bg-muted rounded-none p-0  overflow-x-auto h-auto w-full justify-start divide-x overflow-hidden">
                <div className="overflow-auto">
                  {tabs.map((tab) => (
                    <TooltipProvider key={tab.id}>
                      <Tooltip delayDuration={1000}>
                        <TooltipTrigger>
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="relative p-1 rounded-none"
                            asChild
                          >
                            <div>
                              <div className=" flex items-center">
                                {tab.linkType?.icon || (
                                  <QrCode className="w-4 h-4" />
                                )}
                                <span className="pl-1 text-ellipsis overflow-hidden max-w-52 text-left">
                                  {tab.label}
                                </span>
                              </div>
                              {tabs.length > 1 && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="p-1 w-6 h-6"
                                  // className="absolute right-0 top-1/2 -translate-y-1/2 p-1 w-6 h-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeTab(tab.id)
                                  }}
                                  asChild
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TabsTrigger>
                        </TooltipTrigger>
                        {tab?.url && (
                          <TooltipContent>
                            <p>{tab.url}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                <div className="flex pl-1">
                  {/* {tabs.every((tab) => tab.url) && ( */}
                  <Tooltip>
                    <TooltipTrigger className="m-auto" asChild>
                      <Button
                        onClick={addNewTab}
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6  p-1 "
                      >
                        <Plus className="w-full" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add new QR tab</p>
                    </TooltipContent>
                  </Tooltip>
                  {/* )} */}
                </div>
              </TabsList>
              {tabs.length > 2 && (
                <Button
                  onClick={removeAllTab}
                  variant="ghost"
                  size="sm"
                  className=" w-24 h-7  p-1 rounded-none"
                >
                  <X className="w-4 h-4 mr-1" /> <span>Clear all</span>
                </Button>
              )}
            </div>
            {/* {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex justify-center p-6"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    tab.url,
                  )}`}
                  alt={`${tab.label} QR`}
                  className="border rounded shadow"
                />
              </TabsContent>
            ))} */}
          </Tabs>
          <Separator />
          <div className="flex h-full  ">
            <ResizablePanelGroup
              direction="horizontal"
              className="flex  h-full "
            >
              <ResizablePanel
                id="qrCanvas"
                className="flex-[3]  h-full relative"
                minSize={70}
              >
                <SidebarTrigger className="m-2 p-2 absolute hover:bg-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-900 z-10" />
                <div className="flex-[3] overflow-hidden bg-gray-100 dark:bg-gray-900 h-full">
                  <Dialog
                    open={open}
                    onOpenChange={(o) => {
                      if (!o) {
                        reset()
                        if (!linkType) {
                          setLinkType(null)
                        }
                      }
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
                        {currentLinkType?.inputs.map((field) => (
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
                      showGrid
                        ? [
                            "[background-size:20px_20px]",
                            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                          ]
                        : "",
                    )}
                  >
                    <div className="w-full">
                      <ScrollArea>
                        <div className="ml-10 flex  w-max space-x-1 p-4 ">
                          {linkTypes.map((item) => {
                            return (
                              <button
                                onClick={() => {
                                  setOpen(true)
                                  setLinkType(item.value as any)
                                }}
                                type="button"
                                key={item.value}
                                className={`shadow-indigo-500/50 bg-white dark:bg-gray-800  text-gray-800 text-xs font-medium  px-2.5 py-1 rounded-full  dark:text-gray-300 flex gap-1 items-center border dark:border ${
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
                            <ContextMenu>
                              <ContextMenuTrigger>
                                <QRCodeCanvas
                                  value={qrText}
                                  size={356}
                                  ref={canvasRef}
                                  className={`border rounded-sm`}
                                  style={{
                                    borderColor: selectedFgColor,
                                    cursor: "context-menu",
                                  }}
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
                                    crossOrigin: "anonymous",
                                  }}
                                />
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                <ContextMenuItem onClick={handleSave}>
                                  <Save className="w-5 h-5 mr-2" />
                                  Save Image
                                </ContextMenuItem>
                                <ContextMenuItem onClick={handleCopyImage}>
                                  <Copy className="w-5 h-5 mr-2" />
                                  Copy Image
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>

                          <div className="mt-2 flex gap-2 mx-auto">
                            <ButtonTooltip
                              tooltipContent={"Share QR"}
                              variant="secondary"
                              className="p-0 w-10"
                              onClick={handleShare}
                            >
                              <Share2 />
                            </ButtonTooltip>

                            <ButtonTooltip
                              tooltipContent={"Save QR (.png)"}
                              variant="secondary"
                              className="p-0 w-10"
                              onClick={handleSave}
                            >
                              <Save />
                            </ButtonTooltip>

                            <ButtonTooltip
                              tooltipContent={"Export PDF"}
                              variant="secondary"
                              className="p-0 w-10"
                              onClick={handleDownloadPDF}
                            >
                              <FileDown />
                            </ButtonTooltip>
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
                {qrText && (
                  <Button
                    onClick={() => {
                      setRightSidebar(!rightSidebar)
                    }}
                    variant={"ghost"}
                    className="flex  p-0 px-2 absolute top-0 right-0"
                  >
                    {rightSidebar ? <ChevronsRight /> : <ChevronsLeft />}
                  </Button>
                )}
              </ResizablePanel>
              {qrText && rightSidebar && (
                <>
                  <ResizableHandle
                    withHandle
                    // iconClass="bg-gray-300"
                    className="dark:bg-gray-800"
                  />
                  <ResizablePanel
                    minSize={15}
                    id="qrOptions"
                    className="relative"
                  >
                    <div className="flex-1 flex-col border-l hidden md:flex relative">
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
                          <Tabs
                            defaultValue="account"
                            value={currentTab}
                            onValueChange={setCurrentTab}
                          >
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
                        <div className="p-4">
                          {/* <div className="pb-1">Svg Preview</div> */}
                          <div className="mb-2 flex gap-2 ">
                            <Button
                              onClick={handleDownloadSvg}
                              variant="secondary"
                              className="p-0 w-24"
                            >
                              <Share2 className="my-4 mr-2" /> SVG
                            </Button>
                          </div>
                          {/* <h2>
                          Submitted text{" "}
                          <u className="text-ellipsis whitespace-nowrap w-[200px] inline-block">
                            {submittedValue}
                          </u>
                        </h2> */}
                          {qrText && (
                            <div className="flex flex-col ">
                              <QRCodeSVG
                                value={qrText}
                                size={240}
                                // className="border"
                                marginSize={2}
                                // level="H"
                                ref={svgRef}
                                className={`border rounded-sm`}
                                style={{ borderColor: selectedFgColor }}
                                fgColor={selectedFgColor}
                                bgColor={selectedBackColor}
                                title="Build by anurag"
                                imageSettings={{
                                  src: imagePreview, // Replace with your logo URL
                                  height: imageSize, // Height of the logo
                                  width: imageSize, // Width of the logo
                                  excavate: true, // This option clears the area where the logo is placed so it's more readable
                                  crossOrigin: "anonymous",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
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
