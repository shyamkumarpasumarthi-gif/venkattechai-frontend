/**
 * File Uploader Component
 * Drag and drop file upload
 */

'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/Card';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  maxSize = 500 * 1024 * 1024, // 500MB
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  multiple = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setErrors([]);

      const newErrors: string[] = [];

      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          newErrors.push(`${file.name} exceeds max size of ${formatFileSize(maxSize)}`);
          return false;
        }
        return true;
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
      }

      if (validFiles.length > 0) {
        const filesToUse = multiple ? [...selectedFiles, ...validFiles] : validFiles;
        setSelectedFiles(filesToUse);
        onFilesSelected(filesToUse);
      }
    },
    [onFilesSelected, maxSize, multiple, selectedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-lg bg-secondary-100 mb-3">
            <Upload size={24} className="text-secondary-600" />
          </div>
          <p className="text-sm font-medium text-secondary-900">
            {isDragActive ? 'Drop files here' : 'Drag files here or click to select'}
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 rounded-lg bg-error-50 border border-error-200 space-y-1">
          {errors.map((error, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-error-700">
              <AlertCircle size={16} />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-700">
            {selectedFiles.length} file(s) selected
          </p>
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-success-50 border border-success-200"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success-600" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">{file.name}</p>
                  <p className="text-xs text-secondary-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="p-1 hover:bg-success-200 rounded transition-colors"
              >
                <X size={16} className="text-success-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { FileUploader };
