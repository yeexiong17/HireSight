'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeUploadProps {
  jobId?: string;
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: string) => void;
}

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export default function ResumeUpload({ jobId, onUploadSuccess, onUploadError }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({
        status: 'error',
        message: 'Invalid file type. Please upload PDF, JPEG, or PNG files only.'
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadStatus({
        status: 'error',
        message: 'File too large. Please upload files smaller than 5MB.'
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ status: 'idle' });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploadStatus({ status: 'uploading', progress: 0 });

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      if (jobId) {
        formData.append('jobId', jobId);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 10, 90)
        }));
      }, 200);

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setUploadStatus({ status: 'processing', message: 'Processing resume with AI...' });

      const result = await response.json();

      setUploadStatus({
        status: 'success',
        message: `Resume uploaded successfully! Extracted ${result.data.extractedFields.length} fields.`
      });

      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadStatus({
        status: 'error',
        message: errorMessage
      });

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus({ status: 'idle' });
  };

  const getStatusIcon = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Upload className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus.status) {
      case 'uploading':
        return `Uploading... ${uploadStatus.progress || 0}%`;
      case 'processing':
        return 'Processing resume with AI...';
      case 'success':
      case 'error':
        return uploadStatus.message;
      default:
        return 'Drop your resume here or click to browse';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Resume</h3>
        
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : uploadStatus.status === 'error'
              ? 'border-red-300 bg-red-50'
              : uploadStatus.status === 'success'
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadStatus.status === 'uploading' || uploadStatus.status === 'processing'}
          />

          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {getStatusMessage()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports PDF, JPEG, PNG files up to 5MB
              </p>
            </div>

            {/* Progress Bar */}
            {uploadStatus.status === 'uploading' && (
              <div className="w-full max-w-xs">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadStatus.progress || 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {uploadStatus.status === 'idle' && (
                <button
                  onClick={resetUpload}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Upload Button */}
            {uploadStatus.status === 'idle' && (
              <div className="mt-4">
                <button
                  onClick={uploadFile}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Actions */}
        {uploadStatus.status === 'success' && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={resetUpload}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Upload Another
            </button>
            <button
              onClick={() => window.location.href = '/candidate/dashboard'}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              View Dashboard
            </button>
          </div>
        )}

        {/* Error Actions */}
        {uploadStatus.status === 'error' && (
          <div className="mt-4">
            <button
              onClick={resetUpload}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use a clear, well-formatted resume</li>
          <li>• Ensure text is readable and not blurry</li>
          <li>• PDF format typically gives the best extraction results</li>
          <li>• Include standard sections: contact info, experience, education, skills</li>
        </ul>
      </div>
    </div>
  );
}
