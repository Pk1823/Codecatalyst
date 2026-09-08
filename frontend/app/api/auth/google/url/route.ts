import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const role = searchParams.get("role") || "WELFARE_OFFICER";
    const force = searchParams.get("force") || "CRPF";
    const redirectUri =
      searchParams.get("redirectUri") ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`;

    // 1. Try querying backend port 5000
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    try {
      const backendRes = await fetch(
        `${backendUrl}/api/auth/google/url?role=${encodeURIComponent(role)}&force=${encodeURIComponent(
          force
        )}&redirectUri=${encodeURIComponent(redirectUri)}`
      );
      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not running on 5000, fallback to local URL generation
    }

    // 2. Local Google OAuth URL generation
    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "demo-google-client-id.apps.googleusercontent.com";
    const isConfigured = !clientId.includes("demo-google-client-id");

    const stateObj = {
      role,
      force,
      nonce: Math.random().toString(36).substring(2),
    };
    const state = Buffer.from(JSON.stringify(stateObj)).toString("base64url");

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope:
        "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      access_type: "offline",
      prompt: "consent select_account",
      state,
    });

    return NextResponse.json({
      success: true,
      url: `${rootUrl}?${options.toString()}`,
      clientId,
      isConfigured,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate Google OAuth URL" },
      { status: 500 }
    );
  }
}
