import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface DebugDataFlowProps {
  children: any[];
  activities: any[];
  behaviors: any[];
}

const DebugDataFlow: React.FC<DebugDataFlowProps> = ({ 
  children, 
  activities, 
  behaviors 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    console.log('=== DEBUG DATA FLOW ===');
    console.log('Today:', today);
    console.log('All Children:', children);
    console.log('All Activities:', activities);
    console.log('All Behaviors:', behaviors);
    
    // Check today's data for each child
    children.forEach(child => {
      const childActivities = activities.filter(a => a.child_id === child.id);
      const todayActivities = activities.filter(a => a.child_id === child.id && a.date === today);
      
      console.log(`\n--- ${child.name} (ID: ${child.id}) ---`);
      console.log('Total activities:', childActivities.length);
      console.log('Today activities:', todayActivities.length);
      console.log('Activity details:', todayActivities);
    });
    
    console.log('=== END DEBUG ===\n');
  }, [children, activities, behaviors, today]);
  
  return (
    <Card className="mb-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-400">
      <CardHeader>
        <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Debug Data Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {children.map(child => {
            const todayActivities = activities.filter(
              a => a.child_id === child.id && a.date === today
            );
            const allActivities = activities.filter(
              a => a.child_id === child.id
            );
            
            return (
              <div key={child.id} className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded border dark:border-gray-600">
                <div className="font-bold dark:text-gray-100">{child.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">ID: {child.id}</div>
                
                <div className="space-y-1 text-sm dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Activities:</span>
                    <Badge variant="outline">{allActivities.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Activities:</span>
                    <Badge variant={todayActivities.length > 0 ? "default" : "secondary"}>
                      {todayActivities.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Date:</span>
                    <span className="text-xs">{today}</span>
                  </div>
                </div>
                
                {todayActivities.length > 0 && (
                  <div className="mt-2 pt-2 border-t dark:border-gray-600">
                    <div className="text-xs font-semibold mb-1 dark:text-gray-200">Today's Activities:</div>
                    {todayActivities.map((activity, idx) => (
                      <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                        • {activity.type}: {activity.category} ({activity.duration || 0}min)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs dark:text-gray-300">
          <p>Check browser console for detailed data flow analysis.</p>
          <p>Activities array length: {activities.length}</p>
          <p>Behaviors array length: {behaviors.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugDataFlow;