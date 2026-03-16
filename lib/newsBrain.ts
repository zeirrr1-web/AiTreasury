import { DetectedEvent } from "@/types/news";

export function evaluateSignal(event: DetectedEvent) {
  const urgencyBonus = event.urgency === "high" ? 20 : event.urgency === "medium" ? 10 : 0;
  const sourceBonus = Math.min(event.sources.length * 3, 15);
  const importanceScore = Math.min(100, event.importanceScore + urgencyBonus + sourceBonus);

  return {
    ...event,
    importanceScore,
    priority: importanceScore > 80 ? "critical" : importanceScore > 60 ? "elevated" : "normal"
  };
}

export function prioritizeEvents(events: DetectedEvent[]) {
  return events.map(evaluateSignal).sort((a, b) => b.importanceScore - a.importanceScore);
}
