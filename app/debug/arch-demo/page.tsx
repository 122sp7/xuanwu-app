/**
 * app/debug/arch-demo/page.tsx
 *
 * Architecture Phase 3 — Debug Page
 *
 * Server Component that demonstrates the full Content → EventBus → Knowledge loop.
 * - Creates a page via createPageAction.
 * - Adds / updates a block with [[WikiLinks]] via addBlockAction / updateBlockAction.
 * - Renders a JSON dump of the knowledge graph to verify the loop is working.
 *
 * Constraints (MDDD & Occam's Razor):
 *   - Reads data directly from the module-level singletons in modules/system.ts.
 *   - Mutations go through Server Actions in modules/interfaces/_actions/demo.actions.ts.
 *   - UI is minimal raw HTML + Tailwind; no complex shared components.
 */

import { contentApi, knowledgeApi, DEMO_ACCOUNT_ID } from "@/modules/system";
import {
  createPageAction,
  addBlockAction,
  updateBlockAction,
} from "@/modules/interfaces/_actions/demo.actions";

export const metadata = { title: "Arch Demo — Phase 3" };

export default async function ArchDemoPage() {
  // ── Read current state from in-memory singletons ──────────────────────────
  const pages = await contentApi.listPages(DEMO_ACCOUNT_ID);
  const graphData = await knowledgeApi.getGraphData();

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-mono text-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        🏗️ Architecture Phase 3 — Interface Wiring Demo
      </h1>

      {/* ── Section 1: Create Page ────────────────────────────────────────── */}
      <section className="mb-8 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">1. Create Page</h2>
        <form action={createPageAction} className="flex gap-2">
          <input
            name="title"
            type="text"
            defaultValue="My Demo Page"
            className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Page title"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Page
          </button>
        </form>
      </section>

      {/* ── Section 2: Add Block ──────────────────────────────────────────── */}
      <section className="mb-8 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">2. Add Block to Page</h2>
        {pages.length === 0 ? (
          <p className="text-gray-400">No pages yet — create one first.</p>
        ) : (
          <form action={addBlockAction} className="flex flex-col gap-2">
            <select
              name="pageId"
              className="rounded border border-gray-300 px-3 py-1.5 text-sm"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.id.slice(0, 8)}…)
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                name="text"
                type="text"
                defaultValue="Hello [[World]]"
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
                placeholder="Block text (use [[WikiLinks]])"
              />
              <button
                type="submit"
                className="rounded bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Add Block
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Section 3: Update Block ───────────────────────────────────────── */}
      <section className="mb-8 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">
          3. Update Block (triggers Event → Knowledge)
        </h2>
        {pages.length === 0 ? (
          <p className="text-gray-400">No pages yet.</p>
        ) : (
          <form action={updateBlockAction} className="flex flex-col gap-2">
            <input
              name="blockId"
              type="text"
              className="rounded border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Block ID (copy from below)"
            />
            <div className="flex gap-2">
              <input
                name="text"
                type="text"
                defaultValue="Updated text [[AnotherLink]]"
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
                placeholder="New block text (use [[WikiLinks]] to grow the graph)"
              />
              <button
                type="submit"
                className="rounded bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                Update Block
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Section 4: Current Pages ──────────────────────────────────────── */}
      <section className="mb-8 rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">
          Current Pages ({pages.length})
        </h2>
        {pages.length === 0 ? (
          <p className="text-gray-400">No pages yet.</p>
        ) : (
          <ul className="space-y-1">
            {pages.map((p) => (
              <li key={p.id} className="rounded bg-gray-50 px-3 py-1.5">
                <span className="font-medium">{p.title}</span>{" "}
                <span className="text-gray-400">id={p.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Section 5: Knowledge Graph (JSON dump) ────────────────────────── */}
      <section className="rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">
          Knowledge Graph ({graphData.nodes.length} nodes, {graphData.edges.length} edges)
        </h2>
        <p className="mb-2 text-xs text-gray-500">
          Add a block with <code className="bg-gray-100 px-1">[[WikiLink]]</code> syntax and the
          graph will update automatically via the event bus.
        </p>
        <pre className="max-h-96 overflow-auto rounded bg-gray-900 p-4 text-xs text-green-400">
          {JSON.stringify(graphData, null, 2)}
        </pre>
      </section>
    </main>
  );
}
