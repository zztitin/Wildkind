import { Suspense } from "react";
import { PayPalReturn } from "./PayPalReturn";

export const dynamic = "force-dynamic";

export default function PayPalReturnPage() {
  return <main className="payment-status-page"><Suspense fallback={<StatusFallback />}><PayPalReturn /></Suspense></main>;
}

function StatusFallback() {
  return <section className="payment-status-card"><span className="status-orbit" /><p className="eyebrow">Confirming the trail</p><h1>Checking your sandbox payment…</h1><p>Keep this page open while PayPal confirms the capture.</p></section>;
}
