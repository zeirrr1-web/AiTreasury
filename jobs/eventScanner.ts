import { prisma } from "@/lib/prisma";
import { detectEvents } from "@/lib/eventDetector";
import { prioritizeEvents } from "@/lib/newsBrain";
import { fetchLatestNews } from "@/lib/newsSources";

export async function runEventScanner() {
  const latest = await fetchLatestNews();
  const detected = detectEvents(latest);
  const prioritized = prioritizeEvents(detected).slice(0, 10);

  for (const event of prioritized) {
    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        importanceScore: event.importanceScore,
        category: event.eventCategory,
        sources: {
          create: event.sources.map((url) => ({ name: "Signal", url }))
        }
      }
    });
  }

  return { scanned: latest.length, detected: prioritized.length };
}

if (require.main === module) {
  runEventScanner()
    .then((result) => {
      console.log("scanner result", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
