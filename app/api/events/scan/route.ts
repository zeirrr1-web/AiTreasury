import { NextRequest, NextResponse } from "next/server";
import { runEventScanner } from "@/jobs/eventScanner";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const cronSecret = env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runEventScanner();
  return NextResponse.json(result);
}
