import { headers } from "next/headers";
import { WildKindApp } from "./components/WildKindApp";
import { getGoogleUserFromCookie } from "../lib/google-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  const user = await getGoogleUserFromCookie(requestHeaders.get("cookie"));
  return <WildKindApp initialUser={user ? { name: user.name, email: user.email } : null} />;
}
