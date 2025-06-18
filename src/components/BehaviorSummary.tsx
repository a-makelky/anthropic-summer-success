
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface BehaviorSummaryProps {
  totalBehaviorIssues: number;
  totalMinutesLost: number;
}

const BehaviorSummary: React.FC<BehaviorSummaryProps> = ({ 
  totalBehaviorIssues, 
  totalMinutesLost 
}) => {
  if (totalBehaviorIssues === 0) return null;

  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700 text-base sm:text-lg">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          Behavior Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="text-sm">{totalBehaviorIssues} behavior issues logged</span>
          <Badge variant="destructive" className="text-xs">-{totalMinutesLost} minutes lost</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehaviorSummary;
