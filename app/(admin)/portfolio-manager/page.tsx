"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Trash2, Plus, Pencil } from "lucide-react";

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client_name: string;
  image_url: string;
  is_published: boolean;
}

export default function PortfolioManagerPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    client_name: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(project: PortfolioProject) {
    try {
      const { error } = await supabase
        .from("portfolio_projects")
        .update({ is_published: !project.is_published })
        .eq("id", project.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_published: !p.is_published } : p
        )
      );
    } catch {
      alert("Gabim gjatë përditësimit. Provoni përnjëherë.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.client_name) {
      alert("Plotësoni të gjitha fushat e detyrueshme");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("portfolio_projects").insert([
        {
          title: formData.title,
          category: formData.category,
          client_name: formData.client_name,
          image_url: formData.image_url,
          is_published: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        title: "",
        category: "",
        client_name: "",
        image_url: "",
      });
      await fetchProjects();
    } catch {
      alert("Gabim gjatë ruajtjes. Provoni përnjëherë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProject(e: React.FormEvent) {
    e.preventDefault();

    if (!editingProject) return;

    if (!formData.title || !formData.category || !formData.client_name) {
      alert("Plotësoni të gjitha fushat e detyrueshme");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("portfolio_projects")
        .update({
          title: formData.title,
          category: formData.category,
          client_name: formData.client_name,
          image_url: formData.image_url,
        })
        .eq("id", editingProject.id);

      if (error) throw error;

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({
        title: "",
        category: "",
        client_name: "",
        image_url: "",
      });
      await fetchProjects();
    } catch {
      alert("Gabim gjatë përditësimit. Provoni përnjëherë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenEdit(project: PortfolioProject) {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      category: project.category || "",
      client_name: project.client_name || "",
      image_url: project.image_url || "",
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë projekt?")) return;

    try {
      const { error } = await supabase
        .from("portfolio_projects")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchProjects();
    } catch {
      alert("Gabim gjatë fshirjes. Provoni përnjëherë.");
    }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Portofoli CMS</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni projektet e portofolit dhe publikimin e tyre.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: "",
              category: "",
              client_name: "",
              image_url: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Shto Projekt
        </button>
      </div>

      {/* Modal - Add Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? "Përditëso Projektin" : "Shto Projekt të Ri"}
            </h2>

            <form onSubmit={editingProject ? handleUpdateProject : handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Titull *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="p.sh. Azalea Wine Cellar"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Kategoria *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="p.sh. Identitet Marke & Dizajn Etikete"
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

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  URL e Imazhit
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
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
                  {isSubmitting
                    ? "Duke ruajtur..."
                    : editingProject
                      ? "Përditëso"
                      : "Ruaj"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="mb-3 text-xs text-gray-500 md:hidden">Rrëshqit horizontalisht për të parë të gjitha kolonat.</div>
      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-5">Titull</th>
              <th className="px-6 py-5">Kategoria</th>
              <th className="px-6 py-5">Klienti</th>
              <th className="px-6 py-5">Statusi</th>
              <th className="px-6 py-5 text-right">Opsione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 animate-pulse">
                  Duke ngarkuar projektet...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                  Nuk ka projekte të regjistruara. Kliko butonin e mësipërm për të shtuar një.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{project.title}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{project.category}</td>
                  <td className="px-6 py-4 text-gray-300">{project.client_name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer inline-block ${
                        project.is_published
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                      onClick={() => handleTogglePublish(project)}
                      title="Kliko për të ndryshuar statusin"
                    >
                      {project.is_published ? "Botuar" : "Jo Botuar"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors p-2 hover:bg-sky-500/10 rounded-lg"
                      title="Edito projektin"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-[#cfa861] transition-colors p-2 hover:bg-[#cfa861]/10 rounded-lg"
                      title={project.is_published ? "Fshij publikimin" : "Publiko"}
                    >
                      {project.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      title="Fshij projektin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
