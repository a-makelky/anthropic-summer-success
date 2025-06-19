
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface Child {
  id: string;
  name: string;
}

interface Behavior {
  id: string;
  child_id: string;
  date: string;
  type: string;
  deduction: number;
}

interface BehaviorLoggerProps {
  children: Child[];
  onAddBehavior: (behavior: Omit<Behavior, 'id'>) => void;
}

const behaviorOptions = [
  'Talking Back',
  'Lying',
  'Sneaking Food',
  'Unauthorized Screen Time',
  'Not Following Instructions',
  'Fighting with Sibling',
  'Disrespectful Language',
  'Not Completing Assigned Tasks'
];

const BehaviorLogger: React.FC<BehaviorLoggerProps> = ({ children, onAddBehavior }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [behaviorType, setBehaviorType] = useState('');
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChild || !behaviorType) {
      toast.error('Please select a child and behavior type');
      return;
    }

    const newBehavior: Omit<Behavior, 'id'> = {
      child_id: selectedChild,
      date: today,
      type: behaviorType,
      deduction: 5 // 5 minutes deducted per behavior
    };

    console.log('BehaviorLogger - Creating behavior:', newBehavior);
    console.log('BehaviorLogger - Today date:', today);
    onAddBehavior(newBehavior);
    
    // Reset form
    setBehaviorType('');
    setNotes('');
    
    const childName = children.find(c => c.id === selectedChild)?.name;
    toast.error(`5 minutes deducted from ${childName}'s Minecraft time`, {
      description: `Reason: ${behaviorType}`
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-red-200 bg-red-50 dark:border-red-400 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-red-700 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
            Log Inappropriate Behavior
          </CardTitle>
          <p className="text-red-600 dark:text-red-400 text-sm">
            Each behavior logged will deduct 5 minutes from Minecraft time
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Selection */}
            <div className="space-y-2">
              <Label htmlFor="child" className="dark:text-gray-200">Select Child</Label>
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

            {/* Behavior Type */}
            <div className="space-y-2">
              <Label htmlFor="behavior" className="dark:text-gray-200">Behavior Type</Label>
              <Select value={behaviorType} onValueChange={setBehaviorType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select behavior type" />
                </SelectTrigger>
                <SelectContent>
                  {behaviorOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="dark:text-gray-200">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional context or details..."
                rows={3}
              />
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">⚠️ This will deduct 5 minutes</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Logging this behavior will immediately reduce the selected child's available Minecraft time for today.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3">
              Log Behavior (-5 minutes)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorLogger;
