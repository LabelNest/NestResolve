import { cn } from '@/lib/utils';
import { IssueType } from '@/types/issue';
import { AlertOctagon, FileUp, Key, MessageSquare, Settings } from 'lucide-react';

const typeConfig: Record<IssueType, { icon: typeof AlertOctagon; className: string }> = {
  'Quality Issue': { icon: AlertOctagon, className: 'text-destructive' },
  'Contribution': { icon: FileUp, className: 'text-info' },
  'Access Request': { icon: Key, className: 'text-warning' },
  'Feedback': { icon: MessageSquare, className: 'text-success' },
  'Internal Ops': { icon: Settings, className: 'text-muted-foreground' },
};

interface TypeBadgeProps {
  type: IssueType;
  showLabel?: boolean;
  className?: string;
}

export function TypeBadge({ type, showLabel = true, className }: TypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <Icon className={cn('h-4 w-4', config.className)} />
      {showLabel && <span className="text-sm text-foreground">{type}</span>}
    </span>
  );
}
