import { cn } from "@/lib/utils";
import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-xl shadow-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      className
    )}
  >
    {children}
  </div>
);

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("p-4", className)}>{children}</div>;
