import { Node, mergeAttributes } from "@tiptap/core";

/**
 * ToggleBlock — a collapsible details/summary block.
 * Renders as: <details><summary>...</summary></details>
 */
export const ToggleBlock = Node.create({
  name: "toggle",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "details" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["details", mergeAttributes(HTMLAttributes, { class: "toggle-block" }), 0];
  },
});
