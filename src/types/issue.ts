export type IssueType = 'Quality Issue' | 'Contribution' | 'Access Request' | 'Feedback' | 'Internal Ops';
export type Department = 'Data' | 'IT' | 'HR' | 'Access' | 'Asset';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Implemented' | 'Closed';
export type RelatedEntityType = 'Firm' | 'Fund' | 'Deal' | 'Contact' | 'Dataset';
export type UserRole = 'Admin' | 'Reviewer' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  isInternal: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface ActivityItem {
  id: string;
  type: 'status_change' | 'comment' | 'assignment' | 'created';
  user: User;
  timestamp: Date;
  details: {
    from?: string;
    to?: string;
    comment?: string;
  };
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  department: Department;
  priority: Priority;
  status: Status;
  createdBy: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  relatedEntity?: {
    type: RelatedEntityType;
    name: string;
  };
  attachments?: string[];
  comments: Comment[];
  activity: ActivityItem[];
}
