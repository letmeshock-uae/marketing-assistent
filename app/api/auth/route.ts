import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieName, getAuthCookieValue } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === process.env.APP_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(getAuthCookieName(), getAuthCookieValue(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}
