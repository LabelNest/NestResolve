import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueFilters } from '@/components/issues/IssueFilters';
import { IssueTable } from '@/components/issues/IssueTable';
import { useIssues } from '@/context/IssueContext';
import { Status, Priority, IssueType, Department } from '@/types/issue';

export default function Dashboard() {
  const { issues } = useIssues();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    typeFilter !== 'all' ||
    departmentFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
    setDepartmentFilter('all');
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !issue.title.toLowerCase().includes(query) &&
          !issue.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && issue.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && issue.priority !== priorityFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && issue.type !== typeFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter !== 'all' && issue.department !== departmentFilter) {
        return false;
      }

      return true;
    });
  }, [issues, searchQuery, statusFilter, priorityFilter, typeFilter, departmentFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter((i) => !['Closed', 'Rejected'].includes(i.status)).length;
    const critical = issues.filter((i) => i.priority === 'Critical').length;
    const pending = issues.filter((i) => i.status === 'Submitted').length;
    return { total, open, critical, pending };
  }, [issues]);

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage all issues across your organization
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
            <p className="mt-1 text-3xl font-semibold text-foreground">{stats.total}</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
            <p className="mt-1 text-3xl font-semibold text-info">{stats.open}</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="mt-1 text-3xl font-semibold text-destructive">{stats.critical}</p>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
            <p className="mt-1 text-3xl font-semibold text-warning">{stats.pending}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <IssueFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredIssues.length} of {issues.length} issues
        </p>

        {/* Table */}
        <IssueTable issues={filteredIssues} />
      </div>
    </AppLayout>
  );
}
