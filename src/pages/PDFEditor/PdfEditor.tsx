import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { TextAnnotation } from './TextAnnotation';
import { addTextToPdf } from './pdfUtils';
import PDFViewer from './PdfViewer';

export const PdfEditor: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [text, setText] = useState('Hello World');
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPosition((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  };

  const handleSave = async () => {
    if (!pdfFile) return;
    const arrayBuffer = await pdfFile.arrayBuffer();
    const newPdfBytes = await addTextToPdf(arrayBuffer, text, position.x, position.y);
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'edited.pdf');
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      <div className="relative mt-4">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <PDFViewer file={pdfFile} />
          {/* <TextAnnotation id="text1" text={text} position={position} onDragEnd={setPosition} /> */}
        </DndContext>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save PDF
      </button>
    </div>
  );
};
