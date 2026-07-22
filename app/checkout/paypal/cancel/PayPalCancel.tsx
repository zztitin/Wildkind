"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PayPalCancel() {
  const orderId = useSearchParams().get("token");
  useEffect(() => {
    if (orderId) void fetch("/api/paypal/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId }) });
  }, [orderId]);

  return <section className="payment-status-card payment-cancelled"><p className="eyebrow">No coordinates changed</p><h1>Checkout cancelled.</h1><p>No payment was captured, and your free WildKind Snapshot remains available.</p><div><Link className="plan-button" href="/checkout">Return to checkout <span>↗</span></Link><Link href="/">Continue with the free Snapshot</Link></div></section>;
}
