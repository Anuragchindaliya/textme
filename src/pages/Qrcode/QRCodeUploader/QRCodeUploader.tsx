import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import QRLayout from "../QRLayout"
import { ChevronsRight, Cross, Edit, QrCode, Upload, X } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { QR_ROUTES } from "../QRSidebar"
import { CopyButton } from "../Scan/components/CopyButton"
import { toast } from "react-toastify"
import { useToast } from "@/components/ui/use-toast"
import { ROUTES } from "@/Router"
import Sidebar from "@/pages/Notes/components/Sidebar"
import { SidebarTrigger } from "@/components/AppSidebar"

const QRCodeUploader: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null) // For image preview
  const { toast: appToast } = useToast()
  const navigate = useNavigate()

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      console.log({ file })
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl) // Show image preview
      handleFileUpload(file) // Scan QR code from the file
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: "image/*",
  })

  // Handle QR code scanning from uploaded file
  const handleFileUpload = async (file: File) => {
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  if (!validImageTypes.includes(file.type)) {
    appToast({
      title: "Invalid File",
      description: "Please upload a valid image file (PNG, JPEG, WEBP).",
      onBlurCapture: () => {
        setPreview(null);
      },
      className:"bg-red-800 border  border-red-900 text-white"
    });
    return;
  }
    try {
      const html5QrCode = new Html5Qrcode("qr-reader-temp")
      const decodedText = await html5QrCode.scanFile(file, true)

      // Set result and handle the scanned QR code
      setResult(decodedText)
      handleAction(decodedText)

      // Clean up
      await html5QrCode.clear()
    } catch (error) {
      console.error("Failed to scan QR code from file:", {error})
      appToast({
        title: "Error",
        description: "Failed to scan the uploaded QR code image.",
      })
    }
  }

  // Handle actions based on the scanned QR code content
  const handleAction = (data: string) => {
    if (data.startsWith("http://") || data.startsWith("https://")) {
      window.open(data, "_blank", "noopener,noreferrer")
    } else if (data.startsWith("tel:") || data.startsWith("sms:") || data.startsWith("mailto:") || data.startsWith("geo:") || data.startsWith("BEGIN:VCARD") || data.startsWith("BEGIN:VEVENT") || data.startsWith("WIFI:")) {
      window.location.href = data
    } else {
      toast(
        <div className="">
          <div>QR code details:</div>
          <p className="m-4">{data}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant={"outline"}
              onClick={() => {
                toast.dismiss()
                navigate(`${ROUTES.QR_CODE}/?t=${data}`)
              }}
              className="flex-1"
            >
              <QrCode className="w-4 mr-2" />
              View QR
            </Button>
            <CopyButton
              value={data}
              className="bg-secondary  text-secondary-foreground hover:bg-secondary/80 px-1  py-4 flex-[2]  w-full "
              title="Copy"
              variant={"default"}
            />
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          className: "m-4 sm:w-[350px] p-0",
        },
      )
    }
  }
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if(file){
          onDrop([file]);
        }
      }
    }
  };

  return (
    <QRLayout>
      <div className="py-1 pt-3 flex flex-1 space-x-2 sm:justify-end w-full container">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">Upload QR Code Image</div>
      </div>
      <SidebarTrigger className="m-2 p-2 absolute hover:bg-white dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-900 z-10" />
      <div className="text-center h-screen flex-1 flex flex-col justify-center items-center p-8">
        {/* <h2 className="text-lg my-4">Upload QR Code Image</h2> */}
        <div className="relative  w-[90%] h-[90%]">
          <div
            {...getRootProps()}
            onPaste={handlePaste}
            className={`p-5 w-[90%] h-[90%] flex flex-col justify-center items-center m-auto border-dashed border-gray-200 dark:border-gray-700 border-2 rounded-lg cursor-pointer ${
                 isDragActive ? "border-blue-500" : "border-gray-300"
               } text-center`}
          >
            {preview ? (
              <div style={{ marginTop: "20px" }}>
                <h3>Image Preview:</h3>
                <img src={preview} alt="QR Code Preview" 
                // width="200"
                className="w-[90%] h-[90%] object-contain"
                 />
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 m-4" />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                    <p>
                    Drag and drop a QR code image here, click to select one, or paste an image.
                    </p>
                )}
              </>
            )}
            <input {...getInputProps()} 
              accept="image/*"
             />
            <Button className="mt-4">Choose Image</Button>
          </div>
          {preview && (
            <Button
              className="absolute top-0 right-0"
              onClick={() => {
                setResult(null)
                setPreview(null)
              }}
            >
              <X />
            </Button>
          )}
        </div>

        {/* {preview && (
          <div style={{ marginTop: "20px" }}>
            <h3>Image Preview:</h3>
            <img src={preview} alt="QR Code Preview" width="200" />
          </div>
        )} */}

        {/* Temporary hidden div for Html5Qrcode initialization */}
        <div id="qr-reader-temp" style={{ display: "none" }}></div>
      </div>
    </QRLayout>
  )
}

export default QRCodeUploader
