
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  getMSTDate?: () => string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  onDateChange,
  getMSTDate 
}) => {
  const today = getMSTDate ? getMSTDate() : new Date().toISOString().split('T')[0];

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    onDateChange(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange(today);
  };

  const isToday = selectedDate === today;

  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 text-center sm:text-left">
          <CalendarIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-sm sm:text-lg block">
              Viewing: {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
            </span>
            {!isToday && (
              <span className="text-xs sm:text-sm text-orange-600 font-medium block sm:inline">
                (Not today - viewing historical data)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevDay}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <ChevronLeft className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <CalendarIcon className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Select Date</span>
                <span className="sm:hidden">Date</span>
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

          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onClick={handleToday}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            disabled={isToday}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
