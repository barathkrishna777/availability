"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({
  images,
  onChange,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
      const remaining = 10 - images.length;
      const toProcess = imageFiles.slice(0, remaining);

      for (const file of toProcess) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is larger than 5MB and was skipped.`);
          continue;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          onChange([...images, base64]);
        };
        reader.readAsDataURL(file);
      }
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processFiles]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processFiles(imageFiles);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [processFiles]);

  const removeImage = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-accent-indigo/40 bg-accent-indigo/5"
            : "border-apple-gray-border/60 bg-white/50 backdrop-blur-sm hover:border-apple-gray-light hover:bg-white/70"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div>
          <svg
            className="mx-auto h-12 w-12 mb-5 text-apple-gray-light/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[19px] font-medium text-apple-gray-dark tracking-[-0.01em]">
            Drop, paste, or click to upload
          </p>
          <p className="text-[14px] mt-2 text-apple-gray-light">
            PNG, JPG, or WebP &middot; up to 5 MB &middot; max 10 images
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {images.map((base64, i) => (
            <div key={i} className="relative group aspect-[4/3]">
              <img
                src={`data:image/png;base64,${base64}`}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center text-[12px] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-apple-red"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
