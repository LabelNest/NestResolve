import { cn } from '@/lib/utils';
import { Priority } from '@/types/issue';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

const priorityConfig: Record<Priority, { icon: typeof AlertCircle; className: string }> = {
  'Low': { icon: ArrowDown, className: 'text-priority-low' },
  'Medium': { icon: ArrowUp, className: 'text-priority-medium' },
  'High': { icon: AlertTriangle, className: 'text-priority-high' },
  'Critical': { icon: AlertCircle, className: 'text-priority-critical' },
};

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Icon className={cn('h-4 w-4', config.className)} />
      {showLabel && <span className="text-sm text-foreground">{priority}</span>}
    </span>
  );
}
