import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

type NotificationPayload = {
  name: string;
  email: string;
  message: string;
  type: string;
  recipientEmail?: string;
  metadata?: Record<string, unknown>;
};

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase nuk është konfiguruar plotësisht për leximin e njoftimeve." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, type, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    return NextResponse.json({ notifications: (data || []) as NotificationRecord[] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Leximi i njoftimeve dështoi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase nuk është konfiguruar plotësisht për përditësimin e njoftimeve." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as { ids?: string[] };
    const ids = body.ids || [];

    if (ids.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase.from("notifications").update({ is_read: true }).in("id", ids);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Përditësimi i njoftimeve dështoi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function persistLead(payload: NotificationPayload) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return "Supabase nuk është konfiguruar plotësisht për ruajtjen e kontakteve.";
  }

  const contactPayload = {
    name: payload.name,
    email: payload.email,
    message: payload.message,
    created_at: new Date().toISOString(),
  };

  try {
    for (const table of ["contacts", "leads"] as const) {
      const { error } = await supabase.from(table).insert([contactPayload]);

      if (!error) {
        return null;
      }

      if (!error.message.includes("Could not find the table")) {
        return error.message;
      }
    }

    return "Tabela contacts/leads nuk u gjet në Supabase.";
  } catch (error) {
    return error instanceof Error ? error.message : "Ruajtja e kontaktit dështoi.";
  }
}

async function persistNotification(payload: NotificationPayload) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return "Supabase nuk është konfiguruar plotësisht për ruajtjen e njoftimeve.";
  }

  try {
    const { error } = await supabase.from("notifications").insert([
      {
        title: `${payload.type}: ${payload.name}`,
        message: payload.message,
        email: payload.email,
        type: payload.type,
        is_read: false,
        metadata: payload.metadata ?? null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return error.message;
    }

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Ruajtja e njoftimit dështoi.";
  }
}

function buildAdminHtml(payload: NotificationPayload) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #cfa861; border-radius: 12px; background: #111318; color: #ffffff;">
      <h2 style="margin: 0 0 16px; color: #cfa861;">VizualX - ${payload.type}</h2>
      <p><strong>Emri:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Mesazhi:</strong></p>
      <p style="padding: 12px; background: rgba(255,255,255,0.04); border-radius: 8px;">${payload.message}</p>
      <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">Ky njoftim u dërgua automatikisht nga sistemi VizualX.</p>
    </div>
  `;
}

function buildRecipientHtml(payload: NotificationPayload) {
  const details = payload.metadata
    ? Object.entries(payload.metadata)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${String(value)}</li>`)
        .join("")
    : "";

  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #cfa861; border-radius: 12px; background: #ffffff; color: #111827;">
      <h2 style="margin: 0 0 16px; color: #b8862b;">${payload.type}</h2>
      <p>Përshëndetje ${payload.name},</p>
      <p>${payload.message}</p>
      ${details ? `<ul>${details}</ul>` : ""}
      <p style="margin-top: 20px;">Faleminderit,<br />VizualX</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY mungon. Shtojeni në .env.local përpara dërgimit." },
        { status: 500 }
      );
    }

    const payload = (await request.json()) as NotificationPayload;

    if (!payload.name || !payload.email || !payload.message || !payload.type) {
      return NextResponse.json(
        { error: "Mungojnë fushat e kërkuara për njoftimin." },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const warnings: string[] = [];

    if (payload.type === "Lead i ri nga Website") {
      const leadWarning = await persistLead(payload);
      if (leadWarning) {
        warnings.push(leadWarning);
      }
    }

    const notificationWarning = await persistNotification(payload);
    if (notificationWarning) {
      warnings.push(notificationWarning);
    }

    const emailJobs = [
      resend.emails.send({
        from: "VizualX System <onboarding@resend.dev>",
        to: "suport@vizualx.online",
        subject: `Njoftim i Ri: ${payload.type}`,
        html: buildAdminHtml(payload),
      }),
    ];

    if (payload.recipientEmail) {
      emailJobs.push(
        resend.emails.send({
          from: "VizualX System <onboarding@resend.dev>",
          to: payload.recipientEmail,
          subject: payload.type,
          html: buildRecipientHtml(payload),
        })
      );
    }

    await Promise.all(emailJobs);

    return NextResponse.json({
      success: true,
      warning: warnings.length > 0 ? warnings.join(" ") : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dështoi dërgimi i njoftimit.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}