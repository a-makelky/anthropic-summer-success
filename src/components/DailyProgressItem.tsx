
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

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

interface DailyProgressItemProps {
  day: DayData;
}

const DailyProgressItem: React.FC<DailyProgressItemProps> = ({ day }) => {
  return (
    <div className={`p-3 rounded-lg border ${
      day.isVacation ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Date Info */}
        <div className="flex items-center gap-3">
          <div className="font-medium text-sm min-w-[60px] sm:min-w-[80px]">
            {format(day.date, 'MMM d')}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {format(day.date, 'EEEE')}
          </div>
          {day.isVacation && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
              🏖️ Vacation
            </Badge>
          )}
        </div>
        
        {/* Progress Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {!day.isVacation ? (
            <>
              {/* Stats - Mobile: Stacked, Desktop: Row */}
              <div className="flex flex-wrap gap-1 sm:gap-2 text-xs">
                <span className={`px-2 py-1 rounded text-xs ${day.academicTime >= 120 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  📚 {day.academicTime}min
                </span>
                <span className={`px-2 py-1 rounded text-xs ${day.skillTime >= 60 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  💪 {day.skillTime}min
                </span>
                <span className={`px-2 py-1 rounded text-xs ${day.chores >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  🏠 {day.chores}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {day.behaviorIssues > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{day.behaviorIssues} issues
                  </Badge>
                )}
                
                {day.allGoalsMet ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
            </>
          ) : (
            <div className="text-orange-600 text-xs sm:text-sm font-medium">
              No tracking on vacation day
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyProgressItem;
