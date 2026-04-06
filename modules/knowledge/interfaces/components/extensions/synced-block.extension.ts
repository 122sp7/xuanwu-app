import { Node, mergeAttributes } from "@tiptap/core";

/**
 * SyncedBlock — a reference block whose content mirrors a source block by ID.
 * In the editor it renders as a styled read-only placeholder.
 * Full real-time sync would be implemented via a Firestore listener in a
 * dedicated React component; here the node marks the block as synced so the
 * editor can render a visual indicator.
 */
export const SyncedBlock = Node.create({
  name: "syncedBlock",
  group: "block",
  content: "block*",
  defining: true,

  addAttributes() {
    return {
      sourceBlockId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='synced-block']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "synced-block",
        class: "synced-block",
      }),
      0,
    ];
  },
});
