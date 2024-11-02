import React, { useRef, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"

const GradientQRCodeDownload: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (canvasRef.current && qrRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Set the gradient as the background of the main canvas
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
        const qrCodeCanvas = qrRef.current
        ctx.drawImage(qrCodeCanvas, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  // Function to download the canvas as an image
  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "gradient-qrcode.png"
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>QR Code with Gradient Background</h2>

      {/* Hidden QR code canvas for generating the QR code */}
      <QRCodeCanvas
        value="https://example.com" // Your link or data here
        size={256}
        // bgColor="rgba(0, 0, 0, 0)" // Transparent background
        // fgColor="#000" // QR code color
        // bgColor="#000"
        fgColor="red"
        // level="H"
        style={{ display: "none" }}
        ref={qrRef}
      />

      {/* Canvas for gradient background and QR code */}
      <canvas ref={canvasRef} width={256} height={256} />

      {/* Download button */}
      <button onClick={handleDownload} style={{ marginTop: "10px" }}>
        Download QR Code
      </button>
    </div>
  )
}

export default GradientQRCodeDownload
