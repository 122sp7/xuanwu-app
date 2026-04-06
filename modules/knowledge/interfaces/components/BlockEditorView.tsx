"use client";

import { useCallback, useEffect, useRef } from "react";
import { monitorForElements } from "@lib-dragdrop";

import { useBlockEditorStore } from "../store/block-editor.store";
import { BlockRow } from "./block-row";

/**
 * BlockEditorView — Block-based editor with drag-and-drop reordering.
 * Block types, row rendering, and type-selector are extracted to focused files.
 */
export function BlockEditorView() {
  const { blocks, addBlock, updateBlock, changeBlockType, deleteBlock, moveBlock, init } =
    useBlockEditorStore();
  const focusNextRef = useRef<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setBlockRef = useCallback((id: string, el: HTMLDivElement | null) => {
    blockRefs.current[id] = el;
  }, []);

  useEffect(() => { init(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const intent = focusNextRef.current;
    if (!intent) return;

    let targetId: string | undefined;
    if (intent.startsWith("__after:")) {
      const afterId = intent.slice("__after:".length);
      const idx = blocks.findIndex((b) => b.id === afterId);
      targetId = blocks[idx + 1]?.id;
    } else {
      targetId = intent;
    }

    if (targetId) {
      const el = blockRefs.current[targetId];
      if (el) {
        el.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
        focusNextRef.current = null;
      }
    }
  });

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;
        const fromId = source.data["blockId"] as string | undefined;
        const toId = target.data["blockId"] as string | undefined;
        if (!fromId || !toId || fromId === toId) return;
        const fromIdx = blocks.findIndex((b) => b.id === fromId);
        const toIdx = blocks.findIndex((b) => b.id === toId);
        if (fromIdx !== -1 && toIdx !== -1) moveBlock(fromIdx, toIdx);
      },
    });
  }, [blocks, moveBlock]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, blockId: string) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addBlock(blockId);
        focusNextRef.current = `__after:${blockId}`;
      } else if (event.key === "Backspace") {
        const el = blockRefs.current[blockId];
        if (!el?.textContent) {
          event.preventDefault();
          const idx = blocks.findIndex((b) => b.id === blockId);
          if (idx > 0) {
            const prevId = blocks[idx - 1].id;
            deleteBlock(blockId);
            focusNextRef.current = prevId;
          }
        }
      }
    },
    [addBlock, blocks, deleteBlock],
  );

  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Block Editor</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">區塊編輯器</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          支援 10 種區塊類型 · Enter 換行 · Backspace 刪除空白區塊 · 拖曳重排
        </p>
      </div>

      <div className="space-y-0.5">
        {blocks.map((block, idx) => (
          <BlockRow
            key={block.id}
            block={block}
            index={idx}
            setBlockRef={setBlockRef}
            onKeyDown={handleKeyDown}
            onTextChange={(text) => updateBlock(block.id, text)}
            onTypeChange={(type) => changeBlockType(block.id, type)}
          />
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/60">
        {blocks.length} 個區塊 · Enter 新增 · Backspace 刪除空白區塊 · 拖曳重排
      </p>
    </section>
  );
}
