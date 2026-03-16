export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = () => controller.enqueue(encoder.encode(`data: ${JSON.stringify({ ts: Date.now() })}\n\n`));
      send();
      const interval = setInterval(send, 5000);
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 30000);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}
