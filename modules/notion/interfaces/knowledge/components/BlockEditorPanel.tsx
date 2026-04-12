"use client";

import { useRef } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { richTextToPlainText } from "../../../subdomains/knowledge/application/dto/knowledge.dto";

/**
 * Notion knowledge subdomain ??minimal block editor.
 * Full drag-and-drop and rich block types are in the extensions/ layer.
 */
export function BlockEditorPanel() {
  const { blocks, addBlock, updateBlock, deleteBlock } = useBlockEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, blockId: string) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockId);
    }
    if (e.key === "Backspace") {
      const target = e.currentTarget;
      if (target.textContent === "") {
        e.preventDefault();
        deleteBlock(blockId);
      }
    }
  }

  function handleInput(e: React.FormEvent<HTMLDivElement>, blockId: string) {
    const text = (e.currentTarget as HTMLDivElement).textContent ?? "";
    updateBlock(blockId, { type: "text", richText: [{ type: "text", plainText: text }] });
  }

  if (!blocks.length) {
    return (
      <div className="flex min-h-[200px] flex-col gap-1 rounded-lg border border-dashed p-4">
        <div
          role="textbox"
          aria-multiline="true"
          aria-label="Add block"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[32px] w-full rounded px-2 py-1 text-sm outline-none focus:bg-muted/30"
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addBlock(null); }
          }}
          data-placeholder="Type '/' for commands"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-0.5">
      {blocks.map((block) => {
        const text = richTextToPlainText(block.content.richText);
        return (
          <div
            key={block.id}
            role="textbox"
            aria-multiline="true"
            aria-label={`?憛?${block.id}`}
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[32px] w-full rounded px-2 py-1 text-sm outline-none focus:bg-muted/30"
            onKeyDown={(e) => handleKeyDown(e, block.id)}
            onInput={(e) => handleInput(e, block.id)}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        );
      })}
    </div>
  );
}

