import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { IssueTable } from '@/components/issues/IssueTable';
import { useIssues } from '@/context/IssueContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyIssues() {
  const { issues, currentUser } = useIssues();

  const myCreatedIssues = useMemo(
    () => issues.filter((issue) => issue.createdBy.id === currentUser.id),
    [issues, currentUser.id]
  );

  const myAssignedIssues = useMemo(
    () => issues.filter((issue) => issue.assignedTo?.id === currentUser.id),
    [issues, currentUser.id]
  );

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">My Issues</h1>
          <p className="mt-1 text-muted-foreground">
            View issues you've created or are assigned to
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList>
            <TabsTrigger value="created" className="gap-2">
              Created by Me
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {myCreatedIssues.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="assigned" className="gap-2">
              Assigned to Me
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {myAssignedIssues.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="animate-fade-in">
            <IssueTable issues={myCreatedIssues} />
          </TabsContent>

          <TabsContent value="assigned" className="animate-fade-in">
            <IssueTable issues={myAssignedIssues} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
