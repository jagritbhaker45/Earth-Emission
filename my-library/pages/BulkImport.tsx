// 'use client'
// import React, { useState } from 'react';
// import axios from 'axios';

// const BulkImport: React.FC = () => {
//     const [files, setFiles] = useState<FileList | null>(null);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setFiles(event.target.files);
//         }
//     };

//     const handleUpload = async () => {
//         if (files) {
//             const formData = new FormData();
//             for (let i = 0; i < files.length; i++) {
//                 formData.append('files', files[i]);
//             }

//             try {
//                 const response = await axios.post('/api/upload', formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 });
//                 console.log(response.data);
//             } catch (error) {
//                 console.error('Error uploading files:', error);
//             }
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button onClick={handleUpload}>Bulk Import</button>
//         </div>
//     );
// };

// export default BulkImport;

// 'use client'
// import React, { useState } from 'react';

// const BulkImport: React.FC = () => {
//     const [files, setFiles] = useState<FileList | null>(null);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setFiles(event.target.files);
//         }
//     };

//     const handleUpload = async () => {
//         if (files) {
//             const formData = new FormData();
//             for (let i = 0; i < files.length; i++) {
//                 formData.append('files', files[i]);
//             }

//             try {
//                 const response = await fetch('/api/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }

//                 const data = await response.json();
//                 console.log(data);
//             } catch (error) {
//                 console.error('Error uploading files:', error);
//             }
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button onClick={handleUpload}>Bulk Import</button>
//         </div>
//     );
// };

// export default BulkImport;

// '

// 

'use client'
import React, { useState } from 'react';

const BulkImport: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(event.target.files);
        }
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            console.error('No files selected.');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
    
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Network response was not ok: ${text}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <input type="file" onChange={handleFileChange} multiple disabled={uploading} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Bulk Import'}
            </button>
        </div>
    );
};

export default BulkImport;
