import { Node, mergeAttributes } from "@tiptap/core";

/**
 * TableOfContentsBlock — a read-only auto-generated TOC node.
 * Renders as: <div data-type="toc" contenteditable="false">...</div>
 * Actual heading links are injected via the editor's DOM at render time.
 */
export const TableOfContentsNode = Node.create({
  name: "tableOfContents",
  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='toc']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "toc",
        contenteditable: "false",
        class: "toc-block",
      }),
    ];
  },
});
