import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Issue, Comment, Status, User } from '@/types/issue';
import { mockIssues, currentUser, users } from '@/data/mockData';

interface IssueContextType {
  issues: Issue[];
  currentUser: User;
  users: User[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'comments' | 'activity'>) => void;
  updateIssueStatus: (issueId: string, newStatus: Status) => void;
  addComment: (issueId: string, content: string, isInternal: boolean) => void;
  assignIssue: (issueId: string, userId: string) => void;
  getIssueById: (id: string) => Issue | undefined;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);

  const generateIssueId = () => {
    const maxNum = issues.reduce((max, issue) => {
      const num = parseInt(issue.id.replace('NR-', ''));
      return num > max ? num : max;
    }, 0);
    return `NR-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const addIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'comments' | 'activity'>) => {
    const now = new Date();
    const newIssue: Issue = {
      ...issueData,
      id: generateIssueId(),
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser,
      status: 'Submitted',
      comments: [],
      activity: [
        {
          id: `a-${Date.now()}`,
          type: 'created',
          user: currentUser,
          timestamp: now,
          details: {},
        },
      ],
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const updateIssueStatus = (issueId: string, newStatus: Status) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const now = new Date();
          return {
            ...issue,
            status: newStatus,
            updatedAt: now,
            activity: [
              ...issue.activity,
              {
                id: `a-${Date.now()}`,
                type: 'status_change',
                user: currentUser,
                timestamp: now,
                details: { from: issue.status, to: newStatus },
              },
            ],
          };
        }
        return issue;
      })
    );
  };

  const addComment = (issueId: string, content: string, isInternal: boolean) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const now = new Date();
          const newComment: Comment = {
            id: `c-${Date.now()}`,
            content,
            author: currentUser,
            createdAt: now,
            isInternal,
          };
          return {
            ...issue,
            updatedAt: now,
            comments: [...issue.comments, newComment],
            activity: [
              ...issue.activity,
              {
                id: `a-${Date.now()}`,
                type: 'comment',
                user: currentUser,
                timestamp: now,
                details: { comment: content },
              },
            ],
          };
        }
        return issue;
      })
    );
  };

  const assignIssue = (issueId: string, userId: string) => {
    const assignee = users.find((u) => u.id === userId);
    if (!assignee) return;

    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const now = new Date();
          return {
            ...issue,
            assignedTo: assignee,
            updatedAt: now,
            activity: [
              ...issue.activity,
              {
                id: `a-${Date.now()}`,
                type: 'assignment',
                user: currentUser,
                timestamp: now,
                details: { to: assignee.name },
              },
            ],
          };
        }
        return issue;
      })
    );
  };

  const getIssueById = (id: string) => issues.find((issue) => issue.id === id);

  return (
    <IssueContext.Provider
      value={{
        issues,
        currentUser,
        users,
        addIssue,
        updateIssueStatus,
        addComment,
        assignIssue,
        getIssueById,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}
