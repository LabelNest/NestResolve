import { useState } from 'react';
import { format } from 'date-fns';
import { Send, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Comment } from '@/types/issue';
import { useIssues } from '@/context/IssueContext';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  issueId: string;
  comments: Comment[];
}

export function CommentSection({ issueId, comments }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { addComment, currentUser } = useIssues();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(issueId, content.trim(), isInternal);
    setContent('');
    setIsInternal(false);
  };

  const visibleComments = comments.filter(
    (comment) => !comment.isInternal || currentUser.role === 'Admin'
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Comments</h3>

      {/* Comment List */}
      <div className="space-y-4">
        {visibleComments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          visibleComments.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                'rounded-lg border p-4',
                comment.isInternal && 'bg-warning/5 border-warning/20'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-medium text-muted-foreground">
                      {comment.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                {comment.isInternal && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                    <Lock className="h-3 w-3" />
                    Internal
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex items-center justify-between">
          {currentUser.role === 'Admin' && (
            <div className="flex items-center gap-2">
              <Switch
                id="internal"
                checked={isInternal}
                onCheckedChange={setIsInternal}
              />
              <Label htmlFor="internal" className="text-sm text-muted-foreground cursor-pointer">
                Internal note (visible only to admins)
              </Label>
            </div>
          )}
          <Button type="submit" disabled={!content.trim()} className="ml-auto">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
