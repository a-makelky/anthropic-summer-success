
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

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

interface Behavior {
  id: string;
  childId: string;
  date: string;
  type: string;
  deduction: number;
}

interface DailyProgress {
  childId: string;
  date: string;
  academicTime: number;
  skillTime: number;
  choresCompleted: number;
  minecraftTime: number;
}

interface QuickStatsProps {
  children: Child[];
  activities: Activity[];
  behaviors: Behavior[];
  calculateDailyProgress: (childId: string) => DailyProgress;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  children, 
  activities, 
  behaviors, 
  calculateDailyProgress 
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Get recent activities for today
  const getTodayActivities = (childId: string) => {
    return activities.filter(a => a.childId === childId && a.date === today);
  };

  const getTodayBehaviors = (childId: string) => {
    return behaviors.filter(b => b.childId === childId && b.date === today);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Quick Statistics</h2>
        <p className="text-gray-600">Today's progress summary</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {children.map(child => {
          const progress = calculateDailyProgress(child.id);
          const todayActivities = getTodayActivities(child.id);
          const todayBehaviors = getTodayBehaviors(child.id);

          return (
            <Card key={child.id} className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl text-blue-700">{child.name}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {progress.minecraftTime}min Minecraft
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Goal Progress Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round((progress.academicTime / 120) * 100)}%
                    </div>
                    <div className="text-sm text-purple-600">Academic</div>
                    <div className="text-xs text-gray-500">
                      {progress.academicTime}/120 min
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">
                      {Math.round((progress.skillTime / 60) * 100)}%
                    </div>
                    <div className="text-sm text-orange-600">Skills</div>
                    <div className="text-xs text-gray-500">
                      {progress.skillTime}/60 min
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {progress.choresCompleted}/2
                    </div>
                    <div className="text-sm text-blue-600">Chores</div>
                    <div className="text-xs text-gray-500">completed</div>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Today's Activities ({todayActivities.length})
                  </h4>
                  
                  {todayActivities.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {todayActivities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <span className="flex-1">
                            {activity.category}: {activity.description}
                          </span>
                          {activity.duration && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.duration}min
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No activities logged yet</p>
                  )}
                </div>

                {/* Behavior Issues */}
                {todayBehaviors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Behavior Issues ({todayBehaviors.length})
                    </h4>
                    
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {todayBehaviors.map(behavior => (
                        <div key={behavior.id} className="flex items-center justify-between text-sm p-2 bg-red-50 rounded">
                          <span className="flex-1 text-red-700">{behavior.type}</span>
                          <Badge variant="destructive" className="text-xs">
                            -{behavior.deduction}min
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overall Status */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Status:</span>
                    <Badge 
                      variant={progress.minecraftTime > 0 ? "default" : "secondary"}
                      className={progress.minecraftTime > 0 ? "bg-green-600" : ""}
                    >
                      {progress.minecraftTime > 0 ? "Minecraft Earned!" : "Keep Going!"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
