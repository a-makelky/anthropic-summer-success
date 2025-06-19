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
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-lg">
            Viewing: {format(new Date(selectedDate + 'T00:00:00'), 'MMMM d, yyyy')}
          </span>
          {!isToday && (
            <span className="text-sm text-orange-600 font-medium">
              (Not today - viewing historical data)
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevDay}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Select Date
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
          >
            Today
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            disabled={isToday}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;