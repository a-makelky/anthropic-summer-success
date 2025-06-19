
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

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

export const useSupabaseData = (user: User | null) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [vacationDays, setVacationDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // MST timezone handling
  const getMSTDate = () => {
    const now = new Date();
    const mstOffset = -7 * 60; // MST is UTC-7
    const mstTime = new Date(now.getTime() + (mstOffset * 60 * 1000));
    return mstTime.toISOString().split('T')[0];
  };

  // Fetch all data - only when user is authenticated
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .order('name');

      if (childrenError) {
        throw childrenError;
      }

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false });

      if (activitiesError) {
        throw activitiesError;
      }

      // Fetch behaviors
      const { data: behaviorsData, error: behaviorsError } = await supabase
        .from('behaviors')
        .select('*')
        .order('date', { ascending: false });

      if (behaviorsError) {
        throw behaviorsError;
      }

      // Fetch vacation days
      const { data: vacationData, error: vacationError } = await supabase
        .from('vacation_days')
        .select('*')
        .order('date');

      if (vacationError) {
        throw vacationError;
      }

      setChildren(childrenData || []);
      setActivities(activitiesData || []);
      
      // Use the deduction field directly since it exists in the database
      setBehaviors(behaviorsData || []);
      
      setVacationDays(vacationData?.map(v => v.date) || []);
    } catch (error: any) {
      toast.error('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only fetch data when user changes and is authenticated
  useEffect(() => {
    fetchData();
  }, [user]);

  // Add activity
  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to add activities');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          child_id: activity.child_id,
          date: activity.date,
          type: activity.type,
          category: activity.category,
          description: activity.description,
          duration: activity.duration,
          completed: activity.completed
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setActivities(prev => [data, ...prev]);
      toast.success('Activity added successfully');
      
      // Refresh data to ensure consistency
      setTimeout(async () => {
        await fetchData();
        toast.success('Dashboard updated!');
      }, 100);
    } catch (error: any) {
      toast.error(`Failed to add activity: ${error.message || 'Unknown error'}`);
    }
  };

  // Add behavior
  const addBehavior = async (behavior: Omit<Behavior, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to log behaviors');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('behaviors')
        .insert({
          child_id: behavior.child_id,
          date: behavior.date,
          type: behavior.type,
          deduction: behavior.deduction
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBehaviors(prev => [data, ...prev]);
      toast.success('Behavior logged successfully');
      
      // Refresh data
      setTimeout(() => {
        fetchData();
      }, 100);
    } catch (error: any) {
      toast.error(`Failed to log behavior: ${error.message || 'Unknown error'}`);
    }
  };

  // Toggle activity completion
  const toggleActivityCompletion = async (activityId: string) => {
    if (!user) {
      toast.error('You must be logged in to update activities');
      return;
    }

    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const { error } = await supabase
        .from('activities')
        .update({ completed: !activity.completed })
        .eq('id', activityId);

      if (error) {
        throw error;
      }

      setActivities(prev => prev.map(a => 
        a.id === activityId ? { ...a, completed: !a.completed } : a
      ));
    } catch (error) {
      toast.error('Failed to update activity');
    }
  };

  // Toggle vacation day
  const toggleVacationDay = async (date: string) => {
    if (!user) {
      toast.error('You must be logged in to update vacation days');
      return;
    }

    try {
      const isVacation = vacationDays.includes(date);
      
      if (isVacation) {
        const { error } = await supabase
          .from('vacation_days')
          .delete()
          .eq('date', date);

        if (error) {
          throw error;
        }

        setVacationDays(prev => prev.filter(d => d !== date));
      } else {
        const { error } = await supabase
          .from('vacation_days')
          .insert([{ date }]);

        if (error) {
          throw error;
        }

        setVacationDays(prev => [...prev, date].sort());
      }
    } catch (error) {
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
    refetch: fetchData,
    refetchData: fetchData,
    getMSTDate
  };
};
