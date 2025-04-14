import { Person } from "@/types/person";
import { SortConfig } from "@/types/sortConfig";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to normalize tech names
function normalizeTechName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.js$/, "") // remove ".js"
    .replace(/[^a-z0-9]/gi, "") // remove non-alphanumeric
    .trim();
}

export function getExperience(
  row: Record<string, string | number>,
  tech: string
): { experience: number; hasExperience: string } {
  const normalizedTech = normalizeTechName(tech);

  const experienceKey = Object.keys(row).find((key) => {
    const normalizedKey = normalizeTechName(key);
    return (
      normalizedKey.includes("yearsofexperience") &&
      normalizedKey.includes(normalizedTech)
    );
  });

  const experienceStr = experienceKey ? row[experienceKey] : 0;
  const experience = parseFloat(experienceStr as string) || 0;

  const hasExpKey = Object.keys(row).find((key) => {
    const normalizedKey = normalizeTechName(key);
    return (
      normalizedKey.includes("doyouhaveexperience") &&
      normalizedKey.includes(normalizedTech)
    );
  });

  const hasExperience =
    hasExpKey && row[hasExpKey]?.toString().toLowerCase() === "yes"
      ? "Yes"
      : "No";

  return { experience, hasExperience };
}

export const getSortedData = (data: Person[], sortConfig: SortConfig<Person>) => {
  if (!sortConfig) return data;
  return [...data].sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }

    return sortConfig.direction === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
};
