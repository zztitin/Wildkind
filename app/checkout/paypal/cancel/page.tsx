import { Suspense } from "react";
import { PayPalCancel } from "./PayPalCancel";

export const dynamic = "force-dynamic";

export default function PayPalCancelPage() {
  return <main className="payment-status-page"><Suspense fallback={<div />}><PayPalCancel /></Suspense></main>;
}
