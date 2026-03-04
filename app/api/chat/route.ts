import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAuthenticated } from "@/lib/auth";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { loadEnv } from "@/lib/env";

// Ensure env vars are loaded even if Next.js missed them
loadEnv();

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();
  const encoder = new TextEncoder();

  try {
    const anthropic = getClient();

    const stream = await anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const msg = error instanceof Error ? error.message : "Stream failed";
          const errorData = JSON.stringify({ error: msg });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("API error:", error);

    let errorMessage = "Failed to connect to AI. Please try again.";
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message?: string; error?: { message?: string } };
      if (apiError.status === 400 && apiError.error?.message?.includes("credit balance")) {
        errorMessage = "⚠️ Anthropic API balance is too low. Please top up at console.anthropic.com → Plans & Billing.";
      } else if (apiError.status === 401) {
        errorMessage = "⚠️ Invalid API key. Check ANTHROPIC_API_KEY.";
      } else if (apiError.status === 429) {
        errorMessage = "⚠️ Rate limit exceeded. Wait a moment and try again.";
      } else {
        errorMessage = `⚠️ API error (${apiError.status}): ${apiError.error?.message || apiError.message || "Unknown error"}`;
      }
    } else if (error instanceof Error && error.message.includes("authentication")) {
      errorMessage = "⚠️ API key not configured. Set ANTHROPIC_API_KEY in .env.local";
    }

    const readableStream = new ReadableStream({
      start(controller) {
        const data = JSON.stringify({ text: errorMessage });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
}
