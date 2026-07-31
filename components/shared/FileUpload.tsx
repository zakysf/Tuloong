"use client";

import { useRef, useState } from "react";
import { Camera, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  onChange: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  label = "Unggah foto KTP",
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
  error,
  onChange,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }
    setSizeError(null);
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    setSizeError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error ?? sizeError;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
        id="ktp-upload"
      />

      {preview ? (
        <div className="relative rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview KTP"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-danger hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
          {fileName && (
            <div className="px-3 py-2 flex items-center gap-2 bg-white border-t border-neutral-100">
              <FileImage size={14} className="text-neutral-400 shrink-0" />
              <span className="text-xs text-neutral-500 truncate">{fileName}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Unggah foto KTP"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer",
            "transition-all duration-150 select-none",
            dragOver
              ? "border-brand-teal bg-brand-teal-pale/30"
              : "border-neutral-200 bg-neutral-50 hover:border-brand-teal/50 hover:bg-neutral-100"
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0">
            <Camera size={20} className="text-neutral-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700">{label}</p>
            <p className="text-xs text-neutral-400">JPG atau PNG, maks {maxSizeMB}MB</p>
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-xs text-danger font-medium">{displayError}</p>
      )}
    </div>
  );
}
