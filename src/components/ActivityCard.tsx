import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Clock, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  child_id: string;
  date: string;
  type: 'chore' | 'education' | 'skill';
  category: string;
  description: string;
  duration?: number;
  completed: boolean;
}

interface ActivityCardProps {
  activity: Activity;
  childName: string;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  childName,
  onEdit,
  onDelete,
  index
}) => {
  const getTypeColor = () => {
    switch (activity.type) {
      case 'chore':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'education':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'skill':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = () => {
    switch (activity.type) {
      case 'chore':
        return '🏠';
      case 'education':
        return '📚';
      case 'skill':
        return '💪';
      default:
        return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      layout
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getTypeIcon()}</span>
                <Badge variant="outline" className={getTypeColor()}>
                  {activity.type}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {childName}
                </Badge>
              </div>
              
              {/* Category and Description */}
              <h4 className="font-semibold text-lg mb-1">{activity.category}</h4>
              <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
              
              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(activity.date), 'MMM d, yyyy')}
                </div>
                
                {activity.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {activity.duration} min
                  </div>
                )}
                
                {activity.completed && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(activity)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(activity)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;