
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Child {
  id: string;
  name: string;
}

interface WeeklyMonthlyHeaderProps {
  viewType: 'weekly' | 'monthly';
  setViewType: (type: 'weekly' | 'monthly') => void;
  selectedChild: string;
  setSelectedChild: (childId: string) => void;
  children: Child[];
  currentInterval: { start: Date; end: Date };
}

const WeeklyMonthlyHeader: React.FC<WeeklyMonthlyHeaderProps> = ({
  viewType,
  setViewType,
  selectedChild,
  setSelectedChild,
  children,
  currentInterval
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          📈 {viewType === 'weekly' ? 'Weekly' : 'Monthly'} Overview
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {format(currentInterval.start, 'MMM d')} - {format(currentInterval.end, 'MMM d, yyyy')}
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <select 
          value={selectedChild} 
          onChange={(e) => setSelectedChild(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border rounded-lg bg-white text-sm"
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>
        
        <div className="flex gap-2 justify-center">
          <Button 
            variant={viewType === 'weekly' ? 'default' : 'outline'}
            onClick={() => setViewType('weekly')}
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Weekly
          </Button>
          <Button 
            variant={viewType === 'monthly' ? 'default' : 'outline'}
            onClick={() => setViewType('monthly')}
            size="sm"
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Monthly
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMonthlyHeader;
