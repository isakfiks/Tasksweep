"use client";
import React, { useState, useEffect } from "react";
import { Check, Plus, Trash2, Undo2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function App() {
  interface Task {
    id: number;
    name: string;
    createdAt: string;
    completedAt?: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [finishedTasks, setFinished] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks, finishedTasks]);

  function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedFinishedTasks = localStorage.getItem('finishedTasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedFinishedTasks) setFinished(JSON.parse(savedFinishedTasks));
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('finishedTasks', JSON.stringify(finishedTasks));
  }

  function handleNewTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newTaskName.trim() !== "") {
      if (!tasks.find(task => task.name === newTaskName)) {
        setTasks([...tasks, {
          name: newTaskName,
          createdAt: new Date().toISOString(),
          id: Date.now()
        }]);
        setNewTaskName("");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      }
    }
  }

  function finishTask(taskId: number) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setFinished([...finishedTasks, { ...task, completedAt: new Date().toISOString() }]);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  }

  function undoFinish(taskId: number) {
    const task = finishedTasks.find(t => t.id === taskId);
    if (task) {
      const { completedAt, ...taskWithoutCompletedAt } = task;
      setTasks([...tasks, taskWithoutCompletedAt]);
      setFinished(finishedTasks.filter(t => t.id !== taskId));
    }
  }

  function deleteTask(taskId: number) {
    setTasks(tasks.filter(t => t.id !== taskId));
    setFinished(finishedTasks.filter(t => t.id !== taskId));
  }

  const filteredTasks = [...tasks, ...finishedTasks]
    .filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(task => {
      if (filterStatus === "completed") return finishedTasks.some(t => t.id === task.id);
      if (filterStatus === "active") return tasks.some(t => t.id === task.id);
      return true;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Tasksweep
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAlert && (
            <Alert className="mb-4 bg-green-500/20 text-green-200 border-green-500">
              <AlertDescription>Task added successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <form onSubmit={handleNewTask} className="flex gap-2">
              <Input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add a new task..."
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex gap-2 flex-wrap">
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[200px] bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              />
              <label htmlFor="filterStatus" className="sr-only">Filter tasks</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white rounded-md p-2"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredTasks.map(task => {
                const isCompleted = finishedTasks.some(t => t.id === task.id);
                return (
                  <div key={task.id} className="flex items-center gap-2 group">
                    <div className="flex-1 bg-gray-700/30 rounded-lg p-3 flex items-center justify-between group-hover:bg-gray-700/50 transition-colors">
                      <span className={`${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                        {task.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => isCompleted ? undoFinish(task.id) : finishTask(task.id)}
                          className={`${isCompleted ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-500 hover:text-green-600'}`}
                        >
                          {isCompleted ? <Undo2 className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-sm text-gray-400 pt-4">
              {tasks.length} active tasks · {finishedTasks.length} completed
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}