"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function PayPalReturn() {
  const params = useSearchParams();
  const orderId = params.get("token");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    void fetch("/api/paypal/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    }).then(async response => {
      const body = await response.json() as { completed?: boolean; error?: string };
      if (!response.ok || !body.completed) throw new Error(body.error ?? "Payment was not confirmed");
      if (active) window.location.replace("/checkout/success");
    }).catch(caught => {
      if (active) setError(caught instanceof Error ? caught.message : "Payment was not confirmed");
    });
    return () => { active = false; };
  }, [orderId]);

  if (!orderId) return <section className="payment-status-card payment-error"><p className="eyebrow">The trail paused</p><h1>We could not confirm the payment.</h1><p>PayPal did not return an order reference.</p><div><Link className="plan-button" href="/checkout">Return to checkout <span>↗</span></Link><Link href="/pricing">Return to pricing</Link></div></section>;
  if (error) return <section className="payment-status-card payment-error"><p className="eyebrow">The trail paused</p><h1>We could not confirm the payment.</h1><p>{error}</p><p>Your Field Guide has not been unlocked and no unconfirmed browser response is treated as payment.</p><div><Link className="plan-button" href="/checkout">Try checkout again <span>↗</span></Link><Link href="/pricing">Return to pricing</Link></div></section>;
  return <section className="payment-status-card"><span className="status-orbit" /><p className="eyebrow">Confirming the trail</p><h1>Checking your PayPal payment…</h1><p>Keep this page open while PayPal confirms the payment.</p></section>;
}
