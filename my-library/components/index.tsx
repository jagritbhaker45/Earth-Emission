// pages/index.tsx
// pages/index.tsx
import React from 'react';
import PdfGenerator from '../pages/pdfgenerator';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>PDF Generator </h1>
      <PdfGenerator />
    </div>
  );
};

export default HomePage;
