import type { Metadata } from "next";
import { PricingPage } from "./PricingPage";

export const metadata: Metadata = {
  title: "Pricing — WildKind",
  description: "Start with a free WildKind Snapshot, unlock a complete pet personality Field Guide when you are ready, and explore future annual membership.",
};

export default function Page() {
  return <PricingPage />;
}
