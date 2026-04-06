import { Node, mergeAttributes } from "@tiptap/core";

/**
 * CalloutBlock — a highlighted info/warning callout block.
 * Renders as: <div data-type="callout"><p>...</p></div>
 */
export const CalloutBlock = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      emoji: { default: "💡" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='callout']" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "callout", class: "callout-block" }),
      ["span", { class: "callout-emoji", contenteditable: "false" }, node.attrs.emoji as string],
      ["div", { class: "callout-content" }, 0],
    ];
  },
});
