import { cn } from "@/app/lib/utils";
import React from "react";

export const Tabs = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) => {
  return value && !!onValueChange && <div>{children}</div>;
};

export const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
    {children}
  </div>
);

export const TabsTrigger = ({
  value,
  selected,
  onClick,
  children,
}: {
  value: string;
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) =>
  !!value && (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition",
        selected
          ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
      )}
    >
      {children}
    </button>
  );

export const TabsContent = ({
  value,
  selected,
  children,
}: {
  value: string;
  selected?: boolean;
  children: React.ReactNode;
}) => (value && selected ? <div>{children}</div> : null);
