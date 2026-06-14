import { Button } from "@/components/ui/button"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
import {
  Camera,
  CameraOff,
  ChevronsRight,
  Link as LinkIcon,
} from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import QRLayout from "../QRLayout"
// import { Menu } from "./components/menu"
// import { CopyButton } from "./components/CopyButton"
import Sidebar from "../../Notes/components/Sidebar"
import { SidebarTrigger } from "@/components/AppSidebar"
import { Link, useSearchParams } from "react-router-dom"
import { useGetQrUrlMutation } from "@/features/qr/qrAPI"
import Spinner from "@/components/ui/spinner"
import { QR_ROUTES } from "../QRSidebar"
type PermissionStatus = "idle" | "granted" | "denied"
const QRLCodeScanner: React.FC = () => {
  const [getUrlApi, { isLoading }] = useGetQrUrlMutation()
  const [searchParams,setSearchParams] = useSearchParams()
  const url = searchParams.get("url")
  console.log({ url })
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
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.stop().catch((err) => console.error("Error stopping scanner:", err))
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
    if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await scannerRef.current.stop()
      } catch (error) {
        console.error("Failed to stop scanner:", error)
      }
    }
    setIsScanning(false)
  }

  // Handle actions based on the QR code content
  const handleAction = async (data: string) => {
    try {
      const result = (await getUrlApi(data)) as any
      console.log({ result })
      if (result?.data?.[0]) {
        window.open(result?.data[0].url, "_blank")
        return
      }
    } catch (error) {
      console.log({ error })
    }

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
          <div>No URL found for the key</div>
          <p className="m-4">{data}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <Button variant={"secondary"} className="flex-1">
                    Copy text
                  </Button> */}
            {/* <CopyButton
              value={data}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1  py-4 flex-[2]  w-full "
              title="Copy"
            /> */}
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

  useEffect(() => {
    if (url) {
      const fetchQrUrl = async () => {
        try {
          const result = (await getUrlApi(url)) as any
          console.log({ result })
          if (result?.data?.[0]) {
            if(searchParams.has("url")){
              searchParams.delete("url")
              setSearchParams(searchParams)
            }
            console.log(result?.data[0].url,"url")
            window.open(result?.data[0].url, "_blank")
            return
          }
        } catch (error) {
          console.log({ error })
        }
      }
      fetchQrUrl()
    }
  }, [url])

  return (
    <QRLayout>
      {isLoading && (
        <div className="h-screen w-full flex flex-col justify-center items-center absolute z-10 bg-[rgba(0,0,0,.7)]">
          <Spinner />
          <div>Fetching url</div>
        </div>
      )}
      <div className="text-center h-full flex flex-col">
        <div className="flex">
          <div className="pl-4 py-2">
            <Sidebar />
          </div>

          {/* <Menu /> */}
          <div className="w-full flex mt-1">
            <Button className="ml-auto ">
              <Link
                className="flex items-center gap-2"
                to={QR_ROUTES.QRL_DYNAMIC + "/add"}
              >
                <LinkIcon /> Redirect url
              </Link>
            </Button>
          </div>
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
                  {result ? "Scan complete. Click Restart Scanning to scan again." : "Camera is ready. Click Start Scanning to begin."}
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

export default QRLCodeScanner
