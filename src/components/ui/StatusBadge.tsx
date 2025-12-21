import { cn } from '@/lib/utils';
import { Status } from '@/types/issue';

const statusStyles: Record<Status, string> = {
  'Submitted': 'bg-muted text-muted-foreground',
  'Under Review': 'bg-info/10 text-info',
  'Accepted': 'bg-success/10 text-success',
  'Rejected': 'bg-destructive/10 text-destructive',
  'Implemented': 'bg-purple-100 text-purple-700',
  'Closed': 'bg-muted text-muted-foreground',
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
