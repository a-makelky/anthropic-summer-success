
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
  time_deducted?: number; // Database column name
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

  // Fetch all data - only when user is authenticated
  const fetchData = async () => {
    if (!user) {
      // No user authenticated, skipping data fetch
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching data for authenticated user:', user.id);
      setLoading(true);

      // Fetch children
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .order('name');

      if (childrenError) {
        console.error('Error fetching children:', childrenError);
        throw childrenError;
      }
      
      console.log('Children fetched:', childrenData);

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: false });

      if (activitiesError) {
        // console.error('Error fetching activities:', activitiesError);
        throw activitiesError;
      }

      // Fetch behaviors
      const { data: behaviorsData, error: behaviorsError } = await supabase
        .from('behaviors')
        .select('*')
        .order('date', { ascending: false });

      if (behaviorsError) {
        // console.error('Error fetching behaviors:', behaviorsError);
        throw behaviorsError;
      }

      // Fetch vacation days
      const { data: vacationData, error: vacationError } = await supabase
        .from('vacation_days')
        .select('*')
        .order('date');

      if (vacationError) {
        // console.error('Error fetching vacation days:', vacationError);
        throw vacationError;
      }

      // Data fetched successfully
      console.log('Activities fetched:', activitiesData);
      console.log('Behaviors fetched:', behaviorsData);

      setChildren(childrenData || []);
      setActivities(activitiesData || []);
      
      // Map behaviors to normalize the column name
      const normalizedBehaviors = (behaviorsData || []).map(b => ({
        ...b,
        deduction: b.time_deducted || b.deduction || 0
      }));
      setBehaviors(normalizedBehaviors);
      
      setVacationDays(vacationData?.map(v => v.date) || []);
    } catch (error) {
      // console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Only fetch data when user changes and is authenticated
  useEffect(() => {
    // console.log('User state changed:', user ? 'authenticated' : 'not authenticated');
    fetchData();
  }, [user]);

  // Add activity
  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    if (!user) {
      toast.error('You must be logged in to add activities');
      return;
    }

    try {
      console.log('Adding activity:', activity);
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
        console.error('Error adding activity:', error);
        throw error;
      }

      // console.log('Activity added successfully:', data);
      setActivities(prev => [data, ...prev]);
      toast.success('Activity added successfully');
      
      // Force a re-render by updating the state
      toast.loading('Updating dashboard...');
      setTimeout(async () => {
        await fetchData();
        toast.dismiss();
        toast.success('Dashboard updated!');
      }, 100);
    } catch (error: any) {
      console.error('Error adding activity:', error);
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
      console.log('Adding behavior:', behavior);
      const { data, error } = await supabase
        .from('behaviors')
        .insert({
          child_id: behavior.child_id,
          date: behavior.date,
          type: behavior.type,
          time_deducted: behavior.deduction
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding behavior:', error);
        throw error;
      }

      console.log('Behavior added successfully:', data);
      // Normalize the behavior data
      const normalizedBehavior = {
        ...data,
        deduction: data.time_deducted || data.deduction || 5
      };
      console.log('Normalized behavior:', normalizedBehavior);
      setBehaviors(prev => [normalizedBehavior, ...prev]);
      toast.success('Behavior logged successfully');
      
      // Force a re-render by updating the state
      setTimeout(() => {
        fetchData();
      }, 100);
    } catch (error: any) {
      console.error('Error adding behavior:', error);
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

      // console.log('Toggling activity completion:', activityId, !activity.completed);
      const { error } = await supabase
        .from('activities')
        .update({ completed: !activity.completed })
        .eq('id', activityId);

      if (error) {
        // console.error('Error updating activity:', error);
        throw error;
      }

      // console.log('Activity completion toggled successfully');
      setActivities(prev => prev.map(a => 
        a.id === activityId ? { ...a, completed: !a.completed } : a
      ));
    } catch (error) {
      // console.error('Error updating activity:', error);
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
      // console.log('Toggling vacation day:', date, isVacation ? 'remove' : 'add');
      
      if (isVacation) {
        const { error } = await supabase
          .from('vacation_days')
          .delete()
          .eq('date', date);

        if (error) {
          // console.error('Error removing vacation day:', error);
          throw error;
        }

        setVacationDays(prev => prev.filter(d => d !== date));
      } else {
        const { error } = await supabase
          .from('vacation_days')
          .insert([{ date }]);

        if (error) {
          // console.error('Error adding vacation day:', error);
          throw error;
        }

        setVacationDays(prev => [...prev, date].sort());
      }

      // console.log('Vacation day toggled successfully');
    } catch (error) {
      // console.error('Error toggling vacation day:', error);
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
    refetchData: fetchData
  };
};
