import { callOpenAI } from "@/lib/ai";
import { DetectedEvent } from "@/types/news";

export interface GeneratedArticle {
  headline: string;
  summary: string;
  article: string;
  keyFacts: string[];
}

export async function generateArticle(event: DetectedEvent): Promise<GeneratedArticle> {
  const prompt = `Write a professional news article based on the following event.
Return JSON with: headline, summary, article, keyFacts.
Event:\n${JSON.stringify(event, null, 2)}`;

  return callOpenAI<GeneratedArticle>(prompt);
}
