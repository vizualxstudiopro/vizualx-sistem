"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Share2, Trash2, Plus, Calendar } from "lucide-react";

interface SocialPost {
  id: string;
  client_name: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
  post_date: string;
  content: string;
  status: "draft" | "scheduled" | "published";
}

interface SocialFormData {
  client_name: string;
  platform: SocialPost['platform'];
  post_date: string;
  content: string;
  status: SocialPost['status'];
}

const platformColors = {
  instagram: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  facebook: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  twitter: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  linkedin: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  tiktok: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
} satisfies Record<SocialPost['platform'], { bg: string; text: string; border: string }>;

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SocialFormData>({
    client_name: "",
    platform: "instagram" as const,
    post_date: "",
    content: "",
    status: "draft" as const,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("social_posts")
        .select("*")
        .order("post_date", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.client_name || !formData.post_date || !formData.content) {
      alert("Plotësoni të gjitha fushat e detyrueshme");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("social_posts").insert([
        {
          client_name: formData.client_name,
          platform: formData.platform,
          post_date: formData.post_date,
          content: formData.content,
          status: formData.status,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        client_name: "",
        platform: "instagram",
        post_date: "",
        content: "",
        status: "draft",
      });
      await fetchPosts();
    } catch {
      alert("Gabim gjatë ruajtjes. Provoni përnjëherë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë postim?")) return;

    try {
      const { error } = await supabase.from("social_posts").delete().eq("id", id);
      if (error) throw error;
      await fetchPosts();
    } catch {
      alert("Gabim gjatë fshirjes. Provoni përnjëherë.");
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "scheduled":
        return "bg-[#cfa861]/20 text-[#cfa861] border-[#cfa861]/30";
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Drafti";
      case "scheduled":
        return "I Planifikuar";
      case "published":
        return "Botuar";
      default:
        return status;
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Rrjetat Sociale</h1>
          <p className="text-gray-400 text-sm mt-1">Planifikoni dhe menaxhoni postimet e mediave shoqeruese.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Planifiko Postim
        </button>
      </div>

      {/* Modal - Add Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Planifiko Postim të Ri</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Platform */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Platforma *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as SocialPost['platform'] })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23cfa861'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              {/* Post Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Data e Publikimit *
                </label>
                <input
                  type="datetime-local"
                  value={formData.post_date}
                  onChange={(e) => setFormData({ ...formData, post_date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Përmbajtja e Tekstit *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Shkruani përmbajtjen e postimit..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Statusi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as SocialPost['status'] })}
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23cfa861'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="draft">Drafti</option>
                  <option value="scheduled">I Planifikuar</option>
                  <option value="published">Botuar</option>
                </select>
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
                  {isSubmitting ? "Duke ruajtur..." : "Planifiko"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Duke ngarkuar postimet...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Nuk ka postume të regjistruara. Kliko butonin e mësipërm për të shtuar një.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => {
            const platformColor = platformColors[post.platform] || { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30" };

            return (
              <div
                key={post.id}
                className="group bg-[#1a1c23] border border-white/5 rounded-2xl p-6 hover:border-[#cfa861]/40 transition-all duration-300 hover:bg-white/[0.02]"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#cfa861] transition-colors">
                      {post.client_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Share2 className="w-4 h-4 text-gray-500" />
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${platformColor.bg} ${platformColor.text} ${platformColor.border}`}>
                        {post.platform}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                    title="Fshij postimin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4 pb-4 border-b border-white/5">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.post_date).toLocaleDateString("sq-AL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${getStatusBadge(post.status)}`}>
                    {getStatusLabel(post.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
