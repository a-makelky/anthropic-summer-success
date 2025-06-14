
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Child {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  childId: string;
  date: string;
  type: 'chore' | 'education' | 'skill';
  category: string;
  description: string;
  duration?: number;
  completed: boolean;
}

interface ActivityLoggerProps {
  children: Child[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

const choreOptions = [
  'Clean Room',
  'Clean Bathroom', 
  'Clean Kitchen',
  'Clean Basement',
  'Clean Garage',
  'Clean Yard',
  'Vacuum',
  'Take Out Trash',
  'Load/Unload Dishwasher'
];

const educationOptions = [
  'Math Skills',
  'Reading',
  'Coding',
  'Drawing',
  'Educational Outing',
  'Science Project',
  'Writing Practice'
];

const skillOptions = [
  'Workout',
  'Football Skills',
  'Basketball Skills',
  'Wrestling Skills',
  'Swimming',
  'Bike Ride',
  'Music Practice',
  'Art Practice'
];

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ children, onAddActivity }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [activityType, setActivityType] = useState<'chore' | 'education' | 'skill'>('chore');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const getCategoryOptions = () => {
    switch (activityType) {
      case 'chore':
        return choreOptions;
      case 'education':
        return educationOptions;
      case 'skill':
        return skillOptions;
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChild || !category || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newActivity: Omit<Activity, 'id'> = {
      childId: selectedChild,
      date: today,
      type: activityType,
      category,
      description,
      duration: duration ? parseInt(duration) : undefined,
      completed: true // Mark as completed when logged
    };

    onAddActivity(newActivity);
    
    // Reset form
    setCategory('');
    setDescription('');
    setDuration('');
    
    const childName = children.find(c => c.id === selectedChild)?.name;
    toast.success(`Activity logged for ${childName}!`);
  };

  const getActivityIcon = () => {
    switch (activityType) {
      case 'chore':
        return '🏠';
      case 'education':
        return '📚';
      case 'skill':
        return '💪';
      default:
        return '📝';
    }
  };

  const getActivityColor = () => {
    switch (activityType) {
      case 'chore':
        return 'border-blue-200 bg-blue-50';
      case 'education':
        return 'border-purple-200 bg-purple-50';
      case 'skill':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className={`shadow-lg ${getActivityColor()}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <span>{getActivityIcon()}</span>
            Log Activity
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Selection */}
            <div className="space-y-2">
              <Label htmlFor="child">Select Child</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity Type */}
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'chore', label: '🏠 Chore', color: 'border-blue-500 bg-blue-100' },
                  { value: 'education', label: '📚 Education', color: 'border-purple-500 bg-purple-100' },
                  { value: 'skill', label: '💪 Skill/Strength', color: 'border-orange-500 bg-orange-100' }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setActivityType(type.value as 'chore' | 'education' | 'skill');
                      setCategory('');
                    }}
                    className={`p-3 border-2 rounded-lg font-medium transition-all text-center ${
                      activityType === type.value 
                        ? type.color 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${activityType} type`} />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryOptions().map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description/Details</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  activityType === 'chore' 
                    ? 'Any additional notes...' 
                    : activityType === 'education'
                    ? 'e.g., Khan: Algebra Basics - Unit 1 Test'
                    : 'e.g., Football Skills: Catching practice'
                }
                rows={3}
              />
            </div>

            {/* Duration (for education and skill activities) */}
            {(activityType === 'education' || activityType === 'skill') && (
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 30"
                  min="1"
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              Log Activity
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogger;
