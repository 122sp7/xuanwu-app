"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WikiBetaRagReindexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wiki-beta/documents");
  }, [router]);

  return null;
}
