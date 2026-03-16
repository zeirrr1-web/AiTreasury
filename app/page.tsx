import dynamic from "next/dynamic";
import ArticleCard from "@/components/ArticleCard";
import BreakingBanner from "@/components/BreakingBanner";
import NewsAnchor from "@/components/NewsAnchor";
import { prisma } from "@/lib/prisma";

const EventMap = dynamic(() => import("@/components/EventMap"), { ssr: false });

export default async function HomePage() {
  const [events, articles, broadcast] = await Promise.all([
    prisma.event.findMany({ take: 12, orderBy: { createdAt: "desc" } }),
    prisma.article.findMany({ take: 12, orderBy: { createdAt: "desc" } }),
    prisma.broadcast.findFirst({ orderBy: { createdAt: "desc" } })
  ]);

  const topEvent = events[0];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header>
        <h1 className="text-4xl font-bold">AI-News</h1>
        <p className="mt-2 text-slate-300">Autonomous global event detection and AI-powered reporting.</p>
      </header>

      {topEvent && <BreakingBanner title={topEvent.title} importanceScore={topEvent.importanceScore} />}

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-semibold">Latest Articles</h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                headline={article.headline}
                summary={article.summary}
                createdAt={article.createdAt.toISOString()}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Live AI Broadcast</h2>
          <NewsAnchor videoUrl={broadcast?.videoUrl} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold">Global Event Map</h2>
        <EventMap
          events={events.map((event, index) => ({
            id: event.id,
            title: event.title,
            category: event.category,
            lat: -30 + index * 7,
            lng: -120 + index * 20
          }))}
        />
      </section>
    </main>
  );
}
