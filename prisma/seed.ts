import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.create({
    data: {
      title: "7.1 magnitude earthquake reported near coastal region",
      description: "Seismic activity triggered emergency response teams.",
      location: "Pacific Rim",
      importanceScore: 91,
      category: "earthquake",
      sources: {
        create: [
          { name: "USGS", url: "https://earthquake.usgs.gov" },
          { name: "NewsAPI", url: "https://newsapi.org" }
        ]
      }
    }
  });

  const article = await prisma.article.create({
    data: {
      headline: "Major Earthquake Strikes Pacific Rim, Rescue Operations Underway",
      summary: "Authorities mobilize after a powerful quake shook coastal communities.",
      body: "Emergency agencies report infrastructure damage and ongoing aftershocks.",
      eventId: event.id
    }
  });

  await prisma.broadcast.create({
    data: {
      articleId: article.id,
      script: "This is your AI anchor with the latest global emergency update.",
      videoUrl: "https://example.com/broadcast.mp4"
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
