import React, { useState, useRef, DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onFileSelect: (file: File | null) => void; // null when cleared
  className?: string;
};

export const DragAndDropFileUpload = ({
  onFileSelect,
  className = "",
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isExcelFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isExcelFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // clear file input
    }
    onFileSelect(null);
  };

  const isExcelFile = (file: File) =>
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return (
    <>
      <button
        type="button"
        onClick={!selectedFile ? handleClick : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative w-72 m-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900",
          selectedFile
            ? "h-10 px-3 flex items-center justify-between text-left"
            : "h-32 px-4 py-2 flex flex-col items-center justify-center gap-1",
          className
        )}
      >
        {selectedFile ? (
          <div>
            <span>File: </span>
            <span>
              <span className="text-sm text-gray-800 dark:text-gray-100 truncate w-full pr-6">
                {selectedFile.name.length > 30
                  ? `${selectedFile.name.slice(
                      0,
                      15
                    )}...${selectedFile.name.slice(-10)}`
                  : selectedFile.name}
              </span>
              <X
                className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={clearFile}
                aria-label="Clear file"
              />
            </span>
          </div>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Drag & drop Excel file
              <br />
              or <span className="underline">click to select</span>
            </p>
          </>
        )}
      </button>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};
