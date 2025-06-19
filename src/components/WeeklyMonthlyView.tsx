import React, { useState } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval, format } from 'date-fns';
import WeeklyMonthlyHeader from './WeeklyMonthlyHeader';
import SummaryStats from './SummaryStats';
import BehaviorSummary from './BehaviorSummary';
import DailyBreakdownCard from './DailyBreakdownCard';

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
  vacationDays: string[];
  getMSTDate: () => string;
}

const WeeklyMonthlyView: React.FC<WeeklyMonthlyViewProps> = ({ 
  children, 
  activities, 
  behaviors,
  vacationDays,
  getMSTDate
}) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id || '');
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  
  const today = new Date(getMSTDate() + 'T00:00:00'); // Ensure we're working with MST date
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
      isWithinInterval(parseISO(activity.date + 'T00:00:00'), currentInterval)
    );
  };

  const getFilteredBehaviors = () => {
    return behaviors.filter(behavior => 
      behavior.childId === selectedChild &&
      isWithinInterval(parseISO(behavior.date + 'T00:00:00'), currentInterval)
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
      const isVacation = vacationDays.includes(dayString);
      const dayActivities = getFilteredActivities().filter(a => a.date === dayString);
      const dayBehaviors = getFilteredBehaviors().filter(b => b.date === dayString);
      
      // If it's a vacation day, return zero progress
      if (isVacation) {
        return {
          date: day,
          dateString: dayString,
          academicTime: 0,
          skillTime: 0,
          chores: 0,
          behaviorIssues: dayBehaviors.length,
          goalsMetCount: 0,
          allGoalsMet: false,
          isVacation: true
        };
      }
      
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
        allGoalsMet: goalsMetCount === 3,
        isVacation: false
      };
    });
  };

  const dailyData = getDailyBreakdown();

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <WeeklyMonthlyHeader
        viewType={viewType}
        setViewType={setViewType}
        selectedChild={selectedChild}
        setSelectedChild={setSelectedChild}
        children={children}
        currentInterval={currentInterval}
      />

      <SummaryStats stats={stats} />

      <BehaviorSummary
        totalBehaviorIssues={stats.totalBehaviorIssues}
        totalMinutesLost={stats.totalMinutesLost}
      />

      <DailyBreakdownCard
        dailyData={dailyData}
        selectedChildName={selectedChildName}
      />
    </div>
  );
};

export default WeeklyMonthlyView;
