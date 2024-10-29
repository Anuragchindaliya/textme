import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { Save, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import Sidebar from "../Notes/components/Sidebar"
import QRInput from "./components/QRInput"
import { Input } from "@/components/ui/input"

// import "./styles.css"
const noteFormSchema = z.object({
  note: z.string().nonempty("Enter text"),
})
type noteFormType = z.infer<typeof noteFormSchema>
const Qrcode = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFgColor, setSelectedFgColor] = useState("#000000")
  const [selectedBackColor, setSelectedBackColor] = useState("#ffffff")
  const [imagePath, setImagePath] = useState("")
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
  useEffect(() => {
    console.log({ qrText })
    if (qrText.length === 0) {
      searchParams.delete("t")
      setSearchParams(searchParams)
    }
  }, [qrText])
  return (
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
        <div className="flex h-full ">
          <div className="flex-1  flex justify-center items-center flex-col p-">
            <div className="flex flex-col gap-y-4 mb-4">
              <div className="flex items-center gap-3">
                <label htmlFor="bgColor">Back Ground color</label>
                <input
                  id="bgColor"
                  type="color"
                  title="Change QR color"
                  className="w-10 h-10"
                  value={selectedBackColor}
                  onChange={(e) => {
                    setSelectedBackColor(e.target.value)
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="fgColor">Fore Ground color</label>
                <input
                  id="fgColor"
                  type="color"
                  title="Change QR color"
                  className="w-10 h-10"
                  value={selectedFgColor}
                  onChange={(e) => {
                    setSelectedFgColor(e.target.value)
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
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
            </div>
            <h2>
              Live text <u>{qrText}</u>
            </h2>
            {qrText && (
              <div className="flex flex-col ">
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
                    // imageSetting={{
                    //   src: "https://static.vecteezy.com/system/resources/previews/009/481/029/non_2x/geometric-icon-logo-geometric-abstract-element-free-vector.jpg",
                    // }}
                    imageSettings={{
                      src: imagePath, // Replace with your logo URL
                      height: 64, // Height of the logo
                      width: 64, // Width of the logo
                      excavate: true, // This option clears the area where the logo is placed so it's more readable
                    }}
                  />
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
            )}
          </div>
          <div className="flex-1  flex justify-center items-center flex-col border-l">
            <h2>
              Submitted text <u>{submittedValue}</u>
            </h2>
            {submittedValue && (
              <div className="flex flex-col ">
                <QRCodeSVG
                  value={submittedValue}
                  size={356}
                  className="border"
                  includeMargin
                  marginSize={2}
                />
                <div className="mt-2 flex gap-2 mx-auto">
                  <Button variant="secondary" className="p-0 w-10">
                    <Share2 />
                  </Button>
                  {/* <Button
                    variant="secondary"
                    className="p-0 w-10"
                    onClick={handleSave}
                  >
                    <Save />
                  </Button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Qrcode
