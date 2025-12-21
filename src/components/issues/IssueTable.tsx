import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { Issue } from '@/types/issue';
import { cn } from '@/lib/utils';

interface IssueTableProps {
  issues: Issue[];
}

export function IssueTable({ issues }: IssueTableProps) {
  const navigate = useNavigate();

  if (issues.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No issues found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your filters or create a new issue
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[140px]">Created By</TableHead>
            <TableHead className="w-[140px]">Assigned To</TableHead>
            <TableHead className="w-[120px]">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow
              key={issue.id}
              onClick={() => navigate(`/issue/${issue.id}`)}
              className={cn(
                'cursor-pointer transition-colors',
                issue.priority === 'Critical' && 'bg-destructive/5'
              )}
            >
              <TableCell className="font-mono text-sm text-muted-foreground">
                {issue.id}
              </TableCell>
              <TableCell>
                <span className="font-medium text-foreground line-clamp-1">
                  {issue.title}
                </span>
              </TableCell>
              <TableCell>
                <TypeBadge type={issue.type} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={issue.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {issue.createdBy.name}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {issue.assignedTo?.name || '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(issue.createdAt, 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
