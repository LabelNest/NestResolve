import { format } from 'date-fns';
import { MessageSquare, ArrowRight, UserPlus, PlusCircle } from 'lucide-react';
import { ActivityItem } from '@/types/issue';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityConfig = {
  created: { icon: PlusCircle, label: 'created this issue' },
  status_change: { icon: ArrowRight, label: 'changed status' },
  comment: { icon: MessageSquare, label: 'added a comment' },
  assignment: { icon: UserPlus, label: 'assigned to' },
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Activity</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 h-full w-px bg-border" />

        {/* Activity items */}
        <div className="space-y-6">
          {sortedActivities.map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background',
                    index === 0 ? 'border-primary' : 'border-border'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      index === 0 ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">
                      {activity.user.name}
                    </span>{' '}
                    <span className="text-muted-foreground">{config.label}</span>
                    {activity.type === 'status_change' && activity.details.from && (
                      <span className="text-muted-foreground">
                        {' '}
                        from <span className="font-medium">{activity.details.from}</span> to{' '}
                        <span className="font-medium">{activity.details.to}</span>
                      </span>
                    )}
                    {activity.type === 'assignment' && activity.details.to && (
                      <span className="font-medium text-foreground">
                        {' '}
                        {activity.details.to}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
