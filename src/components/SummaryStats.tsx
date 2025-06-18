
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
  successfulDays: number;
  successRate: number;
  totalAcademicTime: number;
  totalSkillTime: number;
  totalChores: number;
}

interface SummaryStatsProps {
  stats: Stats;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-700">{stats.successfulDays}</div>
          <div className="text-xs sm:text-sm text-green-600">Successful Days</div>
          <div className="text-xs text-gray-500">{stats.successRate}% success</div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-700">{Math.round(stats.totalAcademicTime / 60)}h</div>
          <div className="text-xs sm:text-sm text-blue-600">Academic Time</div>
          <div className="text-xs text-gray-500">{stats.totalAcademicTime} min</div>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-700">{Math.round(stats.totalSkillTime / 60)}h</div>
          <div className="text-xs sm:text-sm text-orange-600">Skill Time</div>
          <div className="text-xs text-gray-500">{stats.totalSkillTime} min</div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-700">{stats.totalChores}</div>
          <div className="text-xs sm:text-sm text-purple-600">Chores Done</div>
          <div className="text-xs text-gray-500">Total completed</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
