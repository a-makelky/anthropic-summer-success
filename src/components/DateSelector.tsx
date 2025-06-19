
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  getMSTDate: () => string;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  getMSTDate
}) => {
  const today = getMSTDate();
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-700">Date:</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate === today ? 'Today' : format(new Date(selectedDate), 'MMM d, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={new Date(selectedDate)}
            onSelect={(date) => {
              if (date) {
                onDateChange(format(date, 'yyyy-MM-dd'));
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {selectedDate !== today && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDateChange(today)}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Today
        </Button>
      )}
    </div>
  );
};

export default DateSelector;
