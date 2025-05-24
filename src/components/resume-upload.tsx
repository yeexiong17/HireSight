import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, FileCheck } from 'lucide-react';

interface ResumeUploadProps {
  onUploadComplete: (file: File) => void;
}

export default function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      setSelectedFile(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUploadComplete(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resume">Upload Resume</Label>
        <div className="flex gap-2">
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
          />
        </div>
        <p className="text-sm text-slate-500">
          Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedFile && !error && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          <span className="text-sm font-medium">
            {selectedFile.name} selected
          </span>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !!error}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Upload className="w-4 h-4 mr-2" />
        Submit Resume
      </Button>
    </div>
  );
} 