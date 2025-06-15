import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Star, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import ActivityLogger from '@/components/ActivityLogger';
import BehaviorLogger from '@/components/BehaviorLogger';
import QuickStats from '@/components/QuickStats';
import WeeklyMonthlyView from '@/components/WeeklyMonthlyView';

// Types
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
  duration?: number; // in minutes
  completed: boolean;
}

interface Behavior {
  id: string;
  childId: string;
  date: string;
  type: string;
  deduction: number; // in minutes
}

interface DailyProgress {
  childId: string;
  date: string;
  academicTime: number; // in minutes
  skillTime: number; // in minutes
  choresCompleted: number;
  minecraftTime: number; // net minecraft time earned
}

const Index = () => {
  const [children] = useState<Child[]>([
    { id: '1', name: 'Mac' },
    { id: '2', name: 'Miles' }
  ]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const today = new Date().toISOString().split('T')[0];

  // Calculate daily progress for each child
  const calculateDailyProgress = (childId: string): DailyProgress => {
    const todayActivities = activities.filter(a => a.childId === childId && a.date === today);
    const todayBehaviors = behaviors.filter(b => b.childId === childId && b.date === today);

    const academicTime = todayActivities
      .filter(a => a.type === 'education' && a.completed)
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    const skillTime = todayActivities
      .filter(a => a.type === 'skill' && a.completed)
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    const choresCompleted = todayActivities
      .filter(a => a.type === 'chore' && a.completed).length;

    // Base minecraft time: 45 minutes if all goals met
    const goalsReached = academicTime >= 120 && skillTime >= 60 && choresCompleted >= 2;
    const baseMinecraftTime = goalsReached ? 45 : 0;

    // Deductions from behavior
    const totalDeductions = todayBehaviors.reduce((sum, b) => sum + b.deduction, 0);

    const minecraftTime = Math.max(0, baseMinecraftTime - totalDeductions);

    return {
      childId,
      date: today,
      academicTime,
      skillTime,
      choresCompleted,
      minecraftTime
    };
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString()
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const addBehavior = (behavior: Omit<Behavior, 'id'>) => {
    const newBehavior = {
      ...behavior,
      id: Date.now().toString()
    };
    setBehaviors(prev => [...prev, newBehavior]);
  };

  const toggleActivityCompletion = (activityId: string) => {
    setActivities(prev => prev.map(a => 
      a.id === activityId ? { ...a, completed: !a.completed } : a
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌞 Summer Success Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Track daily goals and earn Minecraft time!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
            <TabsTrigger value="log-activity">📝 Log Activity</TabsTrigger>
            <TabsTrigger value="log-behavior">⚠️ Log Behavior</TabsTrigger>
            <TabsTrigger value="quick-stats">📈 Stats</TabsTrigger>
            <TabsTrigger value="weekly-monthly">📅 Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {children.map(child => {
                const progress = calculateDailyProgress(child.id);
                const todayActivities = activities.filter(a => a.childId === child.id && a.date === today);
                
                return (
                  <Card key={child.id} className="bg-white shadow-lg border-2 border-blue-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-2xl">
                        <span className="text-blue-700">{child.name}</span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <Badge variant="secondary" className="text-lg px-3 py-1 bg-green-100 text-green-700">
                            {progress.minecraftTime} min
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Academic Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-purple-700">📚 Academic Time</span>
                          <span className="text-sm text-gray-600">
                            {progress.academicTime}/120 minutes
                          </span>
                        </div>
                        <Progress 
                          value={(progress.academicTime / 120) * 100} 
                          className="h-3"
                        />
                        {progress.academicTime >= 120 && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Goal Reached!
                          </div>
                        )}
                      </div>

                      {/* Skill Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-orange-700">💪 Skill Training</span>
                          <span className="text-sm text-gray-600">
                            {progress.skillTime}/60 minutes
                          </span>
                        </div>
                        <Progress 
                          value={(progress.skillTime / 60) * 100} 
                          className="h-3"
                        />
                        {progress.skillTime >= 60 && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Goal Reached!
                          </div>
                        )}
                      </div>

                      {/* Chores Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-blue-700">🏠 Chores</span>
                          <span className="text-sm text-gray-600">
                            {progress.choresCompleted}/2 completed
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2].map(i => (
                            <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                              progress.choresCompleted >= i 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {progress.choresCompleted >= i ? '✓ Done' : `Chore ${i}`}
                            </div>
                          ))}
                        </div>
                        {progress.choresCompleted >= 2 && (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            All Chores Done!
                          </div>
                        )}
                      </div>

                      {/* Recent Activities */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Today's Activities</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {todayActivities.length > 0 ? (
                            todayActivities.map(activity => (
                              <div key={activity.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                                <input
                                  type="checkbox"
                                  checked={activity.completed}
                                  onChange={() => toggleActivityCompletion(activity.id)}
                                  className="rounded"
                                />
                                <span className={activity.completed ? 'line-through text-gray-500' : ''}>
                                  {activity.category}: {activity.description}
                                  {activity.duration && ` (${activity.duration}min)`}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm italic">No activities logged yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="log-activity">
            <ActivityLogger children={children} onAddActivity={addActivity} />
          </TabsContent>

          <TabsContent value="log-behavior">
            <BehaviorLogger children={children} onAddBehavior={addBehavior} />
          </TabsContent>

          <TabsContent value="quick-stats">
            <QuickStats 
              children={children} 
              activities={activities} 
              behaviors={behaviors}
              calculateDailyProgress={calculateDailyProgress}
            />
          </TabsContent>

          <TabsContent value="weekly-monthly">
            <WeeklyMonthlyView 
              children={children} 
              activities={activities} 
              behaviors={behaviors}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
