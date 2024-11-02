import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "react-router-dom"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { Save, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import Sidebar from "../Notes/components/Sidebar"
import QRInput from "./components/QRInput"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import GradientQRCodeDownload from "./GradientQR"
import QRCodeScanner from "./QRCodeScanner"
import QRLayout from "./QRLayout"
import { SidebarTrigger } from "@/components/AppSidebar"
import { getContrastRatio, isColorTooDark } from "./utils"
import { useGesture } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"

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
  const [imagePath, setImagePath] = useState("")
  const [imageSize, setImageSize] = useState(64)
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
  return (
    <QRLayout>
      <div className="">
        <div className="app-h-screen flex-col flex">
          <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
            {/* <h2 className="text-lg font-semibold">Playground</h2> */}
            {/* <PresetSelector presets={presets}  /> */}
            <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full">
              <Sidebar />
              <QRInput form={form} onNoteSubmit={onNoteSubmit} />
            </div>
          </div>
          <Separator />
          <div className="flex h-full  ">
            <SidebarTrigger className="m-2 p-2 absolute hover:bg-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-900" />
            <div className="flex-[3] overflow-hidden bg-gray-100 dark:bg-gray-900">
              <animated.div
                ref={wrapperRef}
                className="flex-[3]  flex justify-center items-center flex-col h-full"
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
                        title="Buit by anurag"
                        imageSettings={{
                          src: imagePath, // Replace with your logo URL
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
            {qrText && (
              <div className="flex-1 flex flex-col border-l">
                <div className="flex flex-col  mb-4 divide-y text-sm">
                  <div className="flex items-center gap-3 p-4">
                    <label htmlFor="bgColor" className="whitespace-nowrap">
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
                  <div className="flex items-center gap-3 p-2 px-4">
                    <label htmlFor="imagePath" className="whitespace-nowrap">
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
                        setImagePath(e.target.value)
                      }}
                    />
                  </div>
                  {imagePath && (
                    <div className="flex items-center gap-3 ppx-4">
                      <label htmlFor="imagePath" className="whitespace-nowrap">
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
                  )}
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
            )}
          </div>
        </div>
      </div>
    </QRLayout>
  )
}

export default Qrcode
