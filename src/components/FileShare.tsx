import React, { useState, useCallback, useRef } from 'react';
import { Upload, AlertCircle, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB in bytes
const STORAGE_DAYS = 14; // 2 weeks

const formatFileSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + STORAGE_DAYS);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function FileShare() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 4000,
      style: {
        background: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #FCA5A5',
      },
    });
  };

  const validateFile = async (selectedFile: File): Promise<boolean> => {
    // Check if it's a directory
    if (selectedFile.size === 0 && selectedFile.type === "") {
      showErrorToast('Folders cannot be uploaded');
      return false;
    }

    // Check declared file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      const fileSize = formatFileSize(selectedFile.size);
      const maxSize = formatFileSize(MAX_FILE_SIZE);
      showErrorToast(`File size (${fileSize}) exceeds the ${maxSize} limit`);
      return false;
    }

    // Double-check actual file size using Blob
    try {
      // Read first few bytes to verify the file is accessible
      const blob = selectedFile.slice(0, 1024);
      await blob.arrayBuffer();

      // Verify the full size using Blob
      const fullSize = selectedFile.size;
      if (fullSize !== selectedFile.size || fullSize > MAX_FILE_SIZE) {
        showErrorToast(`Invalid file size or file is corrupted`);
        return false;
      }
    } catch (error) {
      showErrorToast('Unable to read file. The file might be too large or corrupted.');
      return false;
    }

    return true;
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetState = () => {
    setFile(null);
    setError(null);
    setShareLink(null);
    setUploadProgress(0);
    setExpiryDate(null);
    resetFileInput();
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const selectedFile = event.target.files?.[0];

    // Reset state before validation
    resetState();

    if (!selectedFile) return;

    // Validate file before processing
    if (!(await validateFile(selectedFile))) {
      resetFileInput();
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }

    // Reset state before validation
    resetState();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    // Validate file before processing
    if (!(await validateFile(droppedFile))) {
      return;
    }

    setFile(droppedFile);
  }, []);

  const clearFile = useCallback(() => {
    resetState();
  }, []);

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', 'https://file.io');
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });

      setShareLink((response as any).link);
      setExpiryDate(getExpiryDate());
      toast.success('File uploaded successfully!', {
        duration: 3000,
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #6EE7B7',
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <section id="home" className="py-20 bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Share Files Securely
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload and share files up to 2GB with anyone, anywhere. Fast, secure, and reliable.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="relative flex items-center justify-center w-full"
            >
              <div 
                onClick={handleClick}
                className="w-full flex flex-col items-center px-6 py-8 bg-white rounded-xl border-3 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <Upload className="w-12 h-12 text-blue-500 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {file ? file.name : 'Drag & drop your file here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select a file (max {formatFileSize(MAX_FILE_SIZE)})
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="*/*"
                />
              </div>
              {file && (
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {loading && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {file && !error && !loading && (
              <button
                onClick={uploadFile}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Upload File
              </button>
            )}

            {shareLink && expiryDate && (
              <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-800 font-medium mb-3">File uploaded successfully!</p>
                <div className="space-y-4">
                  <a
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all block p-4 bg-white rounded-lg border border-green-100"
                  >
                    {shareLink}
                  </a>
                  <div className="flex items-center text-sm text-gray-600 bg-white p-3 rounded-lg border border-green-100">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    <span>Available until {expiryDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}