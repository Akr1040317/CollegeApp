import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus,
  Filter,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle
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
  getCalendarView,
  getTasksForDate,
  filterTasksByStatus,
  filterTasksByType,
  filterTasksByPriority,
  sortTasksByDate,
  sortTasksByPriority
} from '@/types/calendar';

export default function Calendar({ 
  tasks = [], 
  onTaskClick, 
  onAddTask, 
  onUpdateTask,
  onDeleteTask 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const calendarWeeks = getCalendarView(currentDate, viewType);
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (filterStatus !== 'all') {
      filtered = filterTasksByStatus(filtered, filterStatus);
    }
    
    if (filterType !== 'all') {
      filtered = filterTasksByType(filtered, filterType);
    }
    
    if (filterPriority !== 'all') {
      filtered = filterTasksByPriority(filtered, filterPriority);
    }
    
    return sortTasksByPriority(sortTasksByDate(filtered));
  };

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    return getTasksForDate(getFilteredTasks(), selectedDate);
  };

  const getUpcomingTasks = () => {
    const upcoming = getFilteredTasks().filter(task => {
      const taskDate = new Date(task.start_date);
      const daysUntil = getDaysUntil(task.start_date);
      return daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
    });
    
    return sortTasksByDate(upcoming).slice(0, 5);
  };

  const getOverdueTasks = () => {
    return getFilteredTasks().filter(task => 
      task.status !== TASK_STATUS.COMPLETED && isOverdue(task.start_date)
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth;
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getTasksForDay = (date) => {
    return getTasksForDate(getFilteredTasks(), date);
  };

  const getTaskCountForDay = (date) => {
    return getTasksForDay(date).length;
  };

  const hasOverdueTasks = (date) => {
    return getTasksForDay(date).some(task => 
      task.status !== TASK_STATUS.COMPLETED && isOverdue(task.start_date)
    );
  };

  const upcomingTasks = getUpcomingTasks();
  const overdueTasks = getOverdueTasks();
  const selectedDateTasks = getTasksForSelectedDate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-gray-700 bg-gray-800/80">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Application Calendar
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
                onClick={() => onAddTask()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-700/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Status</label>
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
                <label className="text-sm font-medium text-gray-300">Type</label>
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
                <label className="text-sm font-medium text-gray-300">Priority</label>
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
              
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterType('all');
                    setFilterPriority('all');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <Button
                onClick={goToToday}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigateMonth(-1)}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigateMonth(1)}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
            
            {calendarWeeks.map((week, weekIndex) =>
              week.map((date, dayIndex) => {
                const taskCount = getTaskCountForDay(date);
                const hasOverdue = hasOverdueTasks(date);
                const isTodayDate = isToday(date);
                const isCurrentMonthDate = isCurrentMonth(date);
                const isSelectedDate = isSelected(date);
                
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 min-h-20 border border-gray-600 cursor-pointer transition-colors
                      ${isCurrentMonthDate ? 'bg-gray-700/50' : 'bg-gray-800/30'}
                      ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                      ${isSelectedDate ? 'bg-blue-600/20' : ''}
                      hover:bg-gray-600/50
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`
                        text-sm font-medium
                        ${isCurrentMonthDate ? 'text-white' : 'text-gray-500'}
                        ${isTodayDate ? 'text-blue-400' : ''}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasOverdue && (
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                    
                    {taskCount > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">
                          {taskCount} task{taskCount !== 1 ? 's' : ''}
                        </div>
                        {taskCount > 3 && (
                          <div className="text-xs text-blue-400">
                            +{taskCount - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks */}
      {selectedDate && (
        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <CardTitle className="text-gray-200">
              Tasks for {formatDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No tasks scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getTaskTypeIcon(task.task_type)}</span>
                          <h4 className="font-semibold text-white">{task.title}</h4>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusLabel(task.status)}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.all_day ? 'All day' : formatTime(task.start_date)}
                          </span>
                          {task.college_name && (
                            <span>• {task.college_name}</span>
                          )}
                          {task.progress_percentage > 0 && (
                            <span>• {task.progress_percentage}% complete</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {task.status === TASK_STATUS.COMPLETED ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No upcoming tasks</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-400">
                          {getRelativeDate(task.start_date)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-700 bg-gray-800/80">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No overdue tasks</p>
            ) : (
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-red-300 text-sm">{task.title}</h4>
                        <p className="text-xs text-red-400">
                          {getRelativeDate(task.start_date)}
                        </p>
                      </div>
                      <Badge className="text-red-600 bg-red-50 border-red-200">
                        Overdue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
