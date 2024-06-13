import React, { useState } from 'react';

interface UploadButtonProps {
    onUpload: (files: FileList) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onUpload(event.target.files);
        }
    };

    return (
        <input type="file" onChange={handleFileChange} multiple />
    );
};

export default UploadButton;
