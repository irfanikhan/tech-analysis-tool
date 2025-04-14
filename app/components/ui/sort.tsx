import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;

const SortIcon = <T,>({
  column,
  sortConfig,
}: {
  column: keyof T;
  sortConfig: SortConfig<T>;
}) => {
  if (!sortConfig || sortConfig.key !== column)
    return <ChevronsUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
  return sortConfig.direction === "asc" ? (
    <ArrowUp className="w-4 h-4 inline ml-1" />
  ) : (
    <ArrowDown className="w-4 h-4 inline ml-1" />
  );
};

export default SortIcon;
