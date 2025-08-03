'use client';

import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';


registerPlugin(FilePondPluginFileValidateType);

export const FileUploader = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [parsedText, setParsedText] = useState<string>('');

  const handleUpload = async (fileItem: any) => {
    setStatus('uploading');
    const file = fileItem.file;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setParsedText(data.text || 'No text extracted');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">📄 Upload PDF to Extract Text</h2>

      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        acceptedFileTypes={['application/pdf']}
        labelIdle='Drag & Drop your PDF or <span class="filepond--label-action">Browse</span>'
        server={{
          process: '/api/parse',
            revert: null, // No need to handle revert in this case
            fetch: null, // Not needed for this example
        }}
      />

      {status === 'uploading' && <p className="mt-4">⏳ Uploading and parsing...</p>}
      {status === 'error' && <p className="mt-4 text-red-400">❌ Error uploading or parsing file.</p>}
      {status === 'success' && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">📝 Extracted Text:</h3>
          <pre className="bg-gray-800 p-4 mt-2 rounded text-sm max-h-96 overflow-auto">{parsedText}</pre>
        </div>
      )}
    </div>
  );
};
