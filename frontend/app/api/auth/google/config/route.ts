import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "";
  const isConfigured = Boolean(
    clientId && !clientId.includes("demo-google-client-id")
  );

  return NextResponse.json({
    success: true,
    clientId,
    isConfigured,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId } = body;

    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json(
        { error: "A valid Google Client ID is required" },
        { status: 400 }
      );
    }

    const trimmedId = clientId.trim();
    const envPath = path.resolve(process.cwd(), ".env.local");

    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }

    // Replace or append NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (content.includes("NEXT_PUBLIC_GOOGLE_CLIENT_ID=")) {
      content = content.replace(
        /NEXT_PUBLIC_GOOGLE_CLIENT_ID=.*/g,
        `NEXT_PUBLIC_GOOGLE_CLIENT_ID="${trimmedId}"`
      );
    } else {
      content += `\nNEXT_PUBLIC_GOOGLE_CLIENT_ID="${trimmedId}"\n`;
    }

    // Also set GOOGLE_CLIENT_ID
    if (content.includes("GOOGLE_CLIENT_ID=")) {
      content = content.replace(
        /GOOGLE_CLIENT_ID=.*/g,
        `GOOGLE_CLIENT_ID="${trimmedId}"`
      );
    } else {
      content += `GOOGLE_CLIENT_ID="${trimmedId}"\n`;
    }

    fs.writeFileSync(envPath, content, "utf-8");

    // Also update runtime process.env
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = trimmedId;
    process.env.GOOGLE_CLIENT_ID = trimmedId;

    return NextResponse.json({
      success: true,
      message: "Google Client ID successfully configured",
      clientId: trimmedId,
      isConfigured: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to update Google configuration" },
      { status: 500 }
    );
  }
}
