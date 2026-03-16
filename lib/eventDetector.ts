import { DetectedEvent, NewsSourceItem } from "@/types/news";

const patterns = [
  { category: "earthquake", regex: /earthquake|magnitude|aftershock|seismic/i, boost: 32 },
  { category: "disaster", regex: /wildfire|hurricane|flood|disaster|tsunami|cyclone/i, boost: 30 },
  { category: "conflict", regex: /war|conflict|strike|explosion|military|missile/i, boost: 28 },
  { category: "social", regex: /viral|trending|social media|millions of views|eyewitness/i, boost: 22 },
  { category: "economy", regex: /inflation|market|stocks|gdp|recession|rates|unemployment/i, boost: 24 }
] as const;

function scoreSignal(text: string, boost: number): number {
  const lengthBonus = Math.min(15, Math.floor(text.length / 120));
  const keywordDensityBonus = Math.min(20, (text.match(/\b(breaking|urgent|major|global|crisis)\b/gi)?.length ?? 0) * 4);
  return Math.min(95, boost + lengthBonus + keywordDensityBonus);
}

export function detectEvents(items: NewsSourceItem[]): DetectedEvent[] {
  const events: DetectedEvent[] = [];

  for (const item of items) {
    const text = `${item.title} ${item.description ?? ""}`;
    for (const p of patterns) {
      if (p.regex.test(text)) {
        const score = scoreSignal(text, p.boost);
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
