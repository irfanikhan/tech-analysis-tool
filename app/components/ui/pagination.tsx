import { cn } from "@/lib/utils";
import React from "react";

export const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages === 1) return null;

  return (
    <div className="flex justify-end items-center mt-4 space-x-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full text-sm transition",
            i + 1 === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300"
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
