import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Circle,
  Calendar,
  Target,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { 
  TASK_TYPES, 
  TASK_STATUS, 
  PRIORITY_LEVELS,
  getTaskTypeLabel,
  getStatusLabel,
  getStatusColor,
  getPriorityColor,
  getTaskTypeIcon,
  formatDate,
  formatDateTime,
  formatTime,
  isOverdue,
  getDaysUntil,
  getRelativeDate,
  filterTasksByStatus,
  filterTasksByType,
  filterTasksByPriority,
  sortTasksByDate,
  sortTasksByPriority
} from '@/types/calendar';

export default function TaskManager({ 
  tasks = [], 
  onUpdateTask, 
  onAddTask, 
  onDeleteTask,
  onTaskClick 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    all_day: true,
    task_type: TASK_TYPES.APPLICATION_DEADLINE,
    status: TASK_STATUS.NOT_STARTED,
    priority: PRIORITY_LEVELS.MEDIUM,
    college_name: '',
    progress_percentage: 0,
    reminder_minutes: 60,
    notes: '',
    tags: []
  });

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.college_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filterTasksByStatus(filtered, filterStatus);
    }
    
    // Type filter
    if (filterType !== 'all') {
      filtered = filterTasksByType(filtered, filterType);
    }
    
    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filterTasksByPriority(filtered, filterPriority);
    }
    
    // Sort
    if (sortBy === 'date') {
      filtered = sortTasksByDate(filtered, sortOrder === 'asc');
    } else if (sortBy === 'priority') {
      filtered = sortTasksByPriority(filtered);
    }
    
    return filtered;
  };

  const getTasksByStatus = () => {
    const filtered = getFilteredTasks();
    const grouped = {
      [TASK_STATUS.NOT_STARTED]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.COMPLETED]: [],
      [TASK_STATUS.OVERDUE]: [],
      [TASK_STATUS.CANCELLED]: []
    };
    
    filtered.forEach(task => {
      if (task.status === TASK_STATUS.COMPLETED) {
        grouped[TASK_STATUS.COMPLETED].push(task);
      } else if (isOverdue(task.start_date)) {
        grouped[TASK_STATUS.OVERDUE].push(task);
      } else {
        grouped[task.status].push(task);
      }
    });
    
    return grouped;
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      ...newTask,
      id: `task-${Date.now()}`,
      student_id: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    onAddTask(task);
    setNewTask({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      all_day: true,
      task_type: TASK_TYPES.APPLICATION_DEADLINE,
      status: TASK_STATUS.NOT_STARTED,
      priority: PRIORITY_LEVELS.MEDIUM,
      college_name: '',
      progress_percentage: 0,
      reminder_minutes: 60,
      notes: '',
      tags: []
    });
    setIsAddingTask(false);
  };

  const handleUpdateTask = (task) => {
    const updatedTask = {
      ...task,
      updated_at: new Date().toISOString()
    };
    
    onUpdateTask(updatedTask);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
  };

  const handleStatusChange = (task, newStatus) => {
    const updatedTask = {
      ...task,
      status: newStatus,
      completed_at: newStatus === TASK_STATUS.COMPLETED ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    
    onUpdateTask(updatedTask);
  };

  const handleProgressChange = (task, progress) => {
    const updatedTask = {
      ...task,
      progress_percentage: progress,
      status: progress === 100 ? TASK_STATUS.COMPLETED : TASK_STATUS.IN_PROGRESS,
      completed_at: progress === 100 ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    
    onUpdateTask(updatedTask);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
    const inProgress = tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length;
    const overdue = tasks.filter(t => t.status !== TASK_STATUS.COMPLETED && isOverdue(t.start_date)).length;
    const notStarted = tasks.filter(t => t.status === TASK_STATUS.NOT_STARTED).length;
    
    return { total, completed, inProgress, overdue, notStarted };
  };

  const stats = getTaskStats();
  const tasksByStatus = getTasksByStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Task Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                onClick={() => setIsAddingTask(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700/50 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Status</SelectItem>
                      {Object.values(TASK_STATUS).map(status => (
                        <SelectItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Types</SelectItem>
                      {Object.values(TASK_TYPES).map(type => (
                        <SelectItem key={type} value={type}>
                          {getTaskTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">All Priorities</SelectItem>
                      {Object.values(PRIORITY_LEVELS).map(priority => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Sort By</Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      variant="outline"
                      size="sm"
                      className="border-gray-500 text-gray-300 hover:bg-gray-600"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <div className="text-center p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
          <Circle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-300">{stats.notStarted}</div>
          <div className="text-sm text-gray-400">Not Started</div>
        </div>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <CardTitle className="text-gray-200">Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Task Title</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
                  placeholder="Enter task title"
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Task Type</Label>
                <Select
                  value={newTask.task_type}
                  onValueChange={(value) => setNewTask(prev => ({...prev, task_type: value}))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {Object.values(TASK_TYPES).map(type => (
                      <SelectItem key={type} value={type}>
                        {getTaskTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({...prev, description: e.target.value}))}
                placeholder="Enter task description"
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={newTask.start_date}
                  onChange={(e) => setNewTask(prev => ({...prev, start_date: e.target.value}))}
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({...prev, priority: value}))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {Object.values(PRIORITY_LEVELS).map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">College (Optional)</Label>
                <Input
                  value={newTask.college_name}
                  onChange={(e) => setNewTask(prev => ({...prev, college_name: e.target.value}))}
                  placeholder="Which college?"
                  className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsAddingTask(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks by Status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
            All ({getFilteredTasks().length})
          </TabsTrigger>
          <TabsTrigger value="not_started" className="data-[state=active]:bg-blue-600">
            Not Started ({tasksByStatus[TASK_STATUS.NOT_STARTED].length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-blue-600">
            In Progress ({tasksByStatus[TASK_STATUS.IN_PROGRESS].length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600">
            Completed ({tasksByStatus[TASK_STATUS.COMPLETED].length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="data-[state=active]:bg-blue-600">
            Overdue ({tasksByStatus[TASK_STATUS.OVERDUE].length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {getFilteredTasks().map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </TabsContent>

        <TabsContent value="not_started" className="space-y-4">
          {tasksByStatus[TASK_STATUS.NOT_STARTED].map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          {tasksByStatus[TASK_STATUS.IN_PROGRESS].map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {tasksByStatus[TASK_STATUS.COMPLETED].map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {tasksByStatus[TASK_STATUS.OVERDUE].map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onProgressChange={handleProgressChange}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Task Card Component
function TaskCard({ 
  task, 
  onUpdate, 
  onDelete, 
  onStatusChange, 
  onProgressChange, 
  onClick 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task, newStatus);
  };

  const handleProgressChange = (progress) => {
    onProgressChange(task, progress);
  };

  const isOverdue = task.status !== TASK_STATUS.COMPLETED && 
    new Date(task.start_date) < new Date();

  return (
    <Card className={`border-gray-700 bg-gray-800/80 hover:bg-gray-700/80 transition-colors ${
      isOverdue ? 'border-red-500/50 bg-red-500/5' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{getTaskTypeIcon(task.task_type)}</span>
              <h4 className="text-lg font-semibold text-white">{task.title}</h4>
              <Badge className={getStatusColor(task.status)}>
                {getStatusLabel(task.status)}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-gray-300 mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateTime(task.start_date)}
              </span>
              {task.college_name && (
                <span>• {task.college_name}</span>
              )}
              {task.progress_percentage > 0 && (
                <span>• {task.progress_percentage}% complete</span>
              )}
            </div>

            {/* Progress Bar */}
            {task.progress_percentage > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress_percentage}%` }}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={task.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {Object.values(TASK_STATUS).map(status => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={() => onDelete(task.id)}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">Quick Actions:</span>
          <Button
            onClick={() => handleProgressChange(25)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            25%
          </Button>
          <Button
            onClick={() => handleProgressChange(50)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            50%
          </Button>
          <Button
            onClick={() => handleProgressChange(75)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            75%
          </Button>
          <Button
            onClick={() => handleProgressChange(100)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            100%
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
