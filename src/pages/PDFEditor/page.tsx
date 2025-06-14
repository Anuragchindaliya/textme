import Sidebar from '../Notes/components/Sidebar';
import PdfAnnotator from './PdfAnnotator';


const PDFEditor = () => {
  return (
    <div style={{ height: "87vh" }}>
      <div className="container  flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-24">
        <div className="py-1 pt-3 flex ">
          <Sidebar />
        </div>
      </div>
      <div className="p-6">
      <h1 className="text-xl font-bold mb-4">React PDF Editor</h1>
      <PdfAnnotator />
    </div>
      </div>
  )
}

export default PDFEditor