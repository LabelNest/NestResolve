import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { CommentSection } from '@/components/issues/CommentSection';
import { ActivityTimeline } from '@/components/issues/ActivityTimeline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIssues } from '@/context/IssueContext';
import { Status } from '@/types/issue';
import { ArrowLeft, Building2, Paperclip, User } from 'lucide-react';

const statuses: Status[] = ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Implemented', 'Closed'];

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById, updateIssueStatus, assignIssue, users, currentUser } = useIssues();

  const issue = getIssueById(id || '');

  if (!issue) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Issue not found</p>
            <p className="mt-1 text-muted-foreground">
              The issue you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const canEditStatus = currentUser.role === 'Admin' || currentUser.role === 'Reviewer';
  const canAssign = currentUser.role === 'Admin';

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{issue.id}</span>
                <StatusBadge status={issue.status} />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">{issue.title}</h1>
            </div>

            {canEditStatus && (
              <Select
                value={issue.status}
                onValueChange={(v) => updateIssueStatus(issue.id, v as Status)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
              <p className="text-foreground whitespace-pre-wrap">
                {issue.description || 'No description provided.'}
              </p>
            </div>

            {/* Attachments */}
            {issue.attachments && issue.attachments.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Attachments</h2>
                <div className="space-y-2">
                  {issue.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="rounded-lg border bg-card p-6">
              <CommentSection issueId={issue.id} comments={issue.comments} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Type
                  </p>
                  <div className="mt-1">
                    <TypeBadge type={issue.type} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Priority
                  </p>
                  <div className="mt-1">
                    <PriorityBadge priority={issue.priority} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Department
                  </p>
                  <p className="mt-1 text-sm text-foreground">{issue.department}</p>
                </div>

                {issue.relatedEntity && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Related Entity
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {issue.relatedEntity.type}: {issue.relatedEntity.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* People */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">People</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Created By
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground">{issue.createdBy.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Assigned To
                  </p>
                  {canAssign ? (
                    <Select
                      value={issue.assignedTo?.id || 'unassigned'}
                      onValueChange={(v) => v !== 'unassigned' && assignIssue(issue.id, v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">
                        {issue.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Dates</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Created
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {format(issue.createdAt, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {format(issue.updatedAt, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-lg border bg-card p-6">
              <ActivityTimeline activities={issue.activity} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
