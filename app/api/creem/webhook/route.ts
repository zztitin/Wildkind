import { processCreemWebhook, verifyCreemWebhook } from "../../../../lib/creem";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!(await verifyCreemWebhook(request, rawBody))) return new Response("Invalid signature", { status: 400 });
    await processCreemWebhook(JSON.parse(rawBody));
    return new Response("OK");
  } catch (error) {
    console.error("Creem webhook processing failed", error instanceof Error ? error.message : "unknown error");
    return new Response("Webhook could not be processed", { status: 500 });
  }
}
