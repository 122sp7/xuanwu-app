"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WikiRagReindexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wiki/documents");
  }, [router]);

  return null;
}
