"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";

interface Asset {
  id: string;
  client_name: string;
  project_name: string;
  category: "branding" | "restoration";
  file_url?: string;
  before_image_url?: string;
  after_image_url?: string;
}

const remoteImageLoader = ({ src }: ImageLoaderProps) => src;

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"branding" | "restoration">("branding");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    client_name: "",
    project_name: "",
    category: "branding" as "branding" | "restoration",
    file_url: "",
    before_image_url: "",
    after_image_url: "",
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.client_name || !formData.project_name) {
      alert("Plotësoni emrin e klientit dhe emrin e projektit");
      return;
    }

    if (formData.category === "branding" && !formData.file_url) {
      alert("Plotësoni URL-in e imazhit");
      return;
    }

    if (
      formData.category === "restoration" &&
      (!formData.before_image_url || !formData.after_image_url)
    ) {
      alert("Plotësoni të dyja URL-at para dhe pas");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("media_assets").insert([
        {
          client_name: formData.client_name,
          project_name: formData.project_name,
          category: formData.category,
          file_url: formData.category === "branding" ? formData.file_url : null,
          before_image_url: formData.category === "restoration" ? formData.before_image_url : null,
          after_image_url: formData.category === "restoration" ? formData.after_image_url : null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        client_name: "",
        project_name: "",
        category: "branding",
        file_url: "",
        before_image_url: "",
        after_image_url: "",
      });
      await fetchAssets();
    } catch {
      alert("Gabim gjatë ruajtjes. Provoni përnjëherë.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Jeni i sigurt që dëshironi të fshini këtë aset?")) return;

    try {
      const { error } = await supabase.from("media_assets").delete().eq("id", id);
      if (error) throw error;
      await fetchAssets();
    } catch {
      alert("Gabim gjatë fshirjes. Provoni përnjëherë.");
    }
  }

  const filteredAssets = assets.filter((asset) => asset.category === activeTab);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Asetet Vizuale</h1>
          <p className="text-gray-400 text-sm mt-1">Menaxhoni galerin e imazheve për branding dhe restaurime.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#cfa861] hover:bg-[#e8c96f] text-[#0f1115] px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-[#cfa861]/30"
        >
          <Plus className="w-5 h-5" />
          Shto Aset
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab("branding")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "branding"
              ? "text-[#cfa861] border-b-2 border-[#cfa861]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Branding
        </button>
        <button
          onClick={() => setActiveTab("restoration")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "restoration"
              ? "text-[#cfa861] border-b-2 border-[#cfa861]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Restaurime
        </button>
      </div>

      {/* Modal - Add Asset */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1c23] border border-[#cfa861]/30 rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Shto Aset të Ri</h2>

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

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Emri i Projektit *
                </label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="p.sh. Logo Design"
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Kategoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as "branding" | "restoration",
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861] transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23cfa861'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="branding">Branding</option>
                  <option value="restoration">Restaurime</option>
                </select>
              </div>

              {/* Branding - Single Image URL */}
              {formData.category === "branding" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    URL e Imazhit *
                  </label>
                  <input
                    type="url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                  />
                </div>
              )}

              {/* Restoration - Before & After URLs */}
              {formData.category === "restoration" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      URL Përpara *
                    </label>
                    <input
                      type="url"
                      value={formData.before_image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, before_image_url: e.target.value })
                      }
                      placeholder="https://example.com/before.jpg"
                      className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      URL Pas *
                    </label>
                    <input
                      type="url"
                      value={formData.after_image_url}
                      onChange={(e) => setFormData({ ...formData, after_image_url: e.target.value })}
                      placeholder="https://example.com/after.jpg"
                      className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#cfa861] transition-colors"
                    />
                  </div>
                </>
              )}

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
                  {isSubmitting ? "Duke ruajtur..." : "Ruaj"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-500">Duke ngarkuar asetet...</div>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">
            Nuk ka asete në këtë kategori. Kliko butonin e mësipërm për të shtuar një.
          </div>
        </div>
      ) : activeTab === "branding" ? (
        // Branding Tab - Single Image Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden hover:border-[#cfa861]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#cfa861]/10"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-[#0f1115] overflow-hidden">
                {asset.file_url ? (
                  <Image
                    loader={remoteImageLoader}
                    unoptimized
                    src={asset.file_url}
                    alt={asset.project_name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-white text-lg group-hover:text-[#cfa861] transition-colors mb-1">
                  {asset.project_name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{asset.client_name}</p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all font-semibold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Fshij
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Restoration Tab - Before & After Side by Side
        <div className="grid grid-cols-1 gap-8">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden hover:border-[#cfa861]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#cfa861]/10 p-6"
            >
              {/* Title */}
              <div className="mb-6">
                <h3 className="font-bold text-white text-2xl group-hover:text-[#cfa861] transition-colors mb-1">
                  {asset.project_name}
                </h3>
                <p className="text-gray-400 text-sm">{asset.client_name}</p>
              </div>

              {/* Before & After Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Before */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                    Përpara
                  </label>
                  <div className="relative h-64 bg-[#0f1115] rounded-lg overflow-hidden">
                    {asset.before_image_url ? (
                      <Image
                        loader={remoteImageLoader}
                        unoptimized
                        src={asset.before_image_url}
                        alt="Përpara"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>

                {/* After */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[#cfa861] mb-3 uppercase tracking-wider">
                    Pas
                  </label>
                  <div className="relative h-64 bg-[#0f1115] rounded-lg overflow-hidden">
                    {asset.after_image_url ? (
                      <Image
                        loader={remoteImageLoader}
                        unoptimized
                        src={asset.after_image_url}
                        alt="Pas"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(asset.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all font-semibold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Fshij
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
