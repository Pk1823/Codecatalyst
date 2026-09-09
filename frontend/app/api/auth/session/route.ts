import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Fetch fresh user record
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { personnel: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        serviceId: user.serviceId,
        role: user.role,
        rank: user.rank,
        force: user.force,
        department: user.department,
        personnelId: user.personnel?.id,
        isGoogleAccount: user.email.includes("@gmail.com") || Boolean(user.avatarUrl),
      },
    });
  } catch (error) {
    console.error("[SESSION_ERROR]:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
