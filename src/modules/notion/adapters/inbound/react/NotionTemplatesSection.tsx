"use client";

/**
 * NotionTemplatesSection — notion.templates tab — template library.
 */

import { Button } from "@packages";
import { Layout } from "lucide-react";
import { useState, useTransition } from "react";

import type { Template } from "../../../subdomains/template/domain/entities/Template";
import { queryTemplatesAction } from "../server-actions/template-actions";

interface NotionTemplatesSectionProps {
  workspaceId: string;
  accountId: string;
}

export function NotionTemplatesSection({
  workspaceId,
  accountId,
}: NotionTemplatesSectionProps): React.ReactElement {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    startTransition(async () => {
      const result = await queryTemplatesAction({ workspaceId, accountId });
      setTemplates(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">模板</h2>
        </div>
        {!loaded && (
          <Button size="sm" variant="ghost" onClick={load} disabled={isPending}>
            {isPending ? "載入中…" : "載入模板"}
          </Button>
        )}
      </div>

      {loaded && (
        <>
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">尚無模板。</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((tpl) => (
                <li
                  key={tpl.id}
                  className="rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{tpl.title}</span>
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {tpl.category}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  ) as React.ReactElement;
}
