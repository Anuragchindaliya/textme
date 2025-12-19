import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import { Image, Text, Upload, X } from "lucide-react"
import { motion } from "motion/react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { AiFillFilePdf } from "react-icons/ai"
import { toast } from "react-toastify"
import Tesseract from "tesseract.js"
import { CopyButton } from "../Notes/components/CopyButton"
import Sidebar from "../Notes/components/Sidebar"

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
}

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

export default function OcrApp() {
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null) // For image preview

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      // console.log({ file })
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl) // Show image preview
      handleFileUpload(file) // Scan QR code from the file
      setImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, inputRef, open } =
    useDropzone({
      onDrop,
      // accept: "image/*",
    })

  // Handle QR code scanning from uploaded file
  const handleFileUpload = async (file: File) => {
    const validImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ]

    if (!validImageTypes.includes(file.type)) {
      // appToast({
      //   title: "Invalid File",
      //   description: "Please upload a valid image file (PNG, JPEG, WEBP).",
      //   onBlurCapture: () => {
      //     setPreview(null);
      //   },
      //   className:"bg-red-800 border  border-red-900 text-white"
      // });
      toast.error("Please upload a valid image file (PNG, JPEG, WEBP).")
      return
    }
    // try {
    //   const html5QrCode = new Html5Qrcode("qr-reader-temp")
    //   const decodedText = await html5QrCode.scanFile(file, true)

    //   // Set result and handle the scanned QR code
    //   setResult(decodedText)
    //   handleAction(decodedText)

    //   // Clean up
    //   await html5QrCode.clear()
    // } catch (error) {
    //   console.error("Failed to scan QR code from file:", {error})
    //   appToast({
    //     title: "Error",
    //     description: "Failed to scan the uploaded QR code image.",
    //   })
    // }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0])
  }

  const handleOcr = async () => {
    if (!image) return
    setLoading(true)
    const { data } = await Tesseract.recognize(image, "eng", {
      // logger: (m) => console.log(m),
    })
    setText(data.text)
    setLoading(false)
  }
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile()
        if (file) {
          onDrop([file])
        }
      }
    }
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    })

    const margin = 40
    const pageHeight = doc.internal.pageSize.height
    let y = margin

    doc.setFontSize(12)
    doc.setFont("sans-serif", "Normal")

    // Split the text into lines fitting within the page width
    const lines = doc.splitTextToSize(
      text,
      doc.internal.pageSize.width - margin * 2,
    )

    lines.forEach((line: string) => {
      // Check if the current y position will exceed the page height
      if (y + 20 > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 18 // Adjust line spacing
    })

    doc.save("extracted-text.pdf")
  }

  return (
    <div className="container mx-auto p-4" onPaste={handlePaste}>
      <div className="flex">
        <div className="flex pr-2">
          <Sidebar />
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold px-2 pt-2 ">Scan Image Text</h2>
          <div className="flex">
            {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
            <div className="flex items-end space-x-4 mb-4 w-full ">
              <div className="grid w-full items-center gap-1.5">
                {/* <Label htmlFor="picture">Scan Text</Label> */}

                <div>
                  {image ? (
                    <motion.div
                      key={"file"}
                      // layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                      className={cn(
                        "cursor-pointer border relative overflow-hidden z-40 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-start justify-start  p-1 h-10 px-4 mt-4 w-full mx-auto rounded-md",
                        "shadow-sm",
                      )}
                      onClick={() => open()}
                    >
                      <div className="flex justify-between w-full items-center gap-4">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-sm"
                        >
                          {image.name}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                        >
                          {image.size < 1024 * 1024
                            ? `${(image.size / 1024).toFixed(2)} KB`
                            : `${(image.size / (1024 * 1024)).toFixed(2)} MB`}
                        </motion.p>
                      </div>

                      {/* <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                        >
                          {image.type}
                        </motion.p>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                        >
                          modified{" "}
                          {new Date(image.lastModified).toLocaleDateString()}
                        </motion.p>
                      </div> */}
                    </motion.div>
                  ) : (
                    <>
                      <Input
                        readOnly
                        value={"Choose File - No File chosen"}
                        placeholder="No file selected"
                        className={cn(
                          "border relative overflow-hidden z-40 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-start justify-start h-10  p-4 mt-4 w-full mx-auto rounded-md",
                          "shadow-sm",
                        )}
                        onClick={() => open()}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative  w-full h-[calc(100vh-150px)] ">
        {preview && (
          <ResizablePanelGroup id={"selectedImage"} direction="horizontal">
            <div className="flex w-full h-full">
              {image && (
                <ResizablePanel
                  id="imagePreview"
                  className="border flex flex-col relative rounded-none rounded-l-lg"
                  maxSize={70}
                  minSize={30}
                >
                  {/* <Card className="flex-1 relative"> */}
                  <div className="flex space-x-1 p-2 pr-6">
                    <Button variant={"dark"} onClick={() => open()}>
                      <Image className="p-1" />
                      New Image
                    </Button>
                    <Button
                      className=" whitespace-nowrap text-xs"
                      onClick={handleOcr}
                      disabled={!image || loading}
                    >
                      <Text className="mr-1" />
                      {loading ? "Processing..." : "Extract Text"}
                    </Button>
                    {preview && (
                      <Button
                        className="absolute top-2 right-2 rounded-full w-6 h-6 p-1 backdrop-blur-sm bg-black/30 dark:bg-black/30"
                        variant={"dark"}
                        onClick={() => {
                          // setResult(null)
                          setImage(null)
                          setPreview(null)
                          setText("")
                        }}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded"
                    className="mt-0 m-auto max-w-full max-h-full object-contain  border border-red-500 border-dashed h-[90%]"
                  />
                  {/* </Card> */}
                </ResizablePanel>
              )}

              <>
                <ResizableHandle
                  withHandle
                  // iconClass="bg-gray-300"
                  className={`dark:bg-gray-800 ${text ? "" : "hidden"}`}
                />
                <ResizablePanel
                  id="extractText"
                  maxSize={70}
                  minSize={30}
                  className={`p-1 border rounded-none rounded-r-lg ${
                    text ? "" : "hidden"
                  }`}
                >
                  {/* <Card className="flex-1 p-2"> */}
                  <div className="flex space-x-1 p-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <CopyButton variant={"dark"} value={text} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-sm  ">
                          Copy:
                          <p className="bg-gray-100 p-2 rounded max-h-[calc(100vh-200px)] overflow-auto">
                            <pre>{text}</pre>
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleExportPDF}
                          className="w-9 h-9 p-1"
                        >
                          <AiFillFilePdf />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Pdf</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* https://ui.aceternity.com/components/text-generate-effect */}
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="   h-[92%]  rounded-none rounded-br-lg"
                  />

                  {/* </Card> */}
                </ResizablePanel>
              </>
            </div>
          </ResizablePanelGroup>
        )}
        <div
          {...getRootProps()}
          className={`p-5 w-full h-[90%] flex flex-col justify-center items-center m-auto border-dashed border-gray-200 dark:border-gray-700 border-2 rounded-lg cursor-pointer ${
            isDragActive ? "border-blue-500" : "border-gray-300"
          } text-center ${preview ? "hidden" : ""}`}
        >
          <motion.div
            whileHover="animate"
            className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
              <GridPattern />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                Upload file
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                Drag or drop your files here or click to upload or paste an
                image.
              </p>
              <div className="relative w-full mt-10 max-w-xl mx-auto">
                {/* {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm",
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))} */}
                {!image && (
                  <motion.div
                    layoutId="file-upload"
                    variants={mainVariant}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={cn(
                      "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                      "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                    )}
                  >
                    {isDragActive ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-600 flex flex-col items-center"
                      >
                        Drop it
                        <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      </motion.p>
                    ) : (
                      <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                    )}
                  </motion.div>
                )}

                {!image && (
                  <motion.div
                    variants={secondaryVariant}
                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                  ></motion.div>
                )}
              </div>
            </div>
          </motion.div>

          <input {...getInputProps()} ref={inputRef} accept="image/*" />
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
