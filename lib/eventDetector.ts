import { DetectedEvent, NewsSourceItem } from "@/types/news";

const patterns = [
  { category: "earthquake", regex: /earthquake|magnitude|aftershock/i, boost: 30 },
  { category: "disaster", regex: /wildfire|hurricane|flood|disaster|tsunami/i, boost: 28 },
  { category: "conflict", regex: /war|conflict|strike|explosion|military/i, boost: 25 },
  { category: "social", regex: /viral|trending|social media|millions of views/i, boost: 18 },
  { category: "economy", regex: /inflation|market|stocks|gdp|recession|rates/i, boost: 22 }
] as const;

export function detectEvents(items: NewsSourceItem[]): DetectedEvent[] {
  const events: DetectedEvent[] = [];

  for (const item of items) {
    const text = `${item.title} ${item.description ?? ""}`;
    for (const p of patterns) {
      if (p.regex.test(text)) {
        const score = Math.min(95, p.boost + Math.floor(Math.random() * 30));
        events.push({
          title: item.title,
          description: item.description ?? "Detected from external source signals.",
          location: item.location,
          importanceScore: score,
          eventCategory: p.category,
          urgency: score > 75 ? "high" : score > 50 ? "medium" : "low",
          sources: [item.url]
        });
        break;
      }
    }
  }

  return events;
}
