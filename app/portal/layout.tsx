"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PortalProvider, hasSession } from "@/lib/portal/store";
import Shell from "@/components/portal/Shell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasSession()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-3 w-3 rounded-full bg-green tg-pulse" />
      </div>
    );
  }

  return (
    <PortalProvider>
      <Shell>{children}</Shell>
    </PortalProvider>
  );
}
