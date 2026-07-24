"use client";

import { useState } from "react";

type Provider = "paypal" | "creem";

export function CheckoutButtons({
  showCreem,
  creemTestMode,
}: {
  showCreem: boolean;
  creemTestMode: boolean;
}) {
  const [starting, setStarting] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(provider: Provider) {
    setStarting(provider);
    setError("");
    try {
      const response = await fetch(provider === "paypal" ? "/api/paypal/orders" : "/api/creem/checkouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await response.json() as {
        approvalUrl?: string;
        checkoutUrl?: string;
        alreadyOwned?: boolean;
        error?: string;
      };
      if (body.alreadyOwned) {
        window.location.assign("/checkout/success");
        return;
      }
      const destination = provider === "paypal" ? body.approvalUrl : body.checkoutUrl;
      if (!response.ok || !destination) throw new Error(body.error ?? "Checkout could not start");
      window.location.assign(destination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not start");
      setStarting(null);
    }
  }

  return <div className="checkout-methods">
    <div className="paypal-checkout-action">
      <button onClick={() => startCheckout("paypal")} disabled={starting !== null}>
        {starting === "paypal" ? "Opening secure PayPal…" : "Continue with PayPal"}
        <span aria-hidden="true">↗</span>
      </button>
      <span>Live · Secure one-time payment · Confirmed by PayPal</span>
    </div>
    {showCreem && <>
      <div className="checkout-divider"><span>or</span></div>
      <div className="creem-checkout-action">
        <button onClick={() => startCheckout("creem")} disabled={starting !== null}>
          {starting === "creem" ? "Opening secure Creem…" : "Pay by card or wallet"}
          <span aria-hidden="true">↗</span>
        </button>
        <span>{creemTestMode ? "Creem Test Mode · No real charge or paid access" : "Secure one-time payment · Processed by Creem"}</span>
      </div>
    </>}
    {error && <p className="checkout-error" role="alert">{error} Please try again.</p>}
  </div>;
}
