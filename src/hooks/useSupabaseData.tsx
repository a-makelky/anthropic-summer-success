
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Child {
  id: string;
  name: string;
}

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

interface Behavior {
  id: string;
  child_id: string;
  date: string;
  type: string;
  deduction: number;
}

interface VacationDay {
  id: string;
  date: string;
}

export const useSupabaseData = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [vacationDays, setVacationDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .order('name');

      if (childrenError) throw childrenError;

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Fetch behaviors
      const { data: behaviorsData, error: behaviorsError } = await supabase
        .from('behaviors')
        .select('*')
        .order('date', { ascending: false });

      if (behaviorsError) throw behaviorsError;

      // Fetch vacation days
      const { data: vacationData, error: vacationError } = await supabase
        .from('vacation_days')
        .select('*')
        .order('date');

      if (vacationError) throw vacationError;

      setChildren(childrenData || []);
      setActivities(activitiesData || []);
      setBehaviors(behaviorsData || []);
      setVacationDays(vacationData?.map(v => v.date) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add activity
  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          child_id: activity.child_id,
          date: activity.date,
          type: activity.type,
          category: activity.category,
          description: activity.description,
          duration: activity.duration,
          completed: activity.completed
        }])
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [data, ...prev]);
      toast.success('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  // Add behavior
  const addBehavior = async (behavior: Omit<Behavior, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('behaviors')
        .insert([{
          child_id: behavior.child_id,
          date: behavior.date,
          type: behavior.type,
          deduction: behavior.deduction
        }])
        .select()
        .single();

      if (error) throw error;

      setBehaviors(prev => [data, ...prev]);
      toast.success('Behavior logged successfully');
    } catch (error) {
      console.error('Error adding behavior:', error);
      toast.error('Failed to log behavior');
    }
  };

  // Toggle activity completion
  const toggleActivityCompletion = async (activityId: string) => {
    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const { error } = await supabase
        .from('activities')
        .update({ completed: !activity.completed })
        .eq('id', activityId);

      if (error) throw error;

      setActivities(prev => prev.map(a => 
        a.id === activityId ? { ...a, completed: !a.completed } : a
      ));
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity');
    }
  };

  // Toggle vacation day
  const toggleVacationDay = async (date: string) => {
    try {
      const isVacation = vacationDays.includes(date);
      
      if (isVacation) {
        const { error } = await supabase
          .from('vacation_days')
          .delete()
          .eq('date', date);

        if (error) throw error;

        setVacationDays(prev => prev.filter(d => d !== date));
      } else {
        const { error } = await supabase
          .from('vacation_days')
          .insert([{ date }]);

        if (error) throw error;

        setVacationDays(prev => [...prev, date].sort());
      }
    } catch (error) {
      console.error('Error toggling vacation day:', error);
      toast.error('Failed to update vacation day');
    }
  };

  return {
    children,
    activities,
    behaviors,
    vacationDays,
    loading,
    addActivity,
    addBehavior,
    toggleActivityCompletion,
    toggleVacationDay,
    refetch: fetchData
  };
};
