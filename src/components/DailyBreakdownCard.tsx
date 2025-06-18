
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import DailyProgressItem from './DailyProgressItem';

interface DayData {
  date: Date;
  dateString: string;
  academicTime: number;
  skillTime: number;
  chores: number;
  behaviorIssues: number;
  goalsMetCount: number;
  allGoalsMet: boolean;
  isVacation: boolean;
}

interface DailyBreakdownCardProps {
  dailyData: DayData[];
  selectedChildName: string;
}

const DailyBreakdownCard: React.FC<DailyBreakdownCardProps> = ({ 
  dailyData, 
  selectedChildName 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Daily Breakdown - {selectedChildName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {dailyData.map(day => (
            <DailyProgressItem key={day.dateString} day={day} />
          ))}
        </div>
        
        {dailyData.length === 0 && (
          <p className="text-gray-500 text-center py-8 italic text-sm">
            No data available for this period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBreakdownCard;
