
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
  child_id?: string;
  childId?: string;
  date: string;
  type: 'chore' | 'education' | 'skill';
  category: string;
  description: string;
  duration?: number;
  completed: boolean;
}

interface Behavior {
  id: string;
  child_id?: string;
  childId?: string;
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
  calculateDailyProgress: (childId: string, date?: string) => DailyProgress;
  vacationDays: string[];
  selectedDate?: string;
  currentDate?: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ 
  children, 
  activities, 
  behaviors, 
  calculateDailyProgress,
  vacationDays,
  selectedDate,
  currentDate
}) => {
  // Use selectedDate if provided, otherwise fall back to currentDate or today
  const today = selectedDate || currentDate || new Date().toISOString().split('T')[0];

  // Get recent activities for today - support both property names
  const getTodayActivities = (childId: string) => {
    return activities.filter(a => (a.child_id === childId || a.childId === childId) && a.date === today);
  };

  const getTodayBehaviors = (childId: string) => {
    return behaviors.filter(b => (b.child_id === childId || b.childId === childId) && b.date === today);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">📈 Quick Statistics</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Today's progress summary</p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {children.map(child => {
          const progress = calculateDailyProgress(child.id, today);
          const todayActivities = getTodayActivities(child.id);
          const todayBehaviors = getTodayBehaviors(child.id);

          return (
            <Card key={child.id} className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-lg sm:text-xl text-blue-700 dark:text-blue-400">{child.name}</span>
                  <Badge variant="outline" className="text-sm sm:text-lg px-2 sm:px-3 py-1">
                    {progress.minecraftTime}min Minecraft
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Goal Progress Summary */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {Math.round((progress.academicTime / 120) * 100)}%
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Academic</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.academicTime}/120 min
                    </div>
                  </div>

                  <div className="text-center p-2 sm:p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {Math.round((progress.skillTime / 60) * 100)}%
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">Skills</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.skillTime}/60 min
                    </div>
                  </div>

                  <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {progress.choresCompleted}/2
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Chores</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">completed</div>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Today's Activities ({todayActivities.length})
                  </h4>

                  {todayActivities.length > 0 ? (
                    <div className="space-y-1 max-h-20 sm:max-h-24 overflow-y-auto">
                      {todayActivities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between text-xs sm:text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="flex-1 dark:text-gray-200 truncate pr-2">
                            {activity.category}: {activity.description}
                          </span>
                          {activity.duration && (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {activity.duration}min
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">No activities logged yet</p>
                  )}
                </div>

                {/* Behavior Issues */}
                {todayBehaviors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Behavior Issues ({todayBehaviors.length})
                    </h4>

                    <div className="space-y-1 max-h-16 sm:max-h-20 overflow-y-auto">
                      {todayBehaviors.map(behavior => (
                        <div key={behavior.id} className="flex items-center justify-between text-xs sm:text-sm p-2 bg-red-50 dark:bg-red-900/30 rounded">
                          <span className="flex-1 text-red-700 dark:text-red-300 truncate pr-2">{behavior.type}</span>
                          <Badge variant="destructive" className="text-xs flex-shrink-0">
                            -{behavior.deduction}min
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overall Status */}
                <div className="pt-2 border-t dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">Status:</span>
                    <Badge 
                      variant={progress.minecraftTime > 0 ? "default" : "secondary"}
                      className={`text-xs sm:text-sm ${progress.minecraftTime > 0 ? "bg-green-600" : ""}`}
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
