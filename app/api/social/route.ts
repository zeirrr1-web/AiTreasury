import { NextResponse } from "next/server";
import { fetchSocialSignals } from "@/lib/socialScanner";

export async function GET() {
  const signals = await fetchSocialSignals();
  return NextResponse.json({ signals });
}
