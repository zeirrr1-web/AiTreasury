import { NextResponse } from "next/server";
import { runEventScanner } from "@/jobs/eventScanner";

export async function GET() {
  const result = await runEventScanner();
  return NextResponse.json(result);
}
