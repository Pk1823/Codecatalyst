import { NextResponse } from "next/server";
import { APK_DOWNLOAD_URL } from "@/lib/download-constants";

export async function GET() {
  return NextResponse.redirect(APK_DOWNLOAD_URL, { status: 307 });
}
