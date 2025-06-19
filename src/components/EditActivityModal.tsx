import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

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

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => Promise<void>;
  categories: {
    chore: string[];
    education: string[];
    skill: string[];
  };
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

const EditActivityModal: React.FC<EditActivityModalProps> = ({ 
  activity, 
  isOpen, 
  onClose, 
  onSave,
  categories 
}) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    duration: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activity) {
      setFormData({
        category: activity.category,
        description: activity.description,
        duration: activity.duration?.toString() || ''
      });
    }
  }, [activity]);

  const handleSave = async () => {
    if (!activity) return;
    
    setIsSaving(true);
    try {
      await onSave({
        ...activity,
        category: formData.category,
        description: formData.description,
        duration: formData.duration ? parseInt(formData.duration) : undefined
      });
      
      // Success animation
      toast.success(
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            ✅
          </motion.div>
          Activity updated successfully!
        </motion.div>
      );
      
      onClose();
    } catch (error) {
      toast.error('Failed to update activity');
    } finally {
      setIsSaving(false);
    }
  };

  if (!activity) return null;

  const categoryOptions = categories[activity.type] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Edit Activity
                </DialogTitle>
              </DialogHeader>
              
              <motion.div 
                className="space-y-6 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Category Selection */}
                <motion.div 
                  className="space-y-2"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
                
                {/* Description */}
                <motion.div 
                  className="space-y-2"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="resize-none"
                    placeholder="Add details..."
                  />
                </motion.div>
                
                {/* Duration (conditional) */}
                {(activity.type === 'education' || activity.type === 'skill') && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="30"
                      min="1"
                    />
                  </motion.div>
                )}
                
                {/* Action Buttons */}
                <motion.div 
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isSaving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Save className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EditActivityModal;