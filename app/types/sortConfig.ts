export type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
} | null;
