# Summer Success Tracker - Quick Start Guide

## 🚀 Week 1 Sprint - Immediate Actions

### Day 1: Fix Console Logging

**Files to update:**
1. `src/hooks/useSupabaseData.tsx` - Remove all console.log statements
2. `src/pages/NotFound.tsx` - Remove console.error (lines 8-11)

**Quick fix:**
```typescript
// In useSupabaseData.tsx, replace all console.log with:
// Option 1: Remove completely
// Option 2: Use conditional logging
if (import.meta.env.DEV) {
  console.log('Debug:', data);
}
```

### Day 2: Environment Configuration

**Step 1: Create `.env` file**
```bash
# In project root
touch .env
```

**Step 2: Add variables**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Step 3: Update `src/integrations/supabase/client.ts`**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Step 4: Create `.env.example`**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Day 3: Add Edit Functionality

**Step 1: Create Edit Modal Component**

Create `src/components/EditActivityModal.tsx`:
```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditActivityModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => Promise<void>;
}

export function EditActivityModal({ activity, isOpen, onClose, onSave }: EditActivityModalProps) {
  const [formData, setFormData] = useState({
    category: activity.category,
    description: activity.description,
    duration: activity.duration?.toString() || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...activity,
        category: formData.category,
        description: formData.description,
        duration: formData.duration ? parseInt(formData.duration) : undefined
      });
      onClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Input 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          {(activity.type === 'education' || activity.type === 'skill') && (
            <div>
              <Label>Duration (minutes)</Label>
              <Input 
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 2: Add Edit Button to Activity List**

In your activity display component, add:
```typescript
import { Pencil } from 'lucide-react';

// In the activity item render
<Button 
  size="sm" 
  variant="ghost" 
  onClick={() => handleEditActivity(activity)}
>
  <Pencil className="h-4 w-4" />
</Button>
```

**Step 3: Implement Edit Handler**
```typescript
const handleEditActivity = async (updatedActivity: Activity) => {
  const { error } = await supabase
    .from('activities')
    .update({
      category: updatedActivity.category,
      description: updatedActivity.description,
      duration: updatedActivity.duration,
      updated_at: new Date().toISOString()
    })
    .eq('id', updatedActivity.id);
    
  if (error) {
    toast.error('Failed to update activity');
    throw error;
  }
  
  toast.success('Activity updated successfully');
  // Refetch data or update local state
};
```

### Day 4: Add Delete Functionality

**Step 1: Create Confirmation Dialog**

Create `src/components/DeleteConfirmDialog.tsx`:
```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Step 2: Add Delete Button**
```typescript
import { Trash2 } from 'lucide-react';

// State for delete confirmation
const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null);

// In the activity item
<Button 
  size="sm" 
  variant="ghost" 
  onClick={() => setDeleteActivity(activity)}
  className="text-red-600 hover:text-red-700"
>
  <Trash2 className="h-4 w-4" />
</Button>

// Delete confirmation dialog
<DeleteConfirmDialog
  isOpen={!!deleteActivity}
  onConfirm={() => {
    if (deleteActivity) {
      handleDeleteActivity(deleteActivity.id);
      setDeleteActivity(null);
    }
  }}
  onCancel={() => setDeleteActivity(null)}
  title="Delete Activity?"
  description="This action cannot be undone. The activity will be permanently deleted."
/>
```

**Step 3: Implement Delete Handler**
```typescript
const handleDeleteActivity = async (activityId: string) => {
  try {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);
      
    if (error) throw error;
    
    toast.success('Activity deleted successfully');
    // Refetch data or update local state
    setActivities(activities.filter(a => a.id !== activityId));
  } catch (error) {
    toast.error('Failed to delete activity');
  }
};
```

### Day 5: Add Data Export

**Step 1: Create Export Utility**

Create `src/utils/exportData.ts`:
```typescript
import { format } from 'date-fns';

export function exportToCSV(activities: Activity[], children: Child[], filename?: string) {
  // Create CSV headers
  const headers = ['Date', 'Child', 'Type', 'Category', 'Description', 'Duration (min)', 'Completed'];
  
  // Create CSV rows
  const rows = activities.map(activity => {
    const child = children.find(c => c.id === activity.child_id);
    return [
      format(new Date(activity.date), 'yyyy-MM-dd'),
      child?.name || 'Unknown',
      activity.type,
      activity.category,
      activity.description,
      activity.duration || '',
      activity.completed ? 'Yes' : 'No'
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `activities-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

**Step 2: Add Export Button**
```typescript
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/exportData';

// In your component
<Button 
  onClick={() => exportToCSV(activities, children)}
  variant="outline"
  className="flex items-center gap-2"
>
  <Download className="h-4 w-4" />
  Export to CSV
</Button>
```

## 🔥 Common Pitfalls to Avoid

### 1. Forgetting to Handle Loading States
```typescript
// BAD
const handleSave = async () => {
  await saveData();
};

// GOOD
const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Not Handling Errors Properly
```typescript
// BAD
const { data } = await supabase.from('activities').select();

// GOOD
const { data, error } = await supabase.from('activities').select();
if (error) {
  toast.error('Failed to load activities');
  return;
}
```

### 3. Mutating State Directly
```typescript
// BAD
activities.push(newActivity);
setActivities(activities);

// GOOD
setActivities([...activities, newActivity]);
```

### 4. Forgetting to Update Types
```typescript
// When adding new fields, update your types
interface Activity {
  // existing fields...
  updated_at?: string; // Don't forget new fields!
}
```

## 📋 Testing Checklist

Before committing your changes:

- [ ] All console.log statements removed
- [ ] Environment variables working
- [ ] Can edit activities
- [ ] Can delete activities with confirmation
- [ ] Data export creates valid CSV file
- [ ] No TypeScript errors
- [ ] Loading states show during operations
- [ ] Error messages display properly
- [ ] Mobile responsive design maintained

## 🚨 Emergency Fixes

### If Supabase Connection Fails
```typescript
// Add connection retry logic
const MAX_RETRIES = 3;
let retries = 0;

const fetchWithRetry = async () => {
  try {
    const { data, error } = await supabase.from('activities').select();
    if (error) throw error;
    return data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      return fetchWithRetry();
    }
    throw error;
  }
};
```

### If State Gets Out of Sync
```typescript
// Force refetch data
const forceRefresh = async () => {
  setActivities([]);
  setBehaviors([]);
  await fetchAllData();
};
```

## 📞 Getting Help

1. **Supabase Issues**: Check Supabase dashboard for service status
2. **React/TypeScript Issues**: Reference the official docs
3. **UI Components**: Check shadcn/ui documentation
4. **Build Issues**: Clear node_modules and reinstall

Remember: Small, incremental changes are better than large rewrites. Test each feature thoroughly before moving to the next!