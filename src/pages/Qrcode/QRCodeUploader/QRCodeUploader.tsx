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
    try {
      const html5QrCode = new Html5Qrcode("qr-reader-temp")
      const decodedText = await html5QrCode.scanFile(file, true)

      // Set result and handle the scanned QR code
      setResult(decodedText)
      handleAction(decodedText)

      // Clean up
      await html5QrCode.clear()
    } catch (error) {
      console.error("Failed to scan QR code from file:", error)
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
    } else if (data.startsWith("tel:")) {
      window.location.href = data
    } else if (data.startsWith("sms:")) {
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

  return (
    <QRLayout>
      <div className="text-center h-screen flex-1 flex flex-col justify-center items-center p-8">
        <h2 className="text-lg my-4">Upload QR Code Image</h2>
        <div className="relative">
          <div
            {...getRootProps()}
            //   style={{
            //     border: "2px dashed #cccccc",
            //     padding: "20px",
            //     cursor: "pointer",
            //     width: "300px",
            //     margin: "auto",
            //     borderRadius: "8px",
            //   }}
            className="p-5 w-80 h-80 flex flex-col justify-center items-center m-auto border-dashed border-gray-50 border-2 rounded-lg cursor-pointer "
          >
            {preview ? (
              <div style={{ marginTop: "20px" }}>
                <h3>Image Preview:</h3>
                <img src={preview} alt="QR Code Preview" width="200" />
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 m-4" />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>
                    Drag and drop a QR code image here, or click to select one
                  </p>
                )}
              </>
            )}
            <input {...getInputProps()} />
            <Button className="mt-4">Choose file</Button>
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
