import { NewsSourceItem } from "@/types/news";

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, { ...options, next: { revalidate: 60 } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchLatestNews(): Promise<NewsSourceItem[]> {
  const newsApiKey = process.env.NEWS_API_KEY;

  const [newsApi, gdelt] = await Promise.all([
    newsApiKey
      ? safeFetch<{ articles: Array<{ title: string; description: string; url: string; publishedAt: string }> }>(
          `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${newsApiKey}`
        )
      : Promise.resolve(null),
    safeFetch<{ articles: Array<{ title: string; seendate: string; sourceurl: string }> }>(
      "https://api.gdeltproject.org/api/v2/doc/doc?query=breaking&mode=artlist&maxrecords=20&format=json"
    )
  ]);

  const fromNewsApi: NewsSourceItem[] =
    newsApi?.articles.map((a) => ({
      source: "NewsAPI",
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt,
    })) ?? [];

  const fromGdelt: NewsSourceItem[] =
    gdelt?.articles.map((a) => ({
      source: "GDELT",
      title: a.title,
      url: a.sourceurl,
      publishedAt: a.seendate,
      description: "GDELT indexed event"
    })) ?? [];

  return [...fromNewsApi, ...fromGdelt].slice(0, 50);
}
