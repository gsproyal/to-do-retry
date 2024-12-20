'use client';
import { useState } from 'react';

// Category icons mapping
const categoryIcons: { [key: string]: string } = {
  work: '💼',
  personal: '👤',
  shopping: '🛒',
  health: '🏥',
  education: '📚',
  all: '📋'
};

interface Task {
  id: string;
  text: string;
  dueDate: string;
  time: {
    hours: string;
    minutes: string;
    period: 'AM' | 'PM';
  };
  category: string;
  completed: boolean;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [time, setTime] = useState({
    hours: '12',
    minutes: '00',
    period: 'AM' as 'AM' | 'PM'
  });

  const categories = [
    { id: 'all', name: 'All Tasks', color: 'bg-gray-100 text-gray-800' },
    { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
    { id: 'personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
    { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
    { id: 'education', name: 'Education', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    e.target.blur();
  };

  const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.showPicker();
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        dueDate: dueDate || '',
        time: { ...time },
        category: category || '',
        completed: false
      };
      
      setTasks(prevTasks => [...prevTasks, newTaskItem]);
      
      // Clear inputs
      setNewTask('');
      setDueDate('');
      setCategory('');
      setTime({ hours: '12', minutes: '00', period: 'AM' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  };

  const toggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (time: Task['time']) => {
    return `${time.hours}:${time.minutes} ${time.period}`;
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'bg-gray-100 text-gray-800';
  };

  const getSortedTasks = () => {
    const tasksCopy = [...tasks];
    
    // First filter by category if not 'all'
    const filteredTasks = sortBy === 'all' 
      ? tasksCopy 
      : tasksCopy.filter(task => task.category === sortBy);

    // Split into completed and incomplete tasks
    const completedTasks = filteredTasks.filter(task => task.completed);
    const incompleteTasks = filteredTasks.filter(task => !task.completed);

    // Return completed tasks first, followed by incomplete tasks
    return [...completedTasks, ...incompleteTasks];
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-lg mx-auto p-4 w-full">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            ✨ To-Do List
          </h1>
          
          <div className="mb-6">
            {/* Task Input with Icon */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="✍️ Enter your task"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-400 text-gray-600 transition-all duration-200"
                onKeyPress={handleKeyPress}
              />
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-600 text-sm cursor-pointer appearance-none min-w-[110px]
                  transition-all duration-200 hover:border-gray-300"
              >
                <option value="">📑 Category</option>
                {categories.slice(1).map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {categoryIcons[cat.id]} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time Selection */}
            <div className="flex flex-wrap gap-3 mt-3">
              <input
                type="date"
                value={dueDate}
                onChange={handleDateChange}
                onClick={handleDateClick}
                className="flex-1 min-w-[160px] px-3 py-1.5 border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-600 cursor-pointer transition-all duration-200 hover:border-gray-300"
              />
              
              {/* Time Selection */}
              <div className="flex gap-2">
                <select
                  value={time.hours}
                  onChange={(e) => setTime({ ...time, hours: e.target.value })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-gray-600 cursor-pointer appearance-none min-w-[70px]
                    transition-all duration-200 hover:border-gray-300"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <select
                  value={time.minutes}
                  onChange={(e) => setTime({ ...time, minutes: e.target.value })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-gray-600 cursor-pointer appearance-none min-w-[70px]
                    transition-all duration-200 hover:border-gray-300"
                >
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <select
                  value={time.period}
                  onChange={(e) => setTime({ ...time, period: e.target.value as 'AM' | 'PM' })}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    text-gray-600 cursor-pointer appearance-none min-w-[70px]
                    transition-all duration-200 hover:border-gray-300"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Add Task Button */}
            <button 
              onClick={addTask}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg
                hover:bg-blue-600 active:bg-blue-700 transform transition-all duration-200
                hover:shadow-md active:scale-[0.98] font-medium"
            >
              ➕ Add Task
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
              📝 {getSortedTasks().length} {getSortedTasks().length === 1 ? 'task' : 'tasks'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-gray-600 text-sm cursor-pointer appearance-none min-w-[110px]
                transition-all duration-200 hover:border-gray-300"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {categoryIcons[cat.id]} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task List */}
          <ul className="mt-2 space-y-3">
            {getSortedTasks().map((task) => (
              <li key={task.id} 
                className="group flex justify-between items-center p-4 rounded-lg
                  bg-gray-50 hover:bg-gray-100 transform transition-all duration-200
                  hover:shadow-md animate-[slideIn_0.2s_ease-in-out]"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-500 
                      focus:ring-blue-500 cursor-pointer transition-colors duration-200"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium transition-all duration-200
                        ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.text}
                      </span>
                      {task.category && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium 
                          transition-all duration-200 ${getCategoryColor(task.category)}`}>
                          {categoryIcons[task.category]} {categories.find(cat => cat.id === task.category)?.name}
                        </span>
                      )}
                    </div>
                    {task.dueDate && (
                      <span className="text-sm text-gray-500 flex items-center">
                        🗓️ {formatDate(task.dueDate)} at {formatTime(task.time)}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition-all duration-200
                    px-3 py-1 rounded-md hover:bg-red-50 ml-2 opacity-0 group-hover:opacity-100"
                >
                  🗑️ Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
