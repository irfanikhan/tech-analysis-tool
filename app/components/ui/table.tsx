import { cn } from "@/lib/utils";
import React from "react";

export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm text-left">{children}</table>
  </div>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

export const TableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <tr className={cn("border-t border-gray-200 dark:border-gray-700", className)}>{children}</tr>
);

export const TableHead = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <th className={cn("px-4 py-2 font-semibold text-gray-700 dark:text-gray-300", className)}>
    {children}
  </th>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{children}</td>
);
