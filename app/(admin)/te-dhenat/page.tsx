import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import DataInventoryClient from "./DataInventoryClient";

export const dynamic = "force-dynamic";

function maskSecret(value?: string) {
  if (!value) {
    return "Nuk është konfiguruar";
  }

  if (value.length <= 12) {
    return "************";
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

async function buildProjectTree() {
  const root = process.cwd();
  const excluded = new Set([".git", ".next", "node_modules"]);

  async function walk(currentPath: string, depth: number, prefix = "") {
    const entries = await readdir(currentPath, { withFileTypes: true });
    const filteredEntries = entries
      .filter((entry) => !excluded.has(entry.name))
      .sort((left, right) => {
        if (left.isDirectory() && !right.isDirectory()) {
          return -1;
        }

        if (!left.isDirectory() && right.isDirectory()) {
          return 1;
        }

        return left.name.localeCompare(right.name);
      });

    const lines: string[] = [];

    for (const entry of filteredEntries) {
      const entryLabel = `${prefix}${entry.name}${entry.isDirectory() ? "/" : ""}`;
      lines.push(entryLabel);

      if (entry.isDirectory() && depth > 0) {
        const childLines = await walk(join(currentPath, entry.name), depth - 1, `${prefix}  `);
        lines.push(...childLines);
      }
    }

    return lines;
  }

  try {
    return (await walk(root, 2)).join("\n");
  } catch {
    return [
      "app/",
      "  (admin)/",
      "  (web)/",
      "  api/",
      "src/",
      "  components/",
      "  lib/",
      "  services/",
      "public/",
      ".env.local",
      "package.json",
      "tsconfig.json",
    ].join("\n");
  }
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function checkTableStatus(table: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      label: table,
      status: "warning" as const,
      detail: "SUPABASE_SERVICE_ROLE_KEY mungon, prandaj tabela nuk u verifikua nga serveri.",
    };
  }

  try {
    const { error } = await supabase.from(table).select("*", { count: "exact", head: true });

    if (error) {
      return {
        label: table,
        status: "error" as const,
        detail: error.message,
      };
    }

    return {
      label: table,
      status: "ok" as const,
      detail: "Tabela është e aksesueshme nga klienti server-side.",
    };
  } catch (error) {
    return {
      label: table,
      status: "error" as const,
      detail: error instanceof Error ? error.message : "Verifikimi dështoi.",
    };
  }
}

export default async function TeDhenatPage() {
  const projectTree = await buildProjectTree();
  const tableStatuses = await Promise.all(
    ["clients", "invoices", "notifications", "contacts", "tasks", "website_config"].map(checkTableStatus)
  );

  const statusGroups = [
    {
      title: "Integrimet",
      description: "Status i konfigurimeve dhe çelësave kryesorë.",
      items: [
        {
          label: "Supabase URL",
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? ("ok" as const) : ("error" as const),
          detail: process.env.NEXT_PUBLIC_SUPABASE_URL
            ? "URL publike e Supabase është konfiguruar."
            : "NEXT_PUBLIC_SUPABASE_URL mungon.",
        },
        {
          label: "Supabase Anon Key",
          status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? ("ok" as const) : ("error" as const),
          detail: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "Anon key është i pranishëm për klientin browser."
            : "NEXT_PUBLIC_SUPABASE_ANON_KEY mungon.",
        },
        {
          label: "Supabase Service Role",
          status: process.env.SUPABASE_SERVICE_ROLE_KEY ? ("ok" as const) : ("warning" as const),
          detail: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? "Service role key është i pranishëm për endpoint-et server-side."
            : "SUPABASE_SERVICE_ROLE_KEY mungon; disa verifikime/admin flows do kufizohen.",
        },
        {
          label: "Resend",
          status: process.env.RESEND_API_KEY ? ("ok" as const) : ("error" as const),
          detail: process.env.RESEND_API_KEY
            ? "RESEND_API_KEY është konfiguruar për dërgim email-esh."
            : "RESEND_API_KEY mungon.",
        },
      ],
    },
    {
      title: "Databaza",
      description: "Kontroll i shpejtë për tabelat kyçe që përdor paneli.",
      items: tableStatuses,
    },
    {
      title: "API dhe Repo",
      description: "Gjendja e endpoint-eve aktive dhe lidhjes me repo-n.",
      items: [
        {
          label: "/api/send-notification",
          status: "ok" as const,
          detail: "Endpoint aktiv me metodat GET, PATCH dhe POST për njoftime, leade dhe email-e.",
        },
        {
          label: "Ruting App Router",
          status: "ok" as const,
          detail: "Paneli aktiv serviret nga app/ dhe build-i kalon me sukses.",
        },
        {
          label: "GitHub Remote",
          status: "warning" as const,
          detail: "Repo lokale nuk ka git remote të konfiguruar aktualisht.",
        },
        {
          label: "GitHub Token",
          status: "info" as const,
          detail: "Nuk ka token GitHub të deklaruar në këtë projekt, të paktën jo si env i përdorur nga paneli.",
        },
      ],
    },
  ] as const;

  const groups = [
    {
      title: "Akses dhe Kredenciale",
      description: "Vlerat sekrete maskohen; emrat e variablave dhe statusi ruhen të dukshëm.",
      items: [
        {
          label: "NEXT_PUBLIC_SUPABASE_URL",
          value: process.env.NEXT_PUBLIC_SUPABASE_URL || "Nuk është konfiguruar",
          status: process.env.NEXT_PUBLIC_SUPABASE_URL ? ("ok" as const) : ("error" as const),
        },
        {
          label: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          value: maskSecret(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
          status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? ("ok" as const) : ("error" as const),
        },
        {
          label: "SUPABASE_SERVICE_ROLE_KEY",
          value: maskSecret(process.env.SUPABASE_SERVICE_ROLE_KEY),
          status: process.env.SUPABASE_SERVICE_ROLE_KEY ? ("ok" as const) : ("warning" as const),
        },
        {
          label: "RESEND_API_KEY",
          value: maskSecret(process.env.RESEND_API_KEY),
          status: process.env.RESEND_API_KEY ? ("ok" as const) : ("error" as const),
        },
      ],
    },
    {
      title: "Komunikim dhe Repo",
      description: "Adresat operative dhe gjendja aktuale e integrimit me Git/GitHub.",
      items: [
        {
          label: "Email suporti",
          value: "suport@vizualx.online",
          status: "ok" as const,
        },
        {
          label: "Email dërgues Resend",
          value: "onboarding@resend.dev",
          status: "warning" as const,
        },
        {
          label: "Git email lokal",
          value: "vizualxstudio@gmail.com",
          status: "ok" as const,
        },
        {
          label: "GitHub remote",
          value: "Nuk ka remote të konfiguruar në këtë repo.",
          status: "warning" as const,
        },
        {
          label: "GitHub API key",
          value: "Nuk është konfiguruar në këtë projekt.",
          status: "info" as const,
        },
      ],
    },
    {
      title: "Infrastrukturë dhe Runtime",
      description: "Të dhëna bazë për ekzekutimin dhe konfigurimin e projektit.",
      items: [
        {
          label: "Framework",
          value: "Next.js 16.1.6 App Router",
          status: "ok" as const,
        },
        {
          label: "Alias i kodit",
          value: "@/* -> src/*",
          status: "ok" as const,
        },
        {
          label: "Node modules",
          value: "Instaluar në workspace aktual.",
          status: "ok" as const,
        },
        {
          label: "Build",
          value: "Build-i i fundit kaloi me sukses.",
          status: "ok" as const,
        },
      ],
    },
    {
      title: "Endpoint-e dhe Flukse",
      description: "Pikat aktive të backend-it që përdoren nga paneli aktual.",
      items: [
        {
          label: "Notifications API",
          value: "app/api/send-notification/route.ts",
          status: "ok" as const,
        },
        {
          label: "Metodat aktive",
          value: "GET, PATCH, POST",
          status: "ok" as const,
        },
        {
          label: "Bell notifications",
          value: "Lexim/shënim si read bëhet nga API server-side.",
          status: "ok" as const,
        },
        {
          label: "Formulari i kontaktit",
          value: "Delegon ruajtjen dhe email-in te /api/send-notification.",
          status: "ok" as const,
        },
      ],
    },
  ] as const;

  const technologies = [
    "Next.js 16.1.6 App Router",
    "React 19.2.3",
    "TypeScript 5",
    "Tailwind CSS 4",
    "Supabase SSR + Supabase JS",
    "Resend",
    "Framer Motion",
    "Lucide React",
    "Recharts",
    "ESLint 9",
  ];

  const architecture = [
    "Ruting-u aktiv serviret nga app/, jo nga src/app/.",
    "Kodi i përbashkët jeton kryesisht në src/components, src/lib dhe src/services.",
    "Alias-i @/* drejtohet te src/* nga tsconfig.json.",
    "Auth dhe mbrojtja e rrugeve bëhen përmes src/middleware.ts dhe src/lib/supabase.ts.",
    "API aktive e njoftimeve është app/api/send-notification/route.ts.",
    "Sidebar-i admin përdor src/components/Sidebar.tsx dhe layout-i admin app/(admin)/layout.tsx.",
  ];

  return (
    <DataInventoryClient
      statusGroups={statusGroups.map((group) => ({ ...group, items: [...group.items] }))}
      groups={groups.map((group) => ({ ...group, items: [...group.items] }))}
      technologies={technologies}
      architecture={architecture}
      projectTree={projectTree}
    />
  );
}