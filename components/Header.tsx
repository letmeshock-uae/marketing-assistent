"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--datum-light-gray)] bg-[var(--datum-dark)] shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-[var(--datum-yellow)] flex items-center justify-center">
          <span className="text-black font-bold text-sm">D</span>
        </div>
        <div>
          <span className="font-semibold text-white text-sm">Datum</span>
          <span className="text-[var(--datum-text-muted)] text-sm ml-1.5">Marketing Agent</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-[var(--datum-text-muted)] text-sm hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-[var(--datum-gray)]"
      >
        Log out
      </button>
    </header>
  );
}
