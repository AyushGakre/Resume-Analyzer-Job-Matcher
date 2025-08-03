"use client"
import { useState } from 'react'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const FileUploader = () => {
    const [file,setfile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setfile(selectedFile);
        }
        if(!selectedFile) {
            return
        }
        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/parse', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            const data = response.json();
            console.log('File uploaded successfully:', data);
            setStatus('success');
        } catch (error) {
            console.error('Error uploading file:', error);
            setStatus('error');
        } 
        
    }
  return (
    <div>
    <input type='file' onChange={handleFileChange}/>
    {file && (
        <div className="mt-4">
            <p className="text-sm text-white">Selected file: {file.name}</p>
            <p className="text-sm text-white">File size: {file.size} bytes</p>
            <p className="text-sm text-white">File type: {file.type}</p>
            
        </div>
    )}
    {file && (status === 'uploading' && (
        <>
        <p className="text-sm text-white mt-2">Uploading...</p>
         <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Upload  
            </button> 
            </>
    ))}
    </div>
  )
}
