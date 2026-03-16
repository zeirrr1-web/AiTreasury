import { NextResponse } from "next/server";
import { fetchWeatherAlerts } from "@/lib/weather";

export async function GET() {
  const alerts = await fetchWeatherAlerts();
  return NextResponse.json({ alerts });
}
