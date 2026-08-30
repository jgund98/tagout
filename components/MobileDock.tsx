"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/** Slim mobile conversion dock: appears after the first screen, never on /demo. */
export default function MobileDock() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/demo" || pathname === "/login") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:hidden"
        >
          <Link
            href="/demo"
            className="rounded-full bg-ink px-7 py-3.5 text-[16px] font-extrabold text-paper shadow-lift"
          >
            Get a demo <span className="text-green">→</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
