"use client";

import { useCallback, useRef, useState } from "react";

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
          // Strip data URI prefix to get raw base64
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
      // Reset so re-selecting the same file works
      e.target.value = "";
    },
    [processFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
        <div className="text-gray-500">
          <svg
            className="mx-auto h-10 w-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">
            Drop calendar screenshots here, or click to browse
          </p>
          <p className="text-xs mt-1 text-gray-400">
            PNG, JPG, WebP up to 5MB each (max 10 images)
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((base64, i) => (
            <div key={i} className="relative group">
              <img
                src={`data:image/png;base64,${base64}`}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                x
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
