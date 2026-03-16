import { prisma } from "@/lib/prisma";
import { generateArticle } from "@/lib/articleGenerator";
import { generateBroadcast } from "@/lib/broadcastGenerator";

export async function runArticlePipeline() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    where: { articles: { none: {} } }
  });

  for (const event of events) {
    const generated = await generateArticle({
      title: event.title,
      description: event.description,
      location: event.location ?? undefined,
      importanceScore: event.importanceScore,
      eventCategory: event.category as never,
      urgency: event.importanceScore > 80 ? "high" : "medium",
      sources: []
    });

    const article = await prisma.article.create({
      data: {
        eventId: event.id,
        headline: generated.headline,
        summary: generated.summary,
        body: generated.article
      }
    });

    const broadcast = await generateBroadcast(generated);
    await prisma.broadcast.create({
      data: {
        articleId: article.id,
        script: broadcast.script,
        videoUrl: broadcast.videoUrl
      }
    });
  }

  return { processed: events.length };
}
