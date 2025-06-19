
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle2, LogOut, BarChart3, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import ActivityLogger from '@/components/ActivityLogger';
import BehaviorLogger from '@/components/BehaviorLogger';
import QuickStats from '@/components/QuickStats';
import WeeklyMonthlyView from '@/components/WeeklyMonthlyView';
import ActivityCard from '@/components/ActivityCard';
import EditActivityModal from '@/components/EditActivityModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import ExportDataButton from '@/components/ExportDataButton';
import { AchievementGallery } from '@/components/AchievementBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import DebugPanel from '@/components/DebugPanel';
import MathVerification from '@/components/MathVerification';
import DebugDataFlow from '@/components/DebugDataFlow';
import DateSelector from '@/components/DateSelector';
import ThemeToggle from '@/components/ThemeToggle';

// Category options for activities
const categories = {
  chore: [
    'Clean Room',
    'Clean Bathroom', 
    'Clean Kitchen',
    'Clean Basement',
    'Clean Garage',
    'Clean Yard',
    'Vacuum',
    'Take Out Trash',
    'Load/Unload Dishwasher'
  ],
  education: [
    'Math Skills',
    'Reading',
    'Coding',
    'Drawing',
    'Educational Outing',
    'Science Project',
    'Writing Practice'
  ],
  skill: [
    'Workout',
    'Football Skills',
    'Basketball Skills',
    'Wrestling Skills',
    'Swimming',
    'Bike Ride',
    'Music Practice',
    'Art Practice'
  ]
};

const IndexEnhanced = () => {
  const { user, signOut } = useAuth();
  const {
    children,
    activities,
    behaviors,
    vacationDays,
    loading,
    addActivity,
    addBehavior,
    toggleActivityCompletion,
    toggleVacationDay,
    refetchData,
    getMSTDate
  } = useSupabaseData(user);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingActivity, setEditingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const today = getMSTDate ? getMSTDate() : new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Calculate daily progress with MST timezone support
  const calculateDailyProgress = (childId, date = selectedDate) => {
    if (vacationDays.includes(date)) {
      return {
        childId,
        date,
        academicTime: 0,
        skillTime: 0,
        choresCompleted: 0,
        minecraftTime: 0
      };
    }

    const dayActivities = activities.filter(
      a => a.child_id === childId && a.date === date && a.completed
    );

    const academicTime = dayActivities
      .filter(a => a.type === 'education')
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    const skillTime = dayActivities
      .filter(a => a.type === 'skill')
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    const choresCompleted = dayActivities
      .filter(a => a.type === 'chore')
      .length;

    const behaviorDeductions = behaviors
      .filter(b => b.child_id === childId && b.date === date)
      .reduce((sum, b) => sum + (b.deduction || 0), 0);

    // Calculate Minecraft time
    let minecraftTime = 0;
    if (academicTime >= 120 && skillTime >= 60 && choresCompleted >= 2) {
      minecraftTime = Math.max(0, 45 - behaviorDeductions);
      
      // Celebration for completing all goals
      if (minecraftTime > 0 && !sessionStorage.getItem(`celebrated-${childId}-${date}`)) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success(`🎉 All goals completed! ${minecraftTime} minutes of Minecraft earned!`);
          sessionStorage.setItem(`celebrated-${childId}-${date}`, 'true');
        }, 500);
      }
    }

    return {
      childId,
      date,
      academicTime,
      skillTime,
      choresCompleted,
      minecraftTime
    };
  };

  // Handle edit activity
  const handleEditActivity = async (updatedActivity) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({
          category: updatedActivity.category,
          description: updatedActivity.description,
          duration: updatedActivity.duration
        })
        .eq('id', updatedActivity.id);

      if (error) throw error;
      
      await refetchData();
      setEditingActivity(null);
    } catch (error) {
      toast.error('Failed to update activity');
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async () => {
    if (!deletingActivity) return;
    
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', deletingActivity.id);

      if (error) throw error;
      
      toast.success('Activity deleted successfully');
      await refetchData();
      setDeletingActivity(null);
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Card className="text-center p-4 sm:p-8 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🌞 Summer Success Tracker
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Please sign in to access the dashboard</p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
            >
              Go to Login
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-center"
        >
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your amazing dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 transition-colors duration-300">
      <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
        {/* Mobile-Optimized Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0"
        >
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Summer Success Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Track progress, earn rewards, achieve greatness!</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <ThemeToggle />
            <div className="hidden sm:block">
              <ExportDataButton 
                activities={activities}
                behaviors={behaviors}
                children={children}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </motion.div>

        {/* Analytics Dashboard (Toggle) */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 sm:mb-8 overflow-hidden"
            >
              <AnalyticsDashboard
                activities={activities}
                behaviors={behaviors}
                children={children}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile-Optimized Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[400px] sm:min-w-0">
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm px-2 sm:px-3">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="activities" className="text-xs sm:text-sm px-2 sm:px-3">
                Activities
              </TabsTrigger>
              <TabsTrigger value="behaviors" className="text-xs sm:text-sm px-2 sm:px-3">
                Behaviors
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm px-2 sm:px-3">
                <Trophy className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs sm:text-sm px-2 sm:px-3">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Date Selector */}
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                getMSTDate={getMSTDate}
              />
              
              {/* Debug Components - Hidden on mobile */}
              <div className="hidden lg:block">
                <DebugDataFlow
                  children={children}
                  activities={activities}
                  behaviors={behaviors}
                />
                
                <DebugPanel
                  children={children}
                  activities={activities}
                  behaviors={behaviors}
                  calculateDailyProgress={calculateDailyProgress}
                  selectedDate={selectedDate}
                />
                
                <MathVerification
                  children={children}
                  activities={activities}
                  behaviors={behaviors}
                  calculateDailyProgress={calculateDailyProgress}
                />
              </div>
              
              <QuickStats 
                activities={activities} 
                behaviors={behaviors} 
                children={children}
                vacationDays={vacationDays}
                calculateDailyProgress={calculateDailyProgress}
                selectedDate={selectedDate}
              />
              
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                {children.map((child, index) => {
                  const progress = calculateDailyProgress(child.id);
                  const isVacation = vacationDays.includes(selectedDate);
                  
                  return (
                    <motion.div
                      key={child.id}
                      initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <span className="text-xl sm:text-2xl">{child.name}</span>
                            <motion.div 
                              className="flex items-center gap-2"
                              animate={{ scale: progress.minecraftTime > 0 ? [1, 1.1, 1] : 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Clock className="w-5 h-5 text-green-600" />
                              <Badge variant="secondary" className="text-sm sm:text-lg px-2 sm:px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                                {progress.minecraftTime} min
                              </Badge>
                            </motion.div>
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-4 sm:space-y-6">
                          {/* Progress bars with animations */}
                          <motion.div className="space-y-3 sm:space-y-4">
                            {/* Academic Progress */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-purple-700 text-sm sm:text-base">📚 Academic Time</span>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {progress.academicTime}/120 minutes
                                </span>
                              </div>
                              <div className="relative">
                                <Progress 
                                  value={(progress.academicTime / 120) * 100} 
                                  className="h-2 sm:h-3"
                                />
                                {progress.academicTime >= 120 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-2 -top-2"
                                  >
                                    <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 fill-green-100" />
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Skill Progress */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-orange-700 text-sm sm:text-base">💪 Skill Training</span>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {progress.skillTime}/60 minutes
                                </span>
                              </div>
                              <div className="relative">
                                <Progress 
                                  value={(progress.skillTime / 60) * 100} 
                                  className="h-2 sm:h-3"
                                />
                                {progress.skillTime >= 60 && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-2 -top-2"
                                  >
                                    <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-600 fill-green-100" />
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Chores Progress */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-blue-700 text-sm sm:text-base">🏠 Chores</span>
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {progress.choresCompleted}/2 completed
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {[1, 2].map(i => (
                                  <motion.div 
                                    key={i}
                                    animate={{ 
                                      scale: progress.choresCompleted >= i ? [1, 1.1, 1] : 1,
                                      backgroundColor: progress.choresCompleted >= i ? '#10b981' : '#e5e7eb'
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`h-6 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-medium ${
                                      progress.choresCompleted >= i 
                                        ? 'text-white' 
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    {progress.choresCompleted >= i ? '✓ Done' : `Chore ${i}`}
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4 sm:space-y-6">
            <ActivityLogger 
              children={children}
              onAddActivity={addActivity}
              vacationDays={vacationDays}
              onToggleVacation={toggleVacationDay}
            />
            
            {/* Mobile Export Button */}
            <div className="sm:hidden">
              <ExportDataButton 
                activities={activities}
                behaviors={behaviors}
                children={children}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Recent Activities</h3>
              <div className="space-y-3">
                {activities.slice(0, 10).map((activity, index) => {
                  const child = children.find(c => c.id === activity.child_id);
                  return (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      childName={child?.name || 'Unknown'}
                      onEdit={setEditingActivity}
                      onDelete={setDeletingActivity}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Behaviors Tab */}
          <TabsContent value="behaviors">
            <BehaviorLogger 
              children={children}
              onAddBehavior={addBehavior}
            />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AchievementGallery 
                activities={activities}
                children={children}
              />
            </motion.div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <WeeklyMonthlyView 
              activities={activities}
              children={children}
              vacationDays={vacationDays}
              behaviors={behaviors}
              getMSTDate={getMSTDate}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <EditActivityModal
          activity={editingActivity}
          isOpen={!!editingActivity}
          onClose={() => setEditingActivity(null)}
          onSave={handleEditActivity}
          categories={categories}
        />

        <DeleteConfirmDialog
          isOpen={!!deletingActivity}
          onConfirm={handleDeleteActivity}
          onCancel={() => setDeletingActivity(null)}
          itemName={deletingActivity?.description || ''}
          itemType="Activity"
        />
      </div>
    </div>
  );
};

export default IndexEnhanced;
