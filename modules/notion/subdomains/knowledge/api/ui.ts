/**
 * notion/knowledge UI surface.
 * UI consumers should import from this file instead of the semantic api barrel.
 */

export { PageTreePanel } from "../../../interfaces/knowledge/components/PageTreePanel";
export type { PageTreePanelProps } from "../../../interfaces/knowledge/components/PageTreePanel";
export { PageDialog } from "../../../interfaces/knowledge/components/PageDialog";
export { BlockEditorPanel } from "../../../interfaces/knowledge/components/BlockEditorPanel";
export { PageEditorPanel } from "../../../interfaces/knowledge/components/PageEditorPanel";
export type { PageEditorPanelProps } from "../../../interfaces/knowledge/components/PageEditorPanel";
export { KnowledgePagesPanel } from "../../../interfaces/knowledge/components/KnowledgePagesPanel";
export type { KnowledgePagesPanelProps } from "../../../interfaces/knowledge/components/KnowledgePagesPanel";
export { useBlockEditorStore } from "../../../interfaces/knowledge/store/block-editor.store";
export type { EditorBlock } from "../../../interfaces/knowledge/store/block-editor.store";
export { TitleEditor, IconPicker, CoverEditor } from "../../../interfaces/knowledge/components/KnowledgePageHeaderWidgets";
export type {
  TitleEditorProps,
  IconPickerProps,
  CoverEditorProps,
} from "../../../interfaces/knowledge/components/KnowledgePageHeaderWidgets";
export { KnowledgeDetailPanel } from "../../../interfaces/knowledge/components/KnowledgeDetailPanel";
export type { KnowledgeDetailPanelProps } from "../../../interfaces/knowledge/components/KnowledgeDetailPanel";
