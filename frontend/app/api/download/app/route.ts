import { NextResponse } from "next/server";
import { PERSONNEL_ASSESSMENT_URL } from "@/lib/download-constants";

export async function GET() {
  return NextResponse.redirect(PERSONNEL_ASSESSMENT_URL, { status: 307 });
}
