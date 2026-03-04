"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function MessageBubble({ role, content, isStreaming }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] md:max-w-[70%] bg-[var(--datum-light-gray)] text-white px-4 py-3 rounded-2xl rounded-br-md">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex gap-3 max-w-[90%] md:max-w-[80%]">
        <div className="shrink-0 w-7 h-7 rounded-md bg-[var(--datum-yellow)] flex items-center justify-center mt-1">
          <span className="text-black font-bold text-xs">D</span>
        </div>
        <div className={`markdown-content text-[var(--datum-text)] leading-relaxed ${isStreaming ? "typing-cursor" : ""}`}>
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <span className="typing-cursor" />
          )}
        </div>
      </div>
    </div>
  );
}
