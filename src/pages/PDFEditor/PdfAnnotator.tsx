// PdfAnnotator.tsx
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
// import './styles.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

interface Annotation {
  page: number;
  text: string;
  rect: DOMRect;
  comment: string;
}

const PdfAnnotator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectionText, setSelectionText] = useState<string>('');
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [comment, setComment] = useState<string>('');
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);

  const textLayerRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0];
    if (nextFile) setFile(nextFile);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleTextSelection = (e: any) => {
    console.log('Text selected:', e);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      console.log('Selection rect:', rect);
      if (!range.collapsed && textLayerRef.current?.contains(range.startContainer)) {
        setSelectionText(selection.toString());
        setSelectionRect(rect);
        setShowCommentInput(true);
      }
    }
  };

  const addAnnotation = () => {
    if (selectionText && selectionRect && comment) {
      const newAnnotation: Annotation = {
        page: pageNumber,
        text: selectionText,
        rect: selectionRect,
        comment,
      };
      const updated = [...annotations, newAnnotation];
      setAnnotations(updated);
      setHistory([...history, annotations]);
      setRedoStack([]);
    }
    setSelectionText('');
    setComment('');
    setSelectionRect(null);
    setShowCommentInput(false);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setRedoStack([...redoStack, annotations]);
      setAnnotations(prev);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setHistory([...history, annotations]);
      setAnnotations(next);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">PDF Annotator</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />

      {file && (
        <div className="border rounded shadow relative">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="overflow-hidden"
          >
            <Page
              pageNumber={pageNumber}
              width={600}
              onRenderSuccess={() => {
                const textLayer = document.querySelector('.react-pdf__Page__textContent');
                if (textLayer) textLayerRef.current = textLayer as HTMLDivElement;
              }}
              onClick={handleTextSelection}
            />
          </Document>

          {/* Annotations */}
          {annotations
            .filter((ann) => ann.page === pageNumber)
            .map((ann, idx) => (
              <div
                key={idx}
                className="absolute bg-yellow-200/70 border border-yellow-600 cursor-pointer"
                style={{
                  top: ann.rect.top - 64,
                  left: ann.rect.left,
                  width: ann.rect.width,
                  height: ann.rect.height,
                }}
                title={ann.comment}
              >
                <div className="absolute z-10 hidden group-hover:block bg-white shadow-md p-2 text-sm">
                  {ann.comment}
                </div>
              </div>
            ))}

          {/* Comment Modal */}
          {showCommentInput && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-2">Add Annotation</h2>
                <p className="mb-2 text-sm text-gray-700">"{selectionText}"</p>
                <textarea
                  className="w-full border p-2 rounded mb-4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter comment..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowCommentInput(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAnnotation}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber === numPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="space-x-2">
          <button onClick={undo} className="px-3 py-1 bg-orange-200 rounded">Undo</button>
          <button onClick={redo} className="px-3 py-1 bg-orange-300 rounded">Redo</button>
        </div>
      </div>
    </div>
  );
};

export default PdfAnnotator;
