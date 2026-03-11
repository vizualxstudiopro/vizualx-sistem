"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Fjalëkalimi duhet të ketë të paktën 8 karaktere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess("Fjalëkalimi u ndryshua me sukses. Po ju kthejmë te login.");
    setLoading(false);

    window.setTimeout(() => {
      router.push("/login?message=password-reset-success");
      router.refresh();
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1115] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#1a1c23] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Reset <span className="text-[#cfa861]">Password</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">Vendosni fjalëkalimin e ri për llogarinë admin.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-400">Fjalëkalimi i Ri</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-[#cfa861]"
              placeholder="********"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Konfirmo Fjalëkalimin</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all focus:border-[#cfa861]"
              placeholder="********"
            />
          </div>

          {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
          {success ? <p className="text-center text-xs text-green-400">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#cfa861] py-3 font-bold text-[#0f1115] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Duke përditësuar..." : "Ruaj Fjalëkalimin"}
          </button>
        </form>
      </div>
    </div>
  );
}