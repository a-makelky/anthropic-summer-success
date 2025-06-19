import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface MathVerificationProps {
  children: any[];
  activities: any[];
  behaviors: any[];
  calculateDailyProgress: (childId: string, date?: string) => any;
}

const MathVerification: React.FC<MathVerificationProps> = ({ 
  children, 
  activities, 
  behaviors, 
  calculateDailyProgress 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const runVerification = () => {
    console.log('=== MATH VERIFICATION START ===');
    
    children.forEach(child => {
      console.log(`\n--- Verifying ${child.name} ---`);
      
      // Get today's activities
      const todayActivities = activities.filter(
        a => a.child_id === child.id && a.date === today && a.completed
      );
      
      // Get today's behaviors
      const todayBehaviors = behaviors.filter(
        b => b.child_id === child.id && b.date === today
      );
      
      // Manual calculation
      const educationTime = todayActivities
        .filter(a => a.type === 'education')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
        
      const skillTime = todayActivities
        .filter(a => a.type === 'skill')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
        
      const choresCount = todayActivities
        .filter(a => a.type === 'chore')
        .length;
        
      const behaviorDeductions = todayBehaviors
        .reduce((sum, b) => sum + b.deduction, 0);
      
      console.log('Manual calculations:');
      console.log(`- Education time: ${educationTime} minutes`);
      console.log(`- Skill time: ${skillTime} minutes`);
      console.log(`- Chores completed: ${choresCount}`);
      console.log(`- Behavior deductions: ${behaviorDeductions} minutes`);
      
      // Get calculated progress
      const progress = calculateDailyProgress(child.id);
      
      console.log('\nCalculated progress:');
      console.log(`- Academic time: ${progress.academicTime} minutes`);
      console.log(`- Skill time: ${progress.skillTime} minutes`);
      console.log(`- Chores completed: ${progress.choresCompleted}`);
      console.log(`- Minecraft time: ${progress.minecraftTime} minutes`);
      
      // Verify match
      const educationMatch = educationTime === progress.academicTime;
      const skillMatch = skillTime === progress.skillTime;
      const choresMatch = choresCount === progress.choresCompleted;
      
      console.log('\nVerification:');
      console.log(`- Education match: ${educationMatch ? '✅' : '❌'}`);
      console.log(`- Skill match: ${skillMatch ? '✅' : '❌'}`);
      console.log(`- Chores match: ${choresMatch ? '✅' : '❌'}`);
      
      // Verify Minecraft time calculation
      const allGoalsMet = educationTime >= 120 && skillTime >= 60 && choresCount >= 2;
      const expectedMinecraft = allGoalsMet ? Math.max(0, 45 - behaviorDeductions) : 0;
      const minecraftMatch = expectedMinecraft === progress.minecraftTime;
      
      console.log(`\nMinecraft time calculation:`);
      console.log(`- All goals met: ${allGoalsMet}`);
      console.log(`- Expected: ${expectedMinecraft} minutes`);
      console.log(`- Actual: ${progress.minecraftTime} minutes`);
      console.log(`- Match: ${minecraftMatch ? '✅' : '❌'}`);
    });
    
    console.log('\n=== MATH VERIFICATION END ===');
  };
  
  return (
    <Card className="mb-4 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-yellow-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Math Verification Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={runVerification} 
          variant="outline"
          className="w-full"
        >
          Run Verification (Check Console)
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          Click to verify calculations. Results will appear in browser console (F12).
        </p>
      </CardContent>
    </Card>
  );
};

export default MathVerification;