import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  FileCheck,
  AlertCircle,
  Eye,
  Link,
  Sparkles,
} from 'lucide-react';

export interface ImageUploadPanelProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  sublabel?: string;
  aspectRatio?: 'poster' | 'banner' | 'square' | 'any';
  maxSizeMB?: number;
  sampleImages?: { name: string; url: string }[];
  className?: string;
}

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  value,
  onChange,
  label = 'Event Poster & Artwork',
  sublabel = 'Drag and drop high-resolution poster or select from your device storage',
  aspectRatio = 'poster',
  maxSizeMB = 10,
  sampleImages = [],
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeKb: number;
    type: string;
  } | null>(null);
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'samples'>(
    value && !value.startsWith('data:') ? 'upload' : 'upload'
  );
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, GIF).');
      return;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setFileDetails({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          type: file.type.replace('image/', '').toUpperCase(),
        });
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the file from storage. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleClearImage = () => {
    onChange('');
    setFileDetails(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setFileDetails({
        name: 'Remote URL Image',
        sizeKb: 0,
        type: 'WEB',
      });
      setErrorMessage(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            {label}
          </label>
          {sublabel && <p className="text-[11px] text-slate-500 mt-0.5">{sublabel}</p>}
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Device Upload</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'url'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link className="w-3.5 h-3.5 text-amber-600" />
            <span>Image URL</span>
          </button>

          {sampleImages.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveMode('samples')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'samples'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Presets</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Mode 1: Device Upload (Drag & Drop or File Picker) */}
      {activeMode === 'upload' && (
        <div>
          {value ? (
            /* Uploaded Image Preview Panel */
            <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20 p-4 transition-all overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Thumbnail Preview */}
                <div className="relative w-full sm:w-36 aspect-4/5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm shrink-0 group">
                  <img
                    src={value}
                    alt="Event Poster Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold px-2 py-1 rounded bg-slate-950/80">
                      Live Preview
                    </span>
                  </div>
                </div>

                {/* Details and Actions */}
                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Image Ready for Publishing</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                    {fileDetails?.name || 'Uploaded Event Poster'}
                  </h4>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-500 font-mono">
                    {fileDetails?.sizeKb ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {fileDetails.sizeKb > 1024
                          ? `${(fileDetails.sizeKb / 1024).toFixed(2)} MB`
                          : `${fileDetails.sizeKb} KB`}
                      </span>
                    ) : null}
                    {fileDetails?.type && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {fileDetails.type}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-sans font-semibold">
                      Stored in Device Memory
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Choose Different Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Drag & Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer group ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30'
              }`}
            >
              <div className="max-w-md mx-auto space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-all duration-300 shadow-xs ${
                    isDragging
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-white text-blue-600 border border-slate-200 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    <span className="text-blue-600 underline underline-offset-2">Click to browse device</span>{' '}
                    or drag & drop poster here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports high-resolution PNG, JPG, WebP, or GIF (Up to {maxSizeMB}MB)
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 shadow-2xs">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Works directly with phone camera & PC file storage</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Paste Web Image URL */}
      {activeMode === 'url' && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or any public poster URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-blue-600 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
            >
              Apply URL
            </button>
          </form>

          {value && (
            <div className="flex items-center gap-3 pt-1">
              <img
                src={value}
                alt="Current URL preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-800 block truncate">
                  {value}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Image linked successfully
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Curated Presets */}
      {activeMode === 'samples' && sampleImages.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            Select one of our high-quality Ugandan event flyer templates:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {sampleImages.map((sample) => {
              const isSelected = value === sample.url;
              return (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => {
                    onChange(sample.url);
                    setFileDetails({
                      name: sample.name,
                      sizeKb: 0,
                      type: 'PRESET',
                    });
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer group ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-400 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-white p-1 text-center font-bold truncate">
                    {sample.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
