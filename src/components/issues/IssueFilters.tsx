import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Status, Priority, IssueType, Department } from '@/types/issue';

interface IssueFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: Status | 'all';
  onStatusChange: (value: Status | 'all') => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (value: Priority | 'all') => void;
  typeFilter: IssueType | 'all';
  onTypeChange: (value: IssueType | 'all') => void;
  departmentFilter: Department | 'all';
  onDepartmentChange: (value: Department | 'all') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const statuses: Status[] = ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Implemented', 'Closed'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const types: IssueType[] = ['Quality Issue', 'Contribution', 'Access Request', 'Feedback', 'Internal Ops'];
const departments: Department[] = ['Data', 'IT', 'HR', 'Access', 'Asset'];

export function IssueFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  typeFilter,
  onTypeChange,
  departmentFilter,
  onDepartmentChange,
  onClearFilters,
  hasActiveFilters,
}: IssueFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as Status | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={(v) => onPriorityChange(v as Priority | 'all')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {priorities.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as IssueType | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={(v) => onDepartmentChange(v as Department | 'all')}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1.5">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
