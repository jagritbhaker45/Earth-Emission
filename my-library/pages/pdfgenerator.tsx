'use client'
import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PdfGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true); // Set loading state to true

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed the Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Add a blank page to the document
      const page = pdfDoc.addPage([600, 400]);
      
      // Get the width and height of the page
      const { width, height } = page.getSize();
      
      // Draw a string of text toward the top of the page
      const fontSize = 30;
      page.drawText('Hello, world!', {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
      });
      
      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      
      // Create a blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Create a link element
      const link = document.createElement('a');
      
      // Set the link's href to a URL created from the blob
      link.href = URL.createObjectURL(blob);
      
      // Set the download attribute to specify the filename
      link.download = 'generated.pdf';
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Programmatically click the link to trigger the download
      link.click();
      
      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div>
      <button onClick={generatePdf} disabled={loading}>
        Generate PDF
      </button>
      {loading && <div>Loading, please wait...</div>}
    </div>
  );
};

export default PdfGenerator;
