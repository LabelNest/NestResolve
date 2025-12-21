import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueTable } from '@/components/issues/IssueTable';
import { useIssues } from '@/context/IssueContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, Shield, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Admin() {
  const { issues, users, currentUser } = useIssues();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const stats = useMemo(() => {
    const byStatus = issues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDepartment = issues.reduce((acc, issue) => {
      acc[issue.department] = (acc[issue.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const unassigned = issues.filter((i) => !i.assignedTo).length;
    const critical = issues.filter((i) => i.priority === 'Critical' && i.status !== 'Closed').length;

    return { byStatus, byDepartment, unassigned, critical };
  }, [issues]);

  const userStats = useMemo(() => {
    return users.map((user) => ({
      ...user,
      created: issues.filter((i) => i.createdBy.id === user.id).length,
      assigned: issues.filter((i) => i.assignedTo?.id === user.id).length,
      open: issues.filter(
        (i) => i.assignedTo?.id === user.id && !['Closed', 'Rejected'].includes(i.status)
      ).length,
    }));
  }, [users, issues]);

  const filteredIssues = selectedUser
    ? issues.filter(
        (issue) =>
          issue.createdBy.id === selectedUser || issue.assignedTo?.id === selectedUser
      )
    : issues;

  if (currentUser.role !== 'Admin') {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">Access Denied</p>
            <p className="mt-1 text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage issues and monitor team performance
          </p>
        </div>

        {/* Alert Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical Open</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.unassigned}</p>
                <p className="text-sm text-muted-foreground">Unassigned</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <FileText className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.byStatus['Under Review'] || 0}
                </p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.byStatus['Closed'] || 0}
                </p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Team Members</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {userStats.map((user) => (
              <Card
                key={user.id}
                onClick={() =>
                  setSelectedUser(selectedUser === user.id ? null : user.id)
                }
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-primary/50',
                  selectedUser === user.id && 'border-primary ring-1 ring-primary'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{user.created}</p>
                    <p className="text-xs text-muted-foreground">Created</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{user.assigned}</p>
                    <p className="text-xs text-muted-foreground">Assigned</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-info">{user.open}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Issues Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedUser
                ? `Issues for ${users.find((u) => u.id === selectedUser)?.name}`
                : 'All Issues'}
            </h2>
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="text-sm text-primary hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          <IssueTable issues={filteredIssues} />
        </div>
      </div>
    </AppLayout>
  );
}
