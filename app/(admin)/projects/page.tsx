'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  client_name: string;
  status: 'todo' | 'in_progress' | 'done';
}

const COLUMN_CONFIG = {
  todo: { title: 'Në Pritje', color: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: '📋' },
  in_progress: { title: 'Në Punim', color: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', icon: 'Cog' },
  done: { title: 'Përfunduar', color: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: '✓' },
};

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.client_name) {
      alert('Plotësoni titullin dhe emrin e klientit');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('tasks').insert([
        {
          title: formData.title,
          client_name: formData.client_name,
          status: 'todo',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ title: '', client_name: '' });
      await fetchTasks();
    } catch {
      alert('Gabim gjatë ruajtjes. Provoni përnjëherë.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Jeni i sigurt që dëshironi të fshini këtë detyrë?')) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      await fetchTasks();
    } catch {
      alert('Gabim gjatë fshirjes. Provoni përnjëherë.');
    }
  }

  async function handleDragStart(task: Task) {
    setDraggedTask(task);
  }

  async function handleDrop(newStatus: 'todo' | 'in_progress' | 'done') {
    if (!draggedTask) return;

    // Update state lokalisht menjëherë
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      )
    );

    // Update në Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', draggedTask.id);

      if (error) throw error;
    } catch {
      alert('Gabim gjatë përditësimit. Provoni përnjëherë.');
      // Rikthe në statusin e vjetër nëse update dështoi
      await fetchTasks();
    }

    setDraggedTask(null);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-[#cfa861]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-[#cfa861]');
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Kanban Bord i Projekteve</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni detyrat dhe përparimin e projekteve.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Shto Detyrë
        </button>
      </div>

      {/* Modal - Add Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Shto Detyrë të Re</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Titull i Detyrës *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="p.sh. Dizajn UI për faqen e pritjes"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emri i Klientit *
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="p.sh. ABC Kompania"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border-2 border-white/10 text-white font-semibold hover:border-white/20 transition-colors"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#cfa861] text-[#0f1115] font-bold hover:bg-[#e8c96f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Duke ruajtur...' : 'Shto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Duke ngarkuar detyrat...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columns */}
          {(['todo', 'in_progress', 'done'] as const).map((status) => {
            const columnTasks = getTasksByStatus(status);
            const config = COLUMN_CONFIG[status];

            return (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div className={`mb-4 pb-3 border-b-2 border-white/10`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{config.icon}</span>
                    <h2 className="text-lg font-bold text-white">{config.title}</h2>
                    <span className="ml-auto px-2 py-1 bg-white/5 text-gray-400 text-xs font-semibold rounded">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('ring-2', 'ring-[#cfa861]');
                    handleDrop(status);
                  }}
                  className="flex-1 min-h-[500px] bg-[#0f1115]/40 rounded-xl p-4 space-y-3 transition-all duration-200"
                >
                  {columnTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                      Nuk ka detyra
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-[#1a1c23] border border-white/5 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-[#cfa861]/40 transition-all duration-200 hover:shadow-lg hover:shadow-[#cfa861]/10 group"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-2">
                          <GripVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1 hover:bg-red-500/10 rounded"
                            title="Fshij detyrën"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Task Title */}
                        <h3 className="font-bold text-white text-sm mb-3 line-clamp-2">
                          {task.title}
                        </h3>

                        {/* Client Name Badge */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-[#cfa861]/10 text-[#cfa861] text-xs font-semibold border border-[#cfa861]/30">
                            {task.client_name}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

