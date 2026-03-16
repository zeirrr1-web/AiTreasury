import { GeneratedArticle } from "@/lib/articleGenerator";

export interface GeneratedBroadcast {
  script: string;
  videoUrl: string;
  provider: "heygen" | "d-id" | "synthesia";
}

export async function generateBroadcast(article: GeneratedArticle): Promise<GeneratedBroadcast> {
  const script = `Good evening. Here's the latest update: ${article.summary}`;
  return {
    script,
    videoUrl: "https://example.com/placeholder-ai-anchor-video.mp4",
    provider: "heygen"
  };
}
