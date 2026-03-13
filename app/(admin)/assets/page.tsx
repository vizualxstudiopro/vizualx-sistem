"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";

type Placement = "hero" | "portfolio";
type AssetCategory = "hero" | "portfolio" | "hero_draft" | "portfolio_draft";

type Asset = {
  id: string;
  client_name: string;
  project_name: string;
  category: string;
  file_url: string | null;
  created_at: string;
};

type PendingFile = {
  key: string;
  file: File;
  previewUrl: string;
};

const remoteImageLoader = ({ src }: ImageLoaderProps) => src;

function getPlacement(category: string): Placement {
  return category.startsWith("hero") ? "hero" : "portfolio";
}

function isPublished(category: string) {
  return !category.endsWith("_draft");
}

function toCategory(placement: Placement, published: boolean): AssetCategory {
  if (placement === "hero") return published ? "hero" : "hero_draft";
  return published ? "portfolio" : "portfolio_draft";
}

function getStoragePathFromPublicUrl(url: string) {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/website-images/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Placement>("hero");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const pendingFilesRef = useRef<PendingFile[]>([]);

  const [formData, setFormData] = useState({
    client_name: "",
    project_name: "",
    placement: "hero" as Placement,
    published: true,
  });

  useEffect(() => {
    void fetchAssets();
  }, []);

  useEffect(() => {
    pendingFilesRef.current = pendingFiles;
  }, [pendingFiles]);

  useEffect(() => {
    return () => {
      pendingFilesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function appendSelectedFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));

    setPendingFiles((current) => {
      const existingKeys = new Set(current.map((item) => item.key));
      const additions: PendingFile[] = [];

      for (const file of incoming) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (existingKeys.has(key)) continue;
        additions.push({
          key,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      return [...current, ...additions];
    });
  }

  function clearPendingFiles() {
    setPendingFiles((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  }

  function removePendingFile(key: string) {
    setPendingFiles((current) => {
      const target = current.find((item) => item.key === key);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.key !== key);
    });
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files?.length) {
      appendSelectedFiles(event.dataTransfer.files);
    }
  }

  async function fetchAssets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("media_assets")
        .select("id, client_name, project_name, category, file_url, created_at")
        .in("category", ["hero", "portfolio", "hero_draft", "portfolio_draft"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssets((data as Asset[]) || []);
    } catch (error) {
      const message = (error as { message?: string })?.message || "Gabim në ngarkim.";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(selectedFile: File, placement: Placement) {
    const timestamp = Date.now();
    const safeName = selectedFile.name.replace(/\s+/g, "-").toLowerCase();
    const path = `web-media/${placement}/${timestamp}-${safeName}`;

    const { error } = await supabase.storage.from("website-images").upload(path, selectedFile, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from("website-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.client_name || !formData.project_name) {
      alert("Plotësoni emrin e klientit dhe emrin e projektit.");
      return;
    }

    if (pendingFiles.length === 0) {
      alert("Zgjidhni të paktën një imazh për upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      const category = toCategory(formData.placement, formData.published);
      const uploadResults = await Promise.all(
        pendingFiles.map((item) => uploadFile(item.file, formData.placement))
      );
      const baseTime = Date.now();

      const rows = uploadResults.map((publicUrl, index) => ({
        client_name: formData.client_name,
        project_name:
          pendingFiles.length > 1 ? `${formData.project_name} (${index + 1})` : formData.project_name,
        category,
        file_url: publicUrl,
        before_image_url: null,
        after_image_url: null,
        created_at: new Date(baseTime + index).toISOString(),
      }));

      const { error } = await supabase.from("media_assets").insert(rows);
      if (error) throw error;

      setFormData({
        client_name: "",
        project_name: "",
        placement: "hero",
        published: true,
      });
      clearPendingFiles();
      await fetchAssets();
    } catch (error) {
      const message = (error as { message?: string })?.message || "Gabim gjatë ruajtjes.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(asset: Asset) {
    if (!confirm("Jeni i sigurt që dëshironi ta fshini këtë media nga webi?")) return;

    try {
      const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
      if (error) throw error;

      if (asset.file_url) {
        const storagePath = getStoragePathFromPublicUrl(asset.file_url);
        if (storagePath) {
          await supabase.storage.from("website-images").remove([storagePath]);
        }
      }

      await fetchAssets();
    } catch (error) {
      const message = (error as { message?: string })?.message || "Gabim gjatë fshirjes.";
      alert(message);
    }
  }

  async function handleTogglePublish(asset: Asset) {
    const placement = getPlacement(asset.category);
    const nextCategory = toCategory(placement, !isPublished(asset.category));

    try {
      const { error } = await supabase
        .from("media_assets")
        .update({ category: nextCategory })
        .eq("id", asset.id);
      if (error) throw error;
      await fetchAssets();
    } catch {
      alert("Gabim gjatë përditësimit të statusit.");
    }
  }

  async function handleMove(asset: Asset, direction: "up" | "down") {
    const scoped = assets
      .filter((item) => getPlacement(item.category) === "hero")
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    const index = scoped.findIndex((item) => item.id === asset.id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scoped.length) return;

    const current = scoped[index];
    const target = scoped[targetIndex];

    try {
      const currentTime = current.created_at;
      const targetTime = target.created_at;

      const { error: e1 } = await supabase
        .from("media_assets")
        .update({ created_at: targetTime })
        .eq("id", current.id);
      if (e1) throw e1;

      const { error: e2 } = await supabase
        .from("media_assets")
        .update({ created_at: currentTime })
        .eq("id", target.id);
      if (e2) throw e2;

      await fetchAssets();
    } catch {
      alert("Gabim gjatë renditjes së Hero.");
    }
  }

  const filtered = useMemo(
    () =>
      assets
        .filter((asset) => getPlacement(asset.category) === activeTab)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [activeTab, assets]
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Media për Web</h1>
        <p className="text-gray-400 text-sm mt-1">
          Multi-upload, publikim/çpublikim dhe renditje Hero direkt nga paneli.
        </p>
      </div>

      <div className="bg-[#1a1c23] border border-white/5 rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Shto Media të Re</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Emri i Klientit *</label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, client_name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861]"
              placeholder="p.sh. Klienti X"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Emri i Projektit *</label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, project_name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861]"
              placeholder="p.sh. Fushata Pranverë"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Vendosja *</label>
            <select
              value={formData.placement}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, placement: e.target.value as Placement }))
              }
              className="w-full px-4 py-2.5 bg-[#0f1115] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#cfa861]"
            >
              <option value="hero">Hero</option>
              <option value="portfolio">Portfolio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Statusi i publikimit</label>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
              className={`w-full px-4 py-2.5 rounded-lg border font-semibold transition-colors ${
                formData.published
                  ? "bg-green-500/10 border-green-500/30 text-green-300"
                  : "bg-gray-500/10 border-gray-500/30 text-gray-300"
              }`}
            >
              {formData.published ? "Botuar" : "Jo Botuar"}
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Imazhet * (mund të zgjedhësh disa)</label>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-5 transition-colors ${
                isDragOver
                  ? "border-[#cfa861] bg-[#cfa861]/10"
                  : "border-white/20 bg-[#0f1115]"
              }`}
            >
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-300 cursor-pointer hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
                <span>
                  {pendingFiles.length > 0
                    ? `${pendingFiles.length} file të zgjedhura`
                    : "Kliko ose tërhiq imazhet këtu"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => appendSelectedFiles(e.target.files || [])}
                />
              </label>

              {pendingFiles.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Preview para upload-it</p>
                    <button
                      type="button"
                      onClick={clearPendingFiles}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Hiqi të gjitha
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pendingFiles.map((item) => (
                      <div key={item.key} className="relative rounded-lg overflow-hidden border border-white/10 bg-black/20">
                        <div className="relative aspect-square">
                          <Image
                            src={item.previewUrl}
                            alt={item.file.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingFile(item.key)}
                          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                          title="Hiq"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#cfa861] text-[#0f1115] font-bold hover:bg-[#e8c96f] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Duke ngarkuar..." : "Ngarko"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "hero"
              ? "bg-[#cfa861] text-[#0f1115]"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          Hero
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === "portfolio"
              ? "bg-[#cfa861] text-[#0f1115]"
              : "bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          Portfolio
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Duke ngarkuar...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500">Nuk ka media në këtë kategori.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asset, index) => (
            <div
              key={asset.id}
              className="bg-[#1a1c23] border border-white/5 rounded-2xl overflow-hidden hover:border-[#cfa861]/40 transition-colors"
            >
              <div className="relative h-48 bg-[#0f1115]">
                {asset.file_url ? (
                  <Image
                    loader={remoteImageLoader}
                    unoptimized
                    src={asset.file_url}
                    alt={asset.project_name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-white font-bold">{asset.project_name}</h3>
                <p className="text-sm text-gray-400 mb-3">{asset.client_name}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      isPublished(asset.category)
                        ? "bg-green-500/15 text-green-300 border border-green-500/30"
                        : "bg-gray-500/15 text-gray-300 border border-gray-500/30"
                    }`}
                  >
                    {isPublished(asset.category) ? "Botuar" : "Jo Botuar"}
                  </span>
                  {activeTab === "hero" && (
                    <span className="text-xs text-gray-500">Pozicioni: {index + 1}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => handleTogglePublish(asset)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0f1115] border border-white/10 text-gray-300 hover:border-[#cfa861]/50 hover:text-white transition-colors text-sm"
                  >
                    {isPublished(asset.category) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {isPublished(asset.category) ? "Çpubliko" : "Publiko"}
                  </button>
                  <button
                    onClick={() => handleDelete(asset)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Fshij
                  </button>
                </div>

                {activeTab === "hero" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleMove(asset, "up")}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0f1115] border border-white/10 text-gray-300 hover:border-[#cfa861]/50 hover:text-white transition-colors text-sm"
                    >
                      <ArrowUp className="w-4 h-4" />
                      Lart
                    </button>
                    <button
                      onClick={() => handleMove(asset, "down")}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0f1115] border border-white/10 text-gray-300 hover:border-[#cfa861]/50 hover:text-white transition-colors text-sm"
                    >
                      <ArrowDown className="w-4 h-4" />
                      Poshtë
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
