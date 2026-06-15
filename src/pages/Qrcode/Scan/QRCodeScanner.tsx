import { Button } from "@/components/ui/button"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
import { Camera, CameraOff, ChevronsRight } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import QRLayout from "../QRLayout"
import { Menu } from "./components/menu"
import { CopyButton } from "./components/CopyButton"
import Sidebar from "../../Notes/components/Sidebar"
import { SidebarTrigger } from "@/components/AppSidebar"
type PermissionStatus = "idle" | "granted" | "denied"
const QRCodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("idle")

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (scannerRef.current) {
        if (
          scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
        ) {
          scannerRef.current
            .stop()
            .catch((err) => console.error("Error stopping scanner:", err))
        }
      }
    }
  }, [])

  const startScanning = async () => {
    if (!scannerRef.current) {
      try {
        scannerRef.current = new Html5Qrcode("qr-reader")
      } catch (error) {
        console.error("Failed to create Html5Qrcode instance:", error)
        toast.error("Failed to initialize camera scanner.")
        return
      }
    }

    try {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } }

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          setResult(decodedText)
          handleAction(decodedText)
          stopScanning() // Stop scanning after successful scan
        },
        (error) => {
          // Verbose log: console.log("QR Code Scan Error: ", error)
        },
      )
      setIsScanning(true)
      setPermissionStatus("granted")
    } catch (error) {
      console.error("Failed to start scanning:", error)
      setPermissionStatus("denied")
      toast.error("Camera access denied or unavailable.")
    }
  }

  const stopScanning = async () => {
    if (
      scannerRef.current &&
      scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
    ) {
      try {
        await scannerRef.current.stop()
      } catch (error) {
        console.error("Failed to stop scanner:", error)
      }
    }
    setIsScanning(false)
  }

  // Handle actions based on the QR code content
  const handleAction = (data: string) => {
    if (data.startsWith("http://") || data.startsWith("https://")) {
      const newWindow = window.open(data, "_blank", "noopener,noreferrer")
      if (newWindow) newWindow.opener = null
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
            {/* <Button variant={"secondary"} className="flex-1">
                    Copy text
                  </Button> */}
            <CopyButton
              value={data}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1  py-4 flex-[2]  w-full "
              title="Copy"
            />
            <Button
              variant={"outline"}
              onClick={() => toast.dismiss()}
              className="flex-1"
            >
              Okay <ChevronsRight />
            </Button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          className: "m-4",
        },
      )
      //   alert(`Scanned Content: ${data}`)
    }
  }

  const handleRestart = () => {
    setResult(null) // Clear the previous result
    startScanning() // Restart scanning
  }

  return (
    <QRLayout>
      <div className="text-center h-full flex flex-col">
        <div className="flex">
          <div className="pl-4 py-2">
            <Sidebar />
          </div>

          <Menu />
        </div>

        <div className="relative  flex bg-gray-200 dark:bg-gray-700 h-[68vh] justify-center items-center">
          <SidebarTrigger className="absolute left-1 top-1" />
          <div className="absolute">
            {permissionStatus === "denied" && (
              <div className="mx-auto justify-center flex flex-col items-center ">
                <Camera className="w-32 h-32 " />
                <p>
                  Camera permissions denied. Please enable them in your browser
                  settings.
                </p>
              </div>
            )}
            {!isScanning && permissionStatus !== "denied" && (
              <div className="mx-auto justify-center flex flex-col items-center">
                <Camera className="w-32 h-32 text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {result
                    ? "Scan complete. Click Restart Scanning to scan again."
                    : "Camera is ready. Click Start Scanning to begin."}
                </p>
              </div>
            )}
          </div>

          {/* {isScanning && ( */}
          <div
            id="qr-reader"
            className=" w-[500px] m-auto"
            ref={qrCodeRef}
          ></div>
          {/* )} */}
        </div>

        <div className="gap-4 flex mx-auto my-2">
          {isScanning ? (
            <Button onClick={stopScanning} className="flex items-center gap-2">
              <CameraOff /> Stop Scaning
            </Button>
          ) : result ? (
            <Button onClick={handleRestart} className="flex items-center gap-2">
              <Camera /> Restart Scanning
            </Button>
          ) : (
            <Button onClick={startScanning} className="flex items-center gap-2">
              <Camera /> Start Scaning
            </Button>
          )}
        </div>
      </div>
    </QRLayout>
  )
}

export default QRCodeScanner
