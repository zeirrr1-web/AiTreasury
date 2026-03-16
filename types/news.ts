export type EventCategory = "earthquake" | "disaster" | "conflict" | "social" | "economy" | "politics" | "technology" | "weather";

export interface NewsSourceItem {
  source: string;
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  location?: string;
  category?: EventCategory;
}

export interface DetectedEvent {
  title: string;
  description: string;
  location?: string;
  importanceScore: number;
  eventCategory: EventCategory;
  urgency: "low" | "medium" | "high";
  sources: string[];
}
