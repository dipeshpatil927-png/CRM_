
import React, { useState } from 'react';
import { Icon } from './icons';
import { Task } from '../types';

interface TasksPageProps {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, addTask, toggleTask, deleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <form onSubmit={handleAddTask} className="flex items-center mb-6">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-300" disabled={!newTaskText.trim()}>
                    Add Task
                </button>
            </form>
            <ul className="space-y-3">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`ml-3 text-gray-800 dark:text-gray-200 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                {task.text}
                            </span>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                            <Icon name="Trash2" className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default TasksPage;
