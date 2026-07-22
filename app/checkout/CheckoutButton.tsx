"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [status, setStatus] = useState<"idle" | "starting" | "error">("idle");
  const [error, setError] = useState("");

  async function startCheckout() {
    setStatus("starting");
    setError("");
    try {
      const response = await fetch("/api/paypal/orders", { method: "POST", headers: { "Content-Type": "application/json" } });
      const body = await response.json() as { approvalUrl?: string; alreadyOwned?: boolean; error?: string };
      if (body.alreadyOwned) {
        window.location.assign("/checkout/success");
        return;
      }
      if (!response.ok || !body.approvalUrl) throw new Error(body.error ?? "Checkout could not start");
      window.location.assign(body.approvalUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not start");
      setStatus("error");
    }
  }

  return <div className="paypal-checkout-action">
    <button onClick={startCheckout} disabled={status === "starting"}>{status === "starting" ? "Opening secure sandbox…" : "Continue with PayPal"}<span aria-hidden="true">↗</span></button>
    <span>PayPal Sandbox · Secure server-confirmed checkout</span>
    {status === "error" && <p role="alert">{error} Please try again.</p>}
  </div>;
}
