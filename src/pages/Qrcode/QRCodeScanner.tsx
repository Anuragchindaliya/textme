import React, { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

const QRCodeScanner: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const qrCodeRef = useRef<HTMLDivElement | null>(null)
  const html5QrCode = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    startScanning()

    // Cleanup on component unmount
    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = () => {
    if (!qrCodeRef.current) return

    // Initialize the Html5Qrcode instance
    html5QrCode.current = new Html5Qrcode("qr-reader")
    const config = { fps: 1, qrbox: { width: 250, height: 250 } }

    html5QrCode.current.start(
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
  }

  const stopScanning = () => {
    if (html5QrCode.current) {
      html5QrCode.current.stop().then(() => {
        html5QrCode.current?.clear()
      })
    }
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
      alert(`Scanned Content: ${data}`)
    }
  }

  const handleRestart = () => {
    setResult(null) // Clear the previous result
    startScanning() // Restart scanning
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>QR Code Scanner</h2>
      <div id="qr-reader" ref={qrCodeRef} style={{ width: "100%" }}></div>

      {result && (
        <>
          <p>Scanned Result: {result}</p>
          <button onClick={handleRestart} style={{ marginTop: "10px" }}>
            Restart Scanning
          </button>
        </>
      )}
    </div>
  )
}

export default QRCodeScanner
