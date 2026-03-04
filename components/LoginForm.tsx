"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/chat");
        router.refresh();
      } else {
        setError("Wrong password");
        setPassword("");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter team password"
          className="w-full px-4 py-3 bg-[var(--datum-gray)] border border-[var(--datum-light-gray)] rounded-lg text-white placeholder-[var(--datum-text-muted)] focus:outline-none focus:border-[var(--datum-yellow)] focus:ring-1 focus:ring-[var(--datum-yellow)] transition-colors"
          autoFocus
          disabled={loading}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full py-3 bg-[var(--datum-yellow)] text-black font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
