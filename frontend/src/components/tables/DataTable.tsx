import { Search, Filter } from 'lucide-react';
import type { ReactNode } from 'react';

interface DataTableProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  children: ReactNode;
}

export default function DataTable({ title, searchPlaceholder = 'Search...', onSearch, children }: DataTableProps) {
  return (
    <div className="gov-card overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-base md:text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="gov-input pl-9 w-full sm:w-64"
            />
          </div>
          <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
