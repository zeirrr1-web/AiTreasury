import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ events });
}
