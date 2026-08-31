"use client";

import { useRouter } from "next/navigation";
import { switchDemoRole, type SessionRole } from "@/lib/portal/store";

/**
 * Demo-only POV switcher: hop between the GM portal, the server (staff) app,
 * and the internal Tagout admin without reseeding the world. Ships until launch.
 */
const POVS: { key: SessionRole; label: string; href: string }[] = [
  { key: "gm", label: "GM", href: "/portal" },
  { key: "staff", label: "Server", href: "/me" },
  { key: "admin", label: "Admin", href: "/admin" },
];

export function PovSwitch({ current, dark = false }: { current: SessionRole; dark?: boolean }) {
  const router = useRouter();
  return (
    <div
      className={`flex items-center gap-0.5 rounded-full p-0.5 ${
        dark ? "bg-paper/10" : "border border-ink/10 bg-white"
      }`}
    >
      {POVS.map((p) => (
        <button
          key={p.key}
          onClick={() => {
            if (p.key === current) return;
            switchDemoRole(p.key, p.key === "staff" ? "marisa" : undefined);
            router.push(p.href);
          }}
          className={`rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide transition-colors ${
            p.key === current
              ? dark
                ? "bg-green text-ink"
                : "bg-pine text-paper"
              : dark
                ? "text-paper/50 hover:text-paper"
                : "text-ink/40 hover:text-ink"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
