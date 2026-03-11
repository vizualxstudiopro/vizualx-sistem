"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(ADMIN_EMAIL);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();

  const infoMessage = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    const messageParam = params.get("message");

    if (errorParam === "unauthorized") {
      return "Vetëm llogaria admin e autorizuar mund të hyjë në panel.";
    }

    if (messageParam === "password-reset-success") {
      return "Fjalëkalimi u ndryshua. Tani mund të identifikoheni me kredencialet e reja.";
    }

    return null;
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResetMessage(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Vetëm email-i admin i autorizuar mund të përdoret për këtë panel.");
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError("Kjo llogari nuk lejohet të hyjë në panel.");
      setLoading(false);
      return;
    }

    const redirectTo = new URLSearchParams(window.location.search).get("redirectTo") || "/dashboard";
    router.push(redirectTo);
    router.refresh();
    setLoading(false);
  };

  const handlePasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetLoading(true);
    setError(null);
    setResetMessage(null);

    if (resetEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setResetMessage("Reset password lejohet vetëm për email-in admin të autorizuar.");
      setResetLoading(false);
      return;
    }

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message);
      setResetLoading(false);
      return;
    }

    setResetMessage("Email-i për reset u dërgua. Kontrolloni inbox-in e admin-it.");
    setResetLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#1a1c23] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            VIZUAL<span className="text-[#cfa861]">X</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Identifikohuni për të hyrë në panel</p>
        </div>

        {infoMessage ? <p className="mb-4 text-center text-xs text-[#cfa861]">{infoMessage}</p> : null}
        <p className="mb-4 text-center text-xs text-gray-500">Admin i lejuar: {ADMIN_EMAIL}</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-[#cfa861]"
              placeholder={ADMIN_EMAIL}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Fjalëkalimi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-[#cfa861]"
              placeholder="********"
            />
          </div>

          {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#cfa861] py-3 font-bold text-[#0f1115] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Duke u verifikuar..." : "Hyr"}
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-6">
          <button
            type="button"
            onClick={() => setShowResetForm((current) => !current)}
            className="w-full text-center text-sm font-medium text-[#cfa861] transition-opacity hover:opacity-80"
          >
            {showResetForm ? "Mbyll reset password" : "Keni harruar fjalëkalimin?"}
          </button>

          {showResetForm ? (
            <form onSubmit={handlePasswordReset} className="mt-4 space-y-4 rounded-xl border border-white/5 bg-[#111318] p-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Email për Reset</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-[#cfa861]"
                  placeholder={ADMIN_EMAIL}
                />
              </div>

              {resetMessage ? <p className="text-center text-xs text-green-400">{resetMessage}</p> : null}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full rounded-xl border border-[#cfa861]/30 bg-[#cfa861]/10 py-3 font-bold text-[#e8c96f] transition-all hover:bg-[#cfa861]/15 disabled:opacity-50"
              >
                {resetLoading ? "Duke dërguar..." : "Dërgo Email Reset"}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}