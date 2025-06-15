
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, Target, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns';

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

interface WeeklyMonthlyViewProps {
  children: Child[];
  activities: Activity[];
  behaviors: Behavior[];
}

const WeeklyMonthlyView: React.FC<WeeklyMonthlyViewProps> = ({ 
  children, 
  activities, 
  behaviors 
}) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const currentInterval = viewType === 'weekly' 
    ? { start: weekStart, end: weekEnd }
    : { start: monthStart, end: monthEnd };

  // Filter data for selected child and time period
  const getFilteredActivities = () => {
    return activities.filter(activity => 
      activity.childId === selectedChild &&
      isWithinInterval(parseISO(activity.date), currentInterval)
    );
  };

  const getFilteredBehaviors = () => {
    return behaviors.filter(behavior => 
      behavior.childId === selectedChild &&
      isWithinInterval(parseISO(behavior.date), currentInterval)
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    const periodActivities = getFilteredActivities();
    const periodBehaviors = getFilteredBehaviors();
    
    const totalAcademicTime = periodActivities
      .filter(a => a.type === 'education' && a.completed)
      .reduce((sum, a) => sum + (a.duration || 0), 0);
    
    const totalSkillTime = periodActivities
      .filter(a => a.type === 'skill' && a.completed)
      .reduce((sum, a) => sum + (a.duration || 0), 0);
    
    const totalChores = periodActivities
      .filter(a => a.type === 'chore' && a.completed).length;
    
    const totalBehaviorIssues = periodBehaviors.length;
    const totalMinutesLost = periodBehaviors.reduce((sum, b) => sum + b.deduction, 0);
    
    // Calculate days with all goals met
    const daysInPeriod = eachDayOfInterval(currentInterval);
    const successfulDays = daysInPeriod.filter(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayActivities = periodActivities.filter(a => a.date === dayString);
      
      const dayAcademic = dayActivities
        .filter(a => a.type === 'education' && a.completed)
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      
      const daySkill = dayActivities
        .filter(a => a.type === 'skill' && a.completed)
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      
      const dayChores = dayActivities
        .filter(a => a.type === 'chore' && a.completed).length;
      
      return dayAcademic >= 120 && daySkill >= 60 && dayChores >= 2;
    }).length;

    return {
      totalAcademicTime,
      totalSkillTime,
      totalChores,
      totalBehaviorIssues,
      totalMinutesLost,
      successfulDays,
      totalDays: daysInPeriod.length,
      successRate: Math.round((successfulDays / daysInPeriod.length) * 100)
    };
  };

  const stats = calculateStats();
  const selectedChildName = children.find(c => c.id === selectedChild)?.name || '';

  // Get daily breakdown
  const getDailyBreakdown = () => {
    const daysInPeriod = eachDayOfInterval(currentInterval);
    return daysInPeriod.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const dayActivities = getFilteredActivities().filter(a => a.date === dayString);
      const dayBehaviors = getFilteredBehaviors().filter(b => b.date === dayString);
      
      const academicTime = dayActivities
        .filter(a => a.type === 'education' && a.completed)
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      
      const skillTime = dayActivities
        .filter(a => a.type === 'skill' && a.completed)
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      
      const chores = dayActivities
        .filter(a => a.type === 'chore' && a.completed).length;
      
      const behaviorIssues = dayBehaviors.length;
      const goalsMetCount = [
        academicTime >= 120,
        skillTime >= 60,
        chores >= 2
      ].filter(Boolean).length;

      return {
        date: day,
        dateString: dayString,
        academicTime,
        skillTime,
        chores,
        behaviorIssues,
        goalsMetCount,
        allGoalsMet: goalsMetCount === 3
      };
    });
  };

  const dailyData = getDailyBreakdown();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            📈 {viewType === 'weekly' ? 'Weekly' : 'Monthly'} Overview
          </h2>
          <p className="text-gray-600">
            {format(currentInterval.start, 'MMM d')} - {format(currentInterval.end, 'MMM d, yyyy')}
          </p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={selectedChild} 
            onChange={(e) => setSelectedChild(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
          
          <div className="flex gap-2">
            <Button 
              variant={viewType === 'weekly' ? 'default' : 'outline'}
              onClick={() => setViewType('weekly')}
              size="sm"
            >
              Weekly
            </Button>
            <Button 
              variant={viewType === 'monthly' ? 'default' : 'outline'}
              onClick={() => setViewType('monthly')}
              size="sm"
            >
              Monthly
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.successfulDays}</div>
            <div className="text-sm text-green-600">Successful Days</div>
            <div className="text-xs text-gray-500">{stats.successRate}% success rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{Math.round(stats.totalAcademicTime / 60)}h</div>
            <div className="text-sm text-blue-600">Academic Time</div>
            <div className="text-xs text-gray-500">{stats.totalAcademicTime} minutes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">{Math.round(stats.totalSkillTime / 60)}h</div>
            <div className="text-sm text-orange-600">Skill Time</div>
            <div className="text-xs text-gray-500">{stats.totalSkillTime} minutes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.totalChores}</div>
            <div className="text-sm text-purple-600">Chores Done</div>
            <div className="text-xs text-gray-500">Total completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Behavior Summary */}
      {stats.totalBehaviorIssues > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Behavior Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span>{stats.totalBehaviorIssues} behavior issues logged</span>
              <Badge variant="destructive">-{stats.totalMinutesLost} minutes lost</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Breakdown - {selectedChildName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyData.map(day => (
              <div key={day.dateString} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="font-medium min-w-[80px]">
                    {format(day.date, 'MMM d')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(day.date, 'EEEE')}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 text-sm">
                    <span className={`px-2 py-1 rounded ${day.academicTime >= 120 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      📚 {day.academicTime}min
                    </span>
                    <span className={`px-2 py-1 rounded ${day.skillTime >= 60 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      💪 {day.skillTime}min
                    </span>
                    <span className={`px-2 py-1 rounded ${day.chores >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      🏠 {day.chores}
                    </span>
                  </div>
                  
                  {day.behaviorIssues > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{day.behaviorIssues} issues
                    </Badge>
                  )}
                  
                  {day.allGoalsMet ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {dailyData.length === 0 && (
            <p className="text-gray-500 text-center py-8 italic">
              No data available for this period
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyMonthlyView;
