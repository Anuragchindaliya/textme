import { Button } from "@/components/ui/button"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
import { Camera, CameraOff, ChevronsRight } from "lucide-react"
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
  // const [searchParams, setSearchParams] = useSearchParams()
  // const qrKey = searchParams.get("t")
  // const {
  //   data,
  //   refetch,
  //   isSuccess: qrLoadSuccess,
  // } = useGetQrDataQuery(qrKey || "", {
  //   skip: !qrKey,
  //   refetchOnMountOrArgChange: true,
  // })
  const [result, setResult] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement | null>(null)
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("idle")
  useEffect(() => {
    // Function to check permission and start scanner if permitted
    const checkPermissions = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        })
        setPermissionStatus(permissionStatus.state as PermissionStatus)

        permissionStatus.onchange = () => {
          setPermissionStatus(permissionStatus.state as PermissionStatus)
        }

        if (permissionStatus.state === "granted") {
          const html5QrCode = new Html5Qrcode("qr-reader")
          setScanner(html5QrCode)
        }

        // // Request camera permissions
        // const stream = await navigator.mediaDevices.getUserMedia({
        //   video: true,
        // })
        // stream.getTracks().forEach((track) => track.stop()) // Close stream after permission check
        // setPermissionStatus("granted")
      } catch (error) {
        console.error("Camera permission denied:", error)
        setPermissionStatus("denied")
      }
    }

    // Initial permission check
    checkPermissions()

    // Cleanup on component unmount
    return () => {
      stopScanning()
    }
  }, [])

  //   useEffect(() => {
  //     console.log({ scanner })
  //     if (scanner && permissionStatus === "granted") {
  //       startScanning()
  //     }
  //     return () => {
  //       stopScanning()
  //     }
  //   }, [permissionStatus])

  const startScanning = () => {
    // toast(
    //   <div className="">
    //     <div>QR code details:</div>
    //     <p className="m-4">Anurag</p>
    //     <div className="flex flex-col sm:flex-row gap-4">
    //       {/* <Button variant={"secondary"} className="flex-1">
    //           Copy text
    //         </Button> */}
    //       <CopyButton
    //         value={"anurag"}
    //         className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1  py-4 flex-[2]  w-full "
    //         title="Copy"
    //       />
    //       <Button
    //         variant={"outline"}
    //         onClick={() => toast.dismiss()}
    //         className="flex-1"
    //       >
    //         Okay <ChevronsRight />
    //       </Button>
    //     </div>
    //   </div>,
    //   {
    //     position: "top-center",
    //     autoClose: false,
    //     className: "m-4",
    //   },
    // )
    // return
    if (!scanner) return
    try {
      // Initialize the Html5Qrcode instance
      const config = { fps: 1, qrbox: { width: 250, height: 250 } }

      scanner.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          setResult(decodedText)
          handleAction(decodedText)
          stopScanning() // Stop scanning after successful scan
        },
        (error) => {
          console.log("QR Code Scan Error: ", error)
        },
      )
      setIsScanning(true)
    } catch (error) {
      console.error("Failed to start scanning:", error)
    }
  }

  const stopScanning = async () => {
    if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
      await scanner.stop()
      setIsScanning(false)
    }
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
            <Button className="ml-auto">
              <Link to={QR_ROUTES.QRL_DYNAMIC + "/add"}>Add Redirect url</Link>
            </Button>
          </div>
        </div>

        <div className="relative  flex bg-gray-700 h-[68vh] justify-center items-center">
          <SidebarTrigger className="absolute left-1 top-1" />
          <div className="absolute">
            {/* {result && (
              <>
                <div className="m-5">
                  Scanned Result:
                  <div className="border rounded">{result}</div>
                </div>
              </>
            )} */}
            {permissionStatus === "idle" && (
              <p>Requesting camera permissions...</p>
            )}
            {permissionStatus === "denied" && (
              <div className="mx-auto justify-center flex flex-col items-center ">
                <Camera className="w-32 h-32 " />
                <p>
                  Camera permissions denied. Please enable them in your browser
                  settings.
                </p>
              </div>
            )}
            {permissionStatus === "granted" && !isScanning && (
              <div>
                <button onClick={startScanning}>Start Scanning</button>
                <p>
                  Click {result ? "Restart" : "Start"} Scanning to begin
                  scanning QR codes.
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
