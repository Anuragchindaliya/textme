import { PDFDocument, rgb } from "pdf-lib"

export async function addTextToPdf(
  pdfBytes: ArrayBuffer,
  text: string,
  x: number,
  y: number,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  firstPage.drawText(text, {
    x,
    y: firstPage.getHeight() - y,
    size: 24,
    color: rgb(1, 0, 0),
  })

  return await pdfDoc.save()
}
