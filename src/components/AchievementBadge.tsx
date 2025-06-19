
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Zap, Target, Flame, Award } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  isNew?: boolean;
  onUnlock?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isNew = false,
  onUnlock
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isNew && achievement.unlocked) {
      setShowCelebration(true);
      
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setShowCelebration(false);
          if (onUnlock) onUnlock();
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#9333ea', '#3b82f6', '#fb923c', '#10b981', '#ef4444']
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#9333ea', '#3b82f6', '#fb923c', '#10b981', '#ef4444']
        });
      }, 250);
    }
  }, [isNew, achievement.unlocked]);

  const badgeVariants = {
    locked: { scale: 0.8, opacity: 0.5 },
    unlocked: { scale: 1, opacity: 1 },
    hover: { scale: 1.1, rotate: [0, -5, 5, 0] }
  };

  return (
    <motion.div
      initial={achievement.unlocked ? "unlocked" : "locked"}
      animate={achievement.unlocked ? "unlocked" : "locked"}
      whileHover={achievement.unlocked ? "hover" : undefined}
      variants={badgeVariants}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative"
    >
      <Card className={`relative overflow-hidden ${
        achievement.unlocked 
          ? 'border-2 shadow-lg cursor-pointer' 
          : 'border opacity-60'
      }`} style={{ borderColor: achievement.unlocked ? achievement.color : '#e5e7eb' }}>
        <CardContent className="p-6 text-center">
          {/* Achievement Icon */}
          <motion.div 
            className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              achievement.unlocked ? 'bg-gradient-to-br' : 'bg-gray-200'
            }`}
            style={{
              backgroundImage: achievement.unlocked 
                ? `linear-gradient(135deg, ${achievement.color}22, ${achievement.color}44)`
                : undefined
            }}
            animate={showCelebration ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: showCelebration ? Infinity : 0 }}
          >
            <div style={{ color: achievement.unlocked ? achievement.color : '#9ca3af' }}>
              {achievement.icon}
            </div>
          </motion.div>

          {/* Achievement Name */}
          <h3 className={`font-semibold text-lg mb-1 ${
            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {achievement.name}
          </h3>

          {/* Achievement Description */}
          <p className="text-sm text-muted-foreground mb-3">
            {achievement.description}
          </p>

          {/* Status Badge */}
          <Badge 
            variant={achievement.unlocked ? "default" : "outline"}
            className={achievement.unlocked ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            {achievement.unlocked ? 'Unlocked' : 'Locked'}
          </Badge>

          {/* Unlock Date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </CardContent>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none"
            >
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Star className="w-24 h-24 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Achievement Gallery Component
export const AchievementGallery: React.FC<{ activities: any[], children: any[] }> = ({ activities, children }) => {
  const calculateAchievements = (): Achievement[] => {
    const totalActivities = activities.length;
    const educationHours = activities
      .filter(a => a.type === 'education')
      .reduce((sum, a) => sum + (a.duration || 0), 0) / 60;
    const choreCount = activities.filter(a => a.type === 'chore').length;
    
    return [
      {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first activity',
        icon: <Trophy className="w-8 h-8" />,
        color: '#10b981',
        unlocked: totalActivities >= 1,
        unlockedAt: totalActivities >= 1 ? new Date() : undefined
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        description: 'Complete 7 days in a row',
        icon: <Flame className="w-8 h-8" />,
        color: '#ef4444',
        unlocked: false, // Would need streak calculation
        unlockedAt: undefined
      },
      {
        id: 'study-master',
        name: 'Study Master',
        description: 'Complete 10 hours of education',
        icon: <Target className="w-8 h-8" />,
        color: '#9333ea',
        unlocked: educationHours >= 10,
        unlockedAt: educationHours >= 10 ? new Date() : undefined
      },
      {
        id: 'chore-champion',
        name: 'Chore Champion',
        description: 'Complete 20 chores',
        icon: <Award className="w-8 h-8" />,
        color: '#3b82f6',
        unlocked: choreCount >= 20,
        unlockedAt: choreCount >= 20 ? new Date() : undefined
      },
      {
        id: 'all-star',
        name: 'All Star',
        description: 'Complete 50 total activities',
        icon: <Star className="w-8 h-8" />,
        color: '#f59e0b',
        unlocked: totalActivities >= 50,
        unlockedAt: totalActivities >= 50 ? new Date() : undefined
      },
      {
        id: 'lightning-fast',
        name: 'Lightning Fast',
        description: 'Complete 5 activities in one day',
        icon: <Zap className="w-8 h-8" />,
        color: '#8b5cf6',
        unlocked: false, // Would need daily calculation
        unlockedAt: undefined
      }
    ];
  };

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {unlockedCount} / {achievements.length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementBadge achievement={achievement} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadge;
