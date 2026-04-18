/**
 * @module ui-editor
 * Lightweight editor wrappers for package-level composition.
 */

import { createElement, type ChangeEventHandler, type TextareaHTMLAttributes } from "react";

export interface RichTextEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange, ...rest }: RichTextEditorProps) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    onChange(event.target.value);
  };

  return createElement("textarea", {
    ...rest,
    value,
    onChange: handleChange,
    className: `min-h-32 w-full rounded-md border p-3 ${rest.className ?? ""}`.trim(),
  });
};

export interface ReadOnlyEditorProps {
  value: string;
}

export const ReadOnlyEditor = ({ value }: ReadOnlyEditorProps) =>
  createElement("div", {
    className: "prose max-w-none rounded-md border p-3",
    dangerouslySetInnerHTML: { __html: value },
  });
