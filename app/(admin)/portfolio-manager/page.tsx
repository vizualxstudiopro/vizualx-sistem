"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      filterCategory === "all"
        ? projects
        : projects.filter((p) => p.category === filterCategory),
    [projects, filterCategory]
  );

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

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filterCategory === "all"
                ? "bg-[#cfa861] text-[#0f1115]"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Të Gjitha ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filterCategory === cat
                  ? "bg-[#cfa861] text-[#0f1115]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1a1c23] rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl mb-4">🗂️</p>
          <p className="text-gray-500">{projects.length === 0 ? "Nuk ka projekte. Shto projektin e parë!" : "Nuk ka projekte për këtë kategori."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden hover:border-[#cfa861]/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gradient-to-br from-[#1a1c23] to-[#0f1115] overflow-hidden">
                {project.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Pa imazh</span>
                  </div>
                )}
                {/* Desktop Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-end p-3 gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(project)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-[#cfa861]/30 hover:border-[#cfa861]/50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edito
                    </button>
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                    >
                      {project.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {project.is_published ? "Çpubliko" : "Publiko"}
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex items-center justify-center p-2 rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Status pill */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border ${
                    project.is_published
                      ? "bg-green-500/80 text-white border-green-400/40"
                      : "bg-black/60 text-gray-300 border-white/10"
                  }`}>
                    {project.is_published ? "● LIVE" : "● DRAFT"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-bold text-white leading-snug line-clamp-1 mb-0.5">{project.title}</h3>
                <p className="text-xs font-semibold text-[#cfa861] truncate mb-1">{project.category}</p>
                <p className="text-sm text-gray-500 truncate">{project.client_name}</p>

                {/* Mobile Actions */}
                <div className="flex gap-2 mt-3 md:hidden">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edito
                  </button>
                  <button
                    onClick={() => handleTogglePublish(project)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs transition-colors"
                  >
                    {project.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {project.is_published ? "Çpubliko" : "Publiko"}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
