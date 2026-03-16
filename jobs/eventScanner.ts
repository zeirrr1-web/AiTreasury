import { prisma } from "@/lib/prisma";
import { detectEvents } from "@/lib/eventDetector";
import { prioritizeEvents } from "@/lib/newsBrain";
import { fetchLatestNews } from "@/lib/newsSources";
import { fetchEarthquakes, fetchNaturalEvents } from "@/lib/disasters";
import { fetchWeatherAlerts } from "@/lib/weather";
import { fetchSocialSignals } from "@/lib/socialScanner";
import { NewsSourceItem } from "@/types/news";

function normalizeEarthquakes(quakes: any[]): NewsSourceItem[] {
  return quakes.slice(0, 10).map((q) => ({
    source: "USGS",
    title: q.properties?.title ?? "Earthquake detected",
    description: q.properties?.place,
    url: q.properties?.url ?? "https://earthquake.usgs.gov",
    publishedAt: q.properties?.time ? new Date(q.properties.time).toISOString() : new Date().toISOString(),
    category: "earthquake"
  }));
}

function normalizeNaturalEvents(events: any[]): NewsSourceItem[] {
  return events.slice(0, 10).map((e) => ({
    source: "NASA EONET",
    title: e.title ?? "Natural event",
    description: e.description,
    url: `https://eonet.gsfc.nasa.gov/events/${e.id}`,
    publishedAt: e.geometry?.[0]?.date ?? new Date().toISOString(),
    category: "disaster"
  }));
}

function normalizeWeatherAlerts(alerts: any[]): NewsSourceItem[] {
  return alerts.slice(0, 10).map((a) => ({
    source: "NOAA",
    title: a.properties?.headline ?? "Weather Alert",
    description: a.properties?.description,
    url: a.id ?? "https://api.weather.gov/alerts/active",
    publishedAt: a.properties?.sent ?? new Date().toISOString(),
    category: "weather"
  }));
}

function normalizeSocialSignals(signals: Awaited<ReturnType<typeof fetchSocialSignals>>): NewsSourceItem[] {
  return signals.slice(0, 10).map((s) => ({
    source: s.platform,
    title: s.topic,
    description: `Velocity score: ${s.velocity}`,
    url: s.url,
    publishedAt: new Date().toISOString(),
    category: "social"
  }));
}

export async function runEventScanner() {
  const [latest, quakes, natural, alerts, social] = await Promise.all([
    fetchLatestNews(),
    fetchEarthquakes(),
    fetchNaturalEvents(),
    fetchWeatherAlerts(),
    fetchSocialSignals()
  ]);

  const allSignals = [
    ...latest,
    ...normalizeEarthquakes(quakes),
    ...normalizeNaturalEvents(natural),
    ...normalizeWeatherAlerts(alerts),
    ...normalizeSocialSignals(social)
  ];

  const detected = detectEvents(allSignals);
  const prioritized = prioritizeEvents(detected).slice(0, 15);

  for (const event of prioritized) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        importanceScore: event.importanceScore,
        category: event.eventCategory,
        sources: {
          create: event.sources.map((url) => ({ name: "Signal", url }))
        }
      }
    });
  }

  return { scanned: allSignals.length, detected: prioritized.length };
}
