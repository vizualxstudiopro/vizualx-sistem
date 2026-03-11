"use client";

import { useMemo, useState } from "react";

type InventoryItem = {
  label: string;
  value: string;
  copyValue?: string;
  status?: "ok" | "warning" | "error" | "info";
};

type InventoryGroup = {
  title: string;
  description: string;
  items: InventoryItem[];
};

type StatusItem = {
  label: string;
  status: "ok" | "warning" | "error" | "info";
  detail: string;
};

type StatusGroup = {
  title: string;
  description: string;
  items: StatusItem[];
};

type Props = {
  groups: InventoryGroup[];
  statusGroups: StatusGroup[];
  technologies: string[];
  architecture: string[];
  projectTree: string;
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-[#cfa861]/40 hover:text-white"
    >
      {copied ? "U kopjua" : "Kopjo"}
    </button>
  );
}

function DownloadButton({
  filename,
  content,
  mimeType,
  label,
}: {
  filename: string;
  content: string;
  mimeType: string;
  label: string;
}) {
  function handleDownload() {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-[#cfa861]/40 hover:text-white"
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: "ok" | "warning" | "error" | "info" }) {
  const classes = {
    ok: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const labels = {
    ok: "OK",
    warning: "Kujdes",
    error: "Gabim",
    info: "Info",
  };

  return <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${classes[status]}`}>{labels[status]}</span>;
}

export default function DataInventoryClient({
  groups,
  statusGroups,
  technologies,
  architecture,
  projectTree,
}: Props) {
  const exportText = useMemo(() => {
    const groupText = groups
      .map((group) => {
        const items = group.items.map((item) => `- ${item.label}: ${item.copyValue || item.value}`).join("\n");
        return `${group.title}\n${items}`;
      })
      .join("\n\n");

    const statusText = statusGroups
      .map((group) => {
        const items = group.items.map((item) => `- ${item.label}: ${item.status.toUpperCase()} - ${item.detail}`).join("\n");
        return `${group.title}\n${items}`;
      })
      .join("\n\n");

    return [
      "Te Dhenat e Projektit - VizualX",
      "",
      statusText,
      "",
      groupText,
      "",
      "Teknologjite",
      ...technologies.map((item) => `- ${item}`),
      "",
      "Arkitektura",
      ...architecture.map((item) => `- ${item}`),
      "",
      "Struktura e Projektit",
      projectTree,
    ].join("\n");
  }, [architecture, groups, projectTree, statusGroups, technologies]);

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          statusGroups,
          groups,
          technologies,
          architecture,
          projectTree,
        },
        null,
        2
      ),
    [architecture, groups, projectTree, statusGroups, technologies]
  );

  return (
    <div className="min-h-screen bg-[#0f1115] p-4 md:p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Të Dhënat</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-400">
              Inventar i kopjueshëm i konfigurimeve, teknologjive dhe strukturës së projektit. Çelësat sekretë
              shfaqen të maskuar për siguri.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={exportText} />
            <DownloadButton filename="vizualx-te-dhenat.txt" content={exportText} mimeType="text/plain;charset=utf-8" label="TXT" />
            <DownloadButton filename="vizualx-te-dhenat.json" content={exportJson} mimeType="application/json;charset=utf-8" label="JSON" />
          </div>
        </div>

        <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Status Teknik</h2>
            <p className="mt-1 text-sm text-gray-400">Gjendja aktuale e integrimeve, databazës dhe endpoint-eve kryesore.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {statusGroups.map((group) => (
              <section key={group.title} className="rounded-xl border border-white/5 bg-[#111318] p-4">
                <h3 className="text-base font-bold text-white">{group.title}</h3>
                <p className="mt-1 text-xs text-gray-400">{group.description}</p>

                <div className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-[#0d0f14] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-[#cfa861]">{item.label}</p>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-gray-300">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title} className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6 shadow-xl">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-white">{group.title}</h2>
                <p className="mt-1 text-sm text-gray-400">{group.description}</p>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#111318] p-4 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#cfa861]">{item.label}</p>
                        {item.status ? <StatusBadge status={item.status} /> : null}
                      </div>
                      <p className="mt-1 break-all text-sm text-gray-300">{item.value}</p>
                    </div>
                    <CopyButton value={item.copyValue || item.value} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr,1.2fr]">
          <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Teknologjia e Përdorur</h2>
            <p className="mt-1 text-sm text-gray-400">Stack-u aktual me të cilin është ndërtuar paneli dhe website.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#cfa861]/20 bg-[#cfa861]/10 px-3 py-1 text-xs font-semibold text-[#e8c96f]"
                >
                  {item}
                </span>
              ))}
            </div>

            <h3 className="mt-8 text-lg font-bold text-white">Arkitektura</h3>
            <div className="mt-4 space-y-2">
              {architecture.map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-[#111318] px-4 py-3 text-sm text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#1a1c23] p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Struktura e Projektit</h2>
                <p className="mt-1 text-sm text-gray-400">Pamje e kopjueshme e strukturës aktive të workspace-it.</p>
              </div>
              <CopyButton value={projectTree} />
            </div>

            <pre className="max-h-[680px] overflow-auto rounded-xl border border-white/5 bg-[#111318] p-4 text-xs leading-6 text-gray-300">
              {projectTree}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}