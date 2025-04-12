import { cn } from "@/app/lib/utils";
import React from "react";


export const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 text-sm font-medium shadow transition",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
