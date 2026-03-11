"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1c23] rounded-2xl border border-white/5 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">VIZUAL<span className="text-[#cfa861]">X</span></h2>
          <p className="text-gray-400 mt-2 text-sm">Identifikohuni për të hyrë në panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#cfa861] transition-all"
              placeholder="admin@vizualx.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Fjalëkalimi</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#cfa861] transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#cfa861] text-[#0f1115] font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Duke u verifikuar..." : "Hyni në Sistem"}
          </button>
        </form>
      </div>
    </div>
  );
}
