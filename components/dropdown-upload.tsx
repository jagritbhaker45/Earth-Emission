
// 'use client';
// import React, { useState, useEffect } from "react";
// import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

// export default function Upload() {
//   const [file, setFile] = useState<File | null>(null);

//   // Handle file change event
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0] || null;
//     console.log('Selected file:', selectedFile);
//     setFile(selectedFile);
//   };

//   // Log the file state whenever it changes
//   useEffect(() => {
//     console.log('File state updated:', file);
//   }, [file]);

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!file) {
//       console.log('No file to upload');
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/add-customer", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         console.log("File uploaded successfully");
//         alert("File uploaded successfully");
//       } else {
//         console.error("Failed to upload file");
//         alert("Failed to upload file");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Error:", error);
//         alert("Error: " + error.message);
//       } else {
//         console.error("Unexpected error:", error);
//         alert("Unexpected error");
//       }
//     }
//   };

//   return (
//     <Dropdown>
//       <DropdownTrigger>
//         <Button variant="bordered">Bulk Import</Button>
//       </DropdownTrigger>
//       <DropdownMenu aria-label="Static Actions">
//         <DropdownItem>
//           <form onSubmit={handleSubmit} encType="multipart/form-data">
//             <input
//               type="file"
//               name="file"
//               onChange={handleFileChange}
//               accept=".csv, .xlsx"
//               required
//             />
//             <Button type="submit">Upload</Button>
//           </form>
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// }


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    console.log('Selected file:', selectedFile);
    setFile(selectedFile);
  };

  useEffect(() => {
    console.log('File state updated:', file);
  }, [file]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log('No file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/add-customer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
        setSuccess(true);
        alert('File uploaded successfully');
      } else {
        console.error('Failed to upload file');
        setError('Failed to upload file');
        alert('Failed to upload file');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error);
        setError(error.message);
        alert('Error: ' + error.message);
      } else {
        console.error('Unexpected error:', error);
        setError('Unexpected error');
        alert('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  }, [file]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Bulk Import</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".csv, .xlsx"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>File uploaded successfully!</div>}
          </form>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}