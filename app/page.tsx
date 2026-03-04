import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function Home() {
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/chat");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--datum-yellow)] flex items-center justify-center">
              <span className="text-black font-bold text-lg">D</span>
            </div>
            <span className="text-2xl font-bold text-white">Datum</span>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Marketing Agent
          </h1>
          <p className="text-[var(--datum-text-muted)] text-sm">
            AI-powered marketing assistant for the Datum team
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
