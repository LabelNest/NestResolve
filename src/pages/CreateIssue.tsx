import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIssues } from '@/context/IssueContext';
import { useToast } from '@/hooks/use-toast';
import { IssueType, Department, Priority, RelatedEntityType } from '@/types/issue';
import { Upload, X, ArrowLeft } from 'lucide-react';

const issueTypes: IssueType[] = ['Quality Issue', 'Contribution', 'Access Request', 'Feedback', 'Internal Ops'];
const departments: Department[] = ['Data', 'IT', 'HR', 'Access', 'Asset'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const entityTypes: RelatedEntityType[] = ['Firm', 'Fund', 'Deal', 'Contact', 'Dataset'];

export default function CreateIssue() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType | ''>('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [entityType, setEntityType] = useState<RelatedEntityType | ''>('');
  const [entityName, setEntityName] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !type || !department) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    addIssue({
      title: title.trim(),
      description: description.trim(),
      type: type as IssueType,
      department: department as Department,
      priority,
      status: 'Submitted',
      relatedEntity:
        entityType && entityName
          ? { type: entityType as RelatedEntityType, name: entityName }
          : undefined,
      attachments: files.map((f) => f.name),
    });

    toast({
      title: 'Issue created',
      description: 'Your issue has been submitted successfully.',
    });

    navigate('/');
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Create New Issue</h1>
          <p className="mt-1 text-muted-foreground">
            Submit a new issue or request for your team
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of the issue"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the issue..."
              rows={5}
              className="resize-none"
            />
          </div>

          {/* Type and Department */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Issue Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={(v) => setType(v as IssueType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Department <span className="text-destructive">*</span>
              </Label>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Related Entity */}
          <div className="space-y-4">
            <Label>Related Entity (Optional)</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select value={entityType} onValueChange={(v) => setEntityType(v as RelatedEntityType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="Entity name"
                disabled={!entityType}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="rounded-lg border border-dashed p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or{' '}
                  <label className="text-primary cursor-pointer hover:underline">
                    browse
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md bg-muted px-3 py-2"
                  >
                    <span className="text-sm text-foreground truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="submit">Create Issue</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
