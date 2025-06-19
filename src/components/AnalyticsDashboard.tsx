import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Calendar, Activity } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsDashboardProps {
  activities: any[];
  behaviors: any[];
  children: any[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  activities,
  behaviors,
  children
}) => {
  // Calculate weekly progress data
  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const weeklyData = last7Days.map(date => {
      const dayActivities = activities.filter(a => a.date === date);
      const education = dayActivities
        .filter(a => a.type === 'education')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      const skills = dayActivities
        .filter(a => a.type === 'skill')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      const chores = dayActivities
        .filter(a => a.type === 'chore').length;
      
      return { date, education, skills, chores };
    });

    return {
      labels: last7Days.map(d => format(new Date(d), 'MMM d')),
      datasets: [
        {
          label: 'Education (min)',
          data: weeklyData.map(d => d.education),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Skills (min)',
          data: weeklyData.map(d => d.skills),
          borderColor: 'rgb(251, 146, 60)',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  // Calculate activity type distribution
  const getActivityDistribution = () => {
    const typeCounts = {
      education: activities.filter(a => a.type === 'education').length,
      skill: activities.filter(a => a.type === 'skill').length,
      chore: activities.filter(a => a.type === 'chore').length,
    };

    return {
      labels: ['Education', 'Skills', 'Chores'],
      datasets: [{
        data: [typeCounts.education, typeCounts.skill, typeCounts.chore],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(251, 146, 60)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 2,
      }],
    };
  };

  // Calculate child comparison data - separated by category
  const getChildMinutesComparison = () => {
    const childData = children.map(child => {
      const childActivities = activities.filter(a => a.child_id === child.id);
      const educationMinutes = childActivities
        .filter(a => a.type === 'education')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      const skillMinutes = childActivities
        .filter(a => a.type === 'skill')
        .reduce((sum, a) => sum + (a.duration || 0), 0);
      
      return {
        name: child.name,
        educationMinutes,
        skillMinutes,
      };
    });

    return {
      labels: childData.map(d => d.name),
      datasets: [
        {
          label: 'Education Minutes',
          data: childData.map(d => d.educationMinutes),
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgb(147, 51, 234)',
          borderWidth: 2,
        },
        {
          label: 'Skill Minutes',
          data: childData.map(d => d.skillMinutes),
          backgroundColor: 'rgba(251, 146, 60, 0.8)',
          borderColor: 'rgb(251, 146, 60)',
          borderWidth: 2,
        },
      ],
    };
  };

  const getChildChoresComparison = () => {
    const childData = children.map(child => {
      const childActivities = activities.filter(a => a.child_id === child.id);
      const choreCount = childActivities.filter(a => a.type === 'chore').length;
      const completedToday = childActivities.filter(
        a => a.type === 'chore' && a.date === format(new Date(), 'yyyy-MM-dd')
      ).length;
      
      return {
        name: child.name,
        choreCount,
        completedToday,
      };
    });

    return {
      labels: childData.map(d => d.name),
      datasets: [
        {
          label: 'Total Chores',
          data: childData.map(d => d.choreCount),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
        },
        {
          label: "Today's Chores",
          data: childData.map(d => d.completedToday),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
        },
      ],
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h2 
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Analytics Dashboard
      </motion.h2>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all children
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activities.filter(a => {
                      const actDate = new Date(a.date);
                      const weekStart = startOfWeek(new Date());
                      const weekEnd = endOfWeek(new Date());
                      return actDate >= weekStart && actDate <= weekEnd;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Activities completed
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Badges earned
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 days</div>
                  <p className="text-xs text-muted-foreground">
                    Current streak
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Activity Distribution */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut 
                  data={getActivityDistribution()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Minutes Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={getChildMinutesComparison()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Chores Comparison - Separate chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Chores Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={getChildChoresComparison()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <Line
                  data={getWeeklyData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: true,
                        text: 'Minutes Spent on Activities',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Education & Skills Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={getChildMinutesComparison()}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: 'Total Minutes by Category',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Minutes',
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Chores Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <Bar
                    data={getChildChoresComparison()}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: 'Chore Completion Count',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            precision: 0,
                          },
                          title: {
                            display: true,
                            text: 'Number of Chores',
                          },
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AnalyticsDashboard;