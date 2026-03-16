import { NewsSourceItem } from "@/types/news";

interface NewsApiResponse {
  articles?: Array<{ title: string; description?: string; url: string; publishedAt: string }>;
}

interface GdeltResponse {
  articles?: Array<{ title: string; seendate: string; sourceurl: string }>;
}

interface EventRegistryResponse {
  articles?: {
    results?: Array<{
      title?: string;
      body?: string;
      url?: string;
      dateTime?: string;
      source?: { title?: string };
    }>;
  };
}

interface RssItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
}

async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, { ...options, next: { revalidate: 60 } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchGoogleNewsRss(): Promise<NewsSourceItem[]> {
  try {
    const response = await fetch("https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", {
      next: { revalidate: 60 }
    });
    if (!response.ok) return [];

    const xml = await response.text();
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).slice(0, 20);

    return items.map((item): NewsSourceItem => {
      const block = item[1];
      const extract = (tag: string) => block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim();
      return {
        source: "Google News RSS",
        title: (extract("title") ?? "Untitled").replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1"),
        description: (extract("description") ?? "RSS event item").replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1"),
        url: (extract("link") ?? "https://news.google.com").replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1"),
        publishedAt: extract("pubDate") ?? new Date().toISOString()
      };
    });
  } catch {
    return [];
  }
}

export async function fetchLatestNews(): Promise<NewsSourceItem[]> {
  const newsApiKey = process.env.NEWS_API_KEY;
  const eventRegistryKey = process.env.EVENT_REGISTRY_API_KEY;

  const [newsApi, gdelt, eventRegistry, rss] = await Promise.all([
    newsApiKey
      ? safeFetch<NewsApiResponse>(
          `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${newsApiKey}`
        )
      : Promise.resolve(null),
    safeFetch<GdeltResponse>(
      "https://api.gdeltproject.org/api/v2/doc/doc?query=breaking&mode=artlist&maxrecords=20&format=json"
    ),
    eventRegistryKey
      ? safeFetch<EventRegistryResponse>(
          `https://eventregistry.org/api/v1/article/getArticles?apiKey=${eventRegistryKey}&lang=eng&isDuplicateFilter=skipDuplicates&articlesCount=20&resultType=articles`
        )
      : Promise.resolve(null),
    fetchGoogleNewsRss()
  ]);

  const merged: NewsSourceItem[] = [
    ...(newsApi?.articles?.map((a) => ({
      source: "NewsAPI",
      title: a.title,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt
    })) ?? []),
    ...(gdelt?.articles?.map((a) => ({
      source: "GDELT",
      title: a.title,
      url: a.sourceurl,
      publishedAt: a.seendate,
      description: "GDELT indexed event"
    })) ?? []),
    ...(eventRegistry?.articles?.results?.map((a) => ({
      source: a.source?.title ?? "EventRegistry",
      title: a.title ?? "Untitled Event",
      description: a.body,
      url: a.url ?? "https://eventregistry.org",
      publishedAt: a.dateTime ?? new Date().toISOString()
    })) ?? []),
    ...rss
  ];

  const unique = new Map<string, NewsSourceItem>();
  for (const item of merged) {
    if (!unique.has(item.url)) unique.set(item.url, item);
  }

  return Array.from(unique.values()).slice(0, 75);
}
