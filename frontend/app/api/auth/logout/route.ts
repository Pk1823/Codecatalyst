import { NextRequest, NextResponse } from "next/server";
import { getSession, SESSION_COOKIE_NAME } from "@/lib/auth/jwt";
import { AuditService } from "@/services/audit.service";
import { getBackendUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (session) {
      await AuditService.log({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        action: "LOGOUT",
        resource: "User",
        resourceId: session.userId,
      });
    }

    const backendUrl = getBackendUrl();
    try {
      const cookieHeader = req.headers.get("cookie");
      await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
      });
    } catch {
      // Non-blocking background logout notification
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully." });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (error) {
    console.error("[LOGOUT_ERROR]:", error);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
