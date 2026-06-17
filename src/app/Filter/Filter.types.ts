export type FilterType = "all" | "active" | "completed" | "important";

export interface FilterProps {
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
}
