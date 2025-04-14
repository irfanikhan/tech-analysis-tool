import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import * as React from "react";

export const FileUpload = ({
  onChange,
  className = "",
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) => {
  return (
    <label
      className={cn(
        "w-72 m-3 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
        className
      )}
    >
      <UploadCloud className="w-5 h-5" />
      <span>Select Excel File</span>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};
