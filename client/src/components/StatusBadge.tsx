import { cn } from "@/lib/utils";

type StatusType = 'planned' | 'beta' | 'live' | 'active' | 'inactive' | 'archived';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  let styles = "bg-gray-100 text-gray-700 border-gray-200"; // default
  
  if (normalized === 'live' || normalized === 'active') {
    styles = "bg-green-50 text-green-700 border-green-200";
  } else if (normalized === 'beta' || normalized === 'planned') {
    styles = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalized === 'inactive' || normalized === 'archived') {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      styles,
      className
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
