import { processPayPalWebhook, verifyPayPalWebhook } from "../../../../lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!(await verifyPayPalWebhook(request, rawBody))) return new Response("Invalid signature", { status: 400 });
    await processPayPalWebhook(JSON.parse(rawBody));
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("PayPal webhook processing failed", error instanceof Error ? error.message : "unknown error");
    return new Response("Webhook processing failed", { status: 500 });
  }
}
