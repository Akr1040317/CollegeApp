import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Target, 
  Bell, 
  Settings,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import Calendar from '@/components/calendar/Calendar';
import TaskManager from '@/components/calendar/TaskManager';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/api/entities";
import { 
  TASK_TYPES, 
  TASK_STATUS, 
  PRIORITY_LEVELS,
  mockTasks,
  getTaskStats,
  getUpcomingTasks,
  getOverdueTasks
} from '@/types/calendar';

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadTasks();
  }, [currentUser]);

  // In-app reminders: toast overdue and due-soon tasks once per day
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const todayKey = new Date().toISOString().slice(0, 10);
    const storageKey = `calendar-reminders-shown-${todayKey}`;
    if (localStorage.getItem(storageKey)) return;

    const now = new Date();
    const msInDay = 1000 * 60 * 60 * 24;

    const overdue = tasks.filter(t => t.status !== TASK_STATUS.COMPLETED && new Date(t.start_date) < now);
    const dueSoon = tasks.filter(t => {
      if (t.status === TASK_STATUS.COMPLETED) return false;
      const diffDays = Math.ceil((new Date(t.start_date) - now) / msInDay);
      return diffDays >= 0 && diffDays <= 2;
    });

    if (overdue.length > 0) {
      toast({
        title: `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`,
        description: overdue.slice(0, 3).map(t => `• ${t.title}`).join('\n'),
      });
    }

    if (dueSoon.length > 0) {
      toast({
        title: `${dueSoon.length} task${dueSoon.length > 1 ? 's are' : ' is'} due soon (≤ 2 days)`,
        description: dueSoon.slice(0, 3).map(t => `• ${t.title}`).join('\n'),
      });
    }

    if (overdue.length > 0 || dueSoon.length > 0) {
      localStorage.setItem(storageKey, '1');
    }
  }, [tasks, toast]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      
      if (!currentUser) {
        // Demo mode - use mock data
        setTasks(mockTasks);
        setIsLoading(false);
        return;
      }
      
      // Load from Firestore
      const firestoreTasks = await Task.filter({ student_id: currentUser.uid });
      setTasks(firestoreTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Fallback to mock data
      setTasks(mockTasks);
    }
    setIsLoading(false);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      if (currentUser) {
        // Sync with Firestore
        await Task.update(updatedTask.id, updatedTask);
      }
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      
      if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error updating task",
        description: "Failed to sync with server. Changes saved locally.",
        variant: "destructive"
      });
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      if (currentUser) {
        // Sync with Firestore
        const createdTask = await Task.create({
          ...newTask,
          student_id: currentUser.uid
        });
        setTasks(prevTasks => [...prevTasks, createdTask]);
      } else {
        // Demo mode - just add to local state
        setTasks(prevTasks => [...prevTasks, newTask]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error adding task",
        description: "Failed to sync with server. Task saved locally.",
        variant: "destructive"
      });
      // Still add to local state
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (currentUser) {
        // Sync with Firestore
        await Task.delete(taskId);
      }
      
      // Update local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error deleting task",
        description: "Failed to sync with server. Task removed locally.",
        variant: "destructive"
      });
      // Still remove from local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const getUpcomingTasks = () => {
    return tasks.filter(task => {
      const taskDate = new Date(task.start_date);
      const today = new Date();
      const daysUntil = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7 && task.status !== TASK_STATUS.COMPLETED;
    });
  };

  const getOverdueTasks = () => {
    return tasks.filter(task => 
      task.status !== TASK_STATUS.COMPLETED && 
      new Date(task.start_date) < new Date()
    );
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
    const inProgress = tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length;
    const overdue = getOverdueTasks().length;
    const notStarted = tasks.filter(t => t.status === TASK_STATUS.NOT_STARTED).length;
    
    return { total, completed, inProgress, overdue, notStarted };
  };

  const stats = getTaskStats();
  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-200 mb-2">Calendar & Tasks</h1>
          <p className="text-gray-400 text-lg">Manage your college application deadlines and tasks</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-300">{stats.total}</div>
            <div className="text-sm text-blue-400">Total Tasks</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
            <div className="text-sm text-green-400">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-300">{stats.inProgress}</div>
            <div className="text-sm text-yellow-400">In Progress</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-300">{stats.overdue}</div>
            <div className="text-sm text-red-400">Overdue</div>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-300">{upcomingTasks.length}</div>
            <div className="text-sm text-purple-400">This Week</div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 mb-6">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-600">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
              <Target className="w-4 h-4 mr-2" />
              Task Manager
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <Calendar
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onAddTask={handleAddTaskClick}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>

          {/* Task Manager */}
          <TabsContent value="tasks" className="space-y-6">
            <TaskManager
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onTaskClick={handleTaskClick}
            />
          </TabsContent>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Tasks */}
              <Card className="border-gray-700 bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="text-gray-200 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Upcoming Tasks (Next 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No upcoming tasks</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingTasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{task.title}</h4>
                              <p className="text-sm text-gray-400">
                                {new Date(task.start_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{task.task_type?.replace('_', ' ').toUpperCase()}</span>
                              <Badge className={task.priority === PRIORITY_LEVELS.HIGH ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-300'}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overdue Tasks */}
              <Card className="border-gray-700 bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="text-gray-200 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Overdue Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {overdueTasks.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No overdue tasks</p>
                  ) : (
                    <div className="space-y-3">
                      {overdueTasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-300">{task.title}</h4>
                              <p className="text-sm text-red-400">
                                Overdue by {Math.abs(Math.ceil((new Date(task.start_date) - new Date()) / (1000 * 60 * 60 * 24)))} days
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{task.task_type?.replace('_', ' ').toUpperCase()}</span>
                              <Badge className="bg-red-500/20 text-red-300">
                                Overdue
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Task Distribution */}
            <Card className="border-gray-700 bg-gray-800/80">
              <CardHeader>
                <CardTitle className="text-gray-200">Task Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {Math.round((stats.completed / stats.total) * 100) || 0}%
                    </div>
                    <p className="text-sm text-gray-400">Completion Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {Math.round((stats.inProgress / stats.total) * 100) || 0}%
                    </div>
                    <p className="text-sm text-gray-400">In Progress</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {Math.round((stats.notStarted / stats.total) * 100) || 0}%
                    </div>
                    <p className="text-sm text-gray-400">Not Started</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {Math.round((stats.overdue / stats.total) * 100) || 0}%
                    </div>
                    <p className="text-sm text-gray-400">Overdue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
