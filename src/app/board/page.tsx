"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Task = {
  id: string;
  title: string;
  client_name: string;
  status: "todo" | "in_progress" | "done";
};

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", client_name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  }

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert("Plotësoni titullin e detyrës");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert([
        {
          title: newTask.title,
          client_name: newTask.client_name,
          status: "todo",
        },
      ]);

      if (error) throw error;

      setNewTask({ title: "", client_name: "" });
      setShowModal(false);
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Gabim gjatë shtimit të detyrës");
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: "todo" | "in_progress" | "done") => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask && currentTask.status !== newStatus) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) {
        console.error("Error updating task:", error);
        await fetchTasks();
      }
    }
  };

  const getTasksByStatus = (status: "todo" | "in_progress" | "done") => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    { id: "todo" as const, title: "Në Pritje", icon: "FileText", color: "border-gray-500" },
    { id: "in_progress" as const, title: "Në Punim", icon: "Cog", color: "border-blue-500" },
    { id: "done" as const, title: "Përfunduar", icon: "CheckCircle2", color: "border-green-500" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Tabela Kanban</h1>
          <p className="text-gray-400">Menaxhoni dhe gjurmoni detyrat e projektit</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#cfa861] hover:bg-[#b8963d] text-[#0f1115] px-6 py-2 rounded-lg font-semibold transition-all"
        >
          + Shto Detyrë
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400">Duke ngarkuar detyrat...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`bg-[#1a1c23] border-t-4 ${column.color} rounded-2xl p-6 min-h-[600px] shadow-xl`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h2 className="text-lg font-bold text-white mb-4">
                {column.title} ({getTasksByStatus(column.id).length})
              </h2>

              <div className="space-y-4">
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="bg-[#0f1115] p-4 rounded-xl border border-white/10 cursor-grab active:cursor-grabbing hover:border-[#cfa861]/50 transition-all shadow-md"
                  >
                    <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                    {task.client_name && (
                      <p className="text-gray-400 text-sm">{task.client_name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-white/5 rounded-2xl p-8 max-w-md w-full space-y-6">
            <h3 className="text-xl font-bold text-white">Shto Detyrë të Re</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Titull</label>
                <input
                  type="text"
                  placeholder="Titullin e detyrës"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 outline-none focus:border-[#cfa861] transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Emri i Klientit</label>
                <input
                  type="text"
                  placeholder="Emri i klientit"
                  value={newTask.client_name}
                  onChange={(e) => setNewTask({ ...newTask, client_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 outline-none focus:border-[#cfa861] transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTask({ title: "", client_name: "" });
                }}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Anulo
              </button>
              <button
                onClick={addTask}
                className="flex-1 bg-[#cfa861] hover:bg-[#b8963d] text-[#0f1115] px-4 py-2 rounded-lg font-medium transition-all"
              >
                Shto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
