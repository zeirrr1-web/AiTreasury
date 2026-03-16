import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const broadcast = await prisma.broadcast.findFirst({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ broadcast });
}
