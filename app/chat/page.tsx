import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";

export default async function ChatPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/");
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <ChatInterface />
    </div>
  );
}
