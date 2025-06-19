import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DebugPanelProps {
  children: any[];
  activities: any[];
  behaviors: any[];
  calculateDailyProgress: (childId: string, date?: string) => any;
  selectedDate?: string;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ 
  children, 
  activities, 
  behaviors, 
  calculateDailyProgress,
  selectedDate 
}) => {
  const today = selectedDate || new Date().toISOString().split('T')[0];

  return (
    <Card className="mb-6 border-2 border-purple-500 dark:border-purple-400">
      <CardHeader>
        <CardTitle className="text-purple-700 dark:text-purple-400">🔍 Debug Panel - Real-time Calculations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {children.map(child => {
            const progress = calculateDailyProgress(child.id);
            const todayActivities = activities.filter(
              a => a.child_id === child.id && a.date === today
            );
            const todayBehaviors = behaviors.filter(
              b => b.child_id === child.id && b.date === today
            );
            
            console.log(`Debug Panel - ${child.name} behaviors:`, {
              allBehaviors: behaviors.filter(b => b.child_id === child.id),
              todayBehaviors,
              today,
              behaviorDates: behaviors.map(b => ({ id: b.id, date: b.date }))
            });
            
            return (
              <div key={child.id} className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-bold text-lg dark:text-gray-100">{child.name}</h3>
                
                <div className="text-sm space-y-1 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Education Time:</span>
                    <Badge variant={progress.academicTime >= 120 ? "default" : "secondary"}>
                      {progress.academicTime}/120 min
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Skill Time:</span>
                    <Badge variant={progress.skillTime >= 60 ? "default" : "secondary"}>
                      {progress.skillTime}/60 min
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Chores:</span>
                    <Badge variant={progress.choresCompleted >= 2 ? "default" : "secondary"}>
                      {progress.choresCompleted}/2
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Behavior Deductions:</span>
                    <Badge variant="destructive">
                      -{todayBehaviors.reduce((sum, b) => sum + b.deduction, 0)} min
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Minecraft Time:</span>
                    <Badge variant="outline" className="text-green-700">
                      {progress.minecraftTime} min
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Activities today: {todayActivities.length}</p>
                    <p>Behaviors today: {todayBehaviors.length}</p>
                    <p>All goals met: {progress.academicTime >= 120 && progress.skillTime >= 60 && progress.choresCompleted >= 2 ? '✅ Yes' : '❌ No'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;