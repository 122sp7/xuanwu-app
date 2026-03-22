"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@ui-shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card"
import { Input } from "@ui-shadcn/ui/input"
import type { NamespaceKind } from "../../domain/entities/namespace.entity"
import { deriveSlugCandidate } from "../../domain/services/slug-policy"
import { ListNamespacesByOrganizationUseCase } from "../../application/use-cases/list-namespaces-by-organization.use-case"
import { RegisterNamespaceUseCase } from "../../application/use-cases/register-namespace.use-case"
import { InMemoryNamespaceRepository } from "../../infrastructure/repositories/in-memory-namespace.repository"

interface NamespacePrototypeViewProps {
  readonly organizationId: string
  readonly ownerAccountId: string
}

interface NamespaceRow {
  id: string
  slug: string
  kind: NamespaceKind
  status: string
}

function createNamespaceId(): string {
  return `ns_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function NamespacePrototypeView({ organizationId, ownerAccountId }: NamespacePrototypeViewProps) {
  const repositoryRef = useRef<InMemoryNamespaceRepository | null>(null)
  if (!repositoryRef.current) {
    repositoryRef.current = new InMemoryNamespaceRepository()
  }

  const registerNamespace = useMemo(() => new RegisterNamespaceUseCase(repositoryRef.current!), [])
  const listNamespaces = useMemo(
    () => new ListNamespacesByOrganizationUseCase(repositoryRef.current!),
    [],
  )

  const [displayName, setDisplayName] = useState("")
  const [kind, setKind] = useState<NamespaceKind>("workspace")
  const [rows, setRows] = useState<NamespaceRow[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function refreshRows() {
    const list = await listNamespaces.execute({ organizationId })
    const mapped = list
      .map((item) => ({
        id: item.id,
        slug: item.slug.value,
        kind: item.kind,
        status: item.status,
      }))
      .sort((a, b) => a.slug.localeCompare(b.slug, "zh-Hant"))
    setRows(mapped)
  }

  useEffect(() => {
    void refreshRows()
  }, [organizationId])

  async function handleCreateNamespace() {
    const trimmedName = displayName.trim()
    if (!trimmedName) {
      setErrorMessage("請先輸入名稱")
      return
    }

    const slug = deriveSlugCandidate(trimmedName)
    if (!slug) {
      setErrorMessage("名稱無法產生有效 slug，請改用英文或數字")
      return
    }

    setErrorMessage(null)
    setCreating(true)
    try {
      await registerNamespace.execute({
        id: createNamespaceId(),
        slug,
        kind,
        ownerAccountId,
        organizationId,
      })
      setDisplayName("")
      await refreshRows()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "建立 namespace 失敗")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Namespace Prototype</CardTitle>
          <CardDescription>
            最小雛型：建立 namespace slug 並以 organization scope 列表檢視，供後續 pages tree 掛載使用。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_160px_auto]">
            <Input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="例如：Product Wiki"
            />
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as NamespaceKind)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="workspace">workspace</option>
              <option value="organization">organization</option>
            </select>
            <Button onClick={() => void handleCreateNamespace()} disabled={creating}>
              {creating ? "建立中..." : "建立 Namespace"}
            </Button>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
            slug preview: <span className="font-mono text-foreground">{deriveSlugCandidate(displayName || "sample-namespace") || "-"}</span>
          </div>

          {errorMessage ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Namespaces</CardTitle>
          <CardDescription>
            organizationId: <span className="font-mono">{organizationId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">目前尚無 namespace，先建立第一筆。</p>
          ) : (
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{row.slug}</p>
                    <p className="text-xs text-muted-foreground">id={row.id}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full border border-border/60 px-2 py-1">{row.kind}</span>
                    <span className="rounded-full border border-border/60 px-2 py-1">{row.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
