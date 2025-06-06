"use client";

import dynamic from "next/dynamic";

// Dynamically import components that use client-side features with no SSR
const ClientApp = dynamic(() => import("./components/client-app"), {
  ssr: false,
});

export default function Home() {
  return <ClientApp />;
}
