"use client";
import React, { useState, useEffect } from "react";
import { CgAddR } from "react-icons/cg"; // icon for the add new button
import { AiOutlineDelete } from "react-icons/ai"; // icon for the delete button

export default function App() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [finishedTasks, setFinished] = useState<string[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

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

  function handleNewTask() {
    setIsAddingTask(true);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTaskName(event.target.value);
  }

  function handleInputBlur() {
    if (newTaskName.trim() !== "") {
      if (!tasks.find(task => task === newTaskName)) {
        setTasks([...tasks, newTaskName]);
      }
    }
    setNewTaskName("");
    setIsAddingTask(false);
  }

  function handleInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleInputBlur();
    }
  }

  function finishTasks(taskName: string) {
    setFinished([...finishedTasks, taskName]); // add task to finishedTasks
    setTasks(tasks.filter(task => task !== taskName)); // remove task from tasks
  }

  function undoFinish(taskName: string) {
    setTasks([...tasks, taskName]); // add task back to tasks
    setFinished(finishedTasks.filter(task => task !== taskName)); // remove task from finishedTasks
  }

  function deleteTask(taskName: string) {
    setTasks(tasks.filter(task => task !== taskName)); // remove task from tasks
    setFinished(finishedTasks.filter(task => task !== taskName)); // remove task from finishedTasks
  }

  return (
    <div className="bg-gradient-to-r from-zinc-800 to-slate-900 items-center justify-items-center min-h-screen gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold pb-4 pt-12">Tasksweep🧹</h1>

      {!isAddingTask ? (
        <button onClick={handleNewTask} id="n-task" className="text-white bg-black border-2 rounded-md h-12 w-32 hover:bg-white hover:text-black flex items-center justify-center gap-2">
          <CgAddR size={20} />
          New Task
        </button>
      ) : (
        <input
          type="text"
          value={newTaskName}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleInputKeyPress}
          autoFocus
          className={`text-black border-2 rounded-md h-12 transition-all duration-300 ease-in-out ${isAddingTask ? "w-200" : "w-32"}`}
          placeholder="Enter new task"
        />
      )}

      <div className="flex flex-col items-center justify-center gap-4 pt-8" id="task-list">
        {finishedTasks.map(task => (
          <div key={task} className="flex items-center w-64">
            <button onClick={() => undoFinish(task)} className="line-through border-0 hover:bg-emerald-800 bg-emerald-500 text-black rounded text-center w-full h-auto min-h-12 p-2 overflow-hidden text-ellipsis flex items-center justify-center">
              <span className="overflow-hidden text-ellipsis">{task}</span>
            </button>
            <button title="Delete Task" onClick={() => deleteTask(task)} className="ml-2 text-red-500 hover:text-red-700">
              <AiOutlineDelete size={20} />
            </button>
          </div>
        ))}
        {tasks.map(task => (
          <div key={task} className="flex items-center w-64">
            <button onClick={() => finishTasks(task)} className="hover:line-through hover:bg-slate-600 hover:border-0 hover:text-white bg-white text-black rounded text-center w-full h-auto min-h-12 p-2 overflow-hidden text-ellipsis flex items-center justify-center">
              <span className="overflow-hidden text-ellipsis">{task}</span>
            </button>
            <button title="Delete Task" onClick={() => deleteTask(task)} className="ml-2 text-red-500 hover:text-red-700">
              <AiOutlineDelete size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}