/**
 * EditorToolbar — Markdown formatting toolbar for the blog textarea.
 *
 * Each button wraps/inserts Markdown at the textarea cursor position.
 * The component receives a ref to the <textarea> and a state-setter so it
 * can keep the parent's form state in sync after mutations.
 */

import { useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link,
  List,
  Quote,
  Code,
  Table,
  Image,
  Minus,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Insertion helpers
// ---------------------------------------------------------------------------

type TextareaRef = React.RefObject<HTMLTextAreaElement | null>;

interface InsertOpts {
  /** Text to prepend to selection (or the whole snippet if suffix is empty) */
  prefix: string;
  /** Text to append after selection. Omit for block prefixes like "## ". */
  suffix?: string;
  /** Placeholder text placed inside prefix/suffix when nothing is selected */
  placeholder?: string;
  /** When true, insert on its own line regardless of cursor position */
  block?: boolean;
}

function insertMarkdown(ref: TextareaRef, onChange: (v: string) => void, opts: InsertOpts) {
  const el = ref.current;
  if (!el) return;
  el.focus();

  const { prefix, suffix = "", placeholder = "", block = false } = opts;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const value = el.value;
  const selected = value.slice(start, end) || placeholder;

  let before = value.slice(0, start);
  let after = value.slice(end);

  // For block-level elements, ensure we're on a fresh line
  if (block) {
    if (before.length > 0 && !before.endsWith("\n")) before += "\n";
  }

  const insertion = `${prefix}${selected}${suffix}`;
  const newValue = before + insertion + after;
  const newCursorPos = before.length + prefix.length + selected.length + suffix.length;

  // Update the textarea
  el.value = newValue;

  // Notify React
  onChange(newValue);

  // Restore cursor / selection
  const selectStart = before.length + prefix.length;
  const selectEnd = before.length + prefix.length + selected.length;
  el.setSelectionRange(selectStart, selectEnd);
}

function insertSnippet(ref: TextareaRef, onChange: (v: string) => void, snippet: string) {
  const el = ref.current;
  if (!el) return;
  el.focus();

  const start = el.selectionStart;
  const value = el.value;
  let before = value.slice(0, start);
  const after = value.slice(start);

  if (before.length > 0 && !before.endsWith("\n\n")) {
    before += before.endsWith("\n") ? "\n" : "\n\n";
  }

  const newValue = before + snippet + "\n\n" + after;
  el.value = newValue;
  onChange(newValue);
  el.setSelectionRange(before.length, before.length + snippet.length);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ToolbarProps {
  textareaRef: TextareaRef;
  onChange: (value: string) => void;
  onInsertProperty?: () => void; // opens property picker popover
}

interface ToolbarButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  dividerBefore?: boolean;
}

export function EditorToolbar({ textareaRef, onChange, onInsertProperty }: ToolbarProps) {
  const ins = (opts: InsertOpts) => insertMarkdown(textareaRef, onChange, opts);
  const snip = (s: string) => insertSnippet(textareaRef, onChange, s);

  const TABLE_SNIPPET = `| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n| Cell | Cell | Cell |`;

  const buttons: ToolbarButton[] = [
    {
      id: "toolbar-bold",
      label: "Bold",
      icon: <Bold size={13} />,
      action: () => ins({ prefix: "**", suffix: "**", placeholder: "bold text" }),
    },
    {
      id: "toolbar-italic",
      label: "Italic",
      icon: <Italic size={13} />,
      action: () => ins({ prefix: "*", suffix: "*", placeholder: "italic text" }),
    },
    {
      id: "toolbar-h2",
      label: "Heading 2",
      icon: <Heading2 size={13} />,
      action: () => ins({ prefix: "## ", placeholder: "Section heading", block: true }),
      dividerBefore: true,
    },
    {
      id: "toolbar-h3",
      label: "Heading 3",
      icon: <Heading3 size={13} />,
      action: () => ins({ prefix: "### ", placeholder: "Sub-heading", block: true }),
    },
    {
      id: "toolbar-link",
      label: "Link",
      icon: <Link size={13} />,
      action: () => ins({ prefix: "[", suffix: "](url)", placeholder: "link text" }),
      dividerBefore: true,
    },
    {
      id: "toolbar-list",
      label: "Bullet List",
      icon: <List size={13} />,
      action: () => ins({ prefix: "- ", placeholder: "List item", block: true }),
    },
    {
      id: "toolbar-quote",
      label: "Blockquote",
      icon: <Quote size={13} />,
      action: () => ins({ prefix: "> ", placeholder: "Quote text", block: true }),
    },
    {
      id: "toolbar-code",
      label: "Code",
      icon: <Code size={13} />,
      action: () => ins({ prefix: "`", suffix: "`", placeholder: "code" }),
    },
    {
      id: "toolbar-hr",
      label: "Horizontal Rule",
      icon: <Minus size={13} />,
      action: () => snip("---"),
      dividerBefore: true,
    },
    {
      id: "toolbar-table",
      label: "Insert Table",
      icon: <Table size={13} />,
      action: () => snip(TABLE_SNIPPET),
    },
    {
      id: "toolbar-image",
      label: "Image",
      icon: <Image size={13} />,
      action: () => ins({ prefix: "![", suffix: "](image-url)", placeholder: "alt text" }),
    },
  ];

  return (
    <div className="blog-toolbar" role="toolbar" aria-label="Markdown formatting">
      {buttons.map((btn) => (
        <span key={btn.id} style={{ display: "contents" }}>
          {btn.dividerBefore && <span className="blog-toolbar-divider" aria-hidden />}
          <button
            id={btn.id}
            type="button"
            title={btn.label}
            aria-label={btn.label}
            className="blog-toolbar-btn"
            onMouseDown={(e) => {
              // Prevent textarea from losing focus
              e.preventDefault();
              btn.action();
            }}
          >
            {btn.icon}
          </button>
        </span>
      ))}

      {onInsertProperty && (
        <>
          <span className="blog-toolbar-divider" aria-hidden />
          <button
            id="toolbar-property"
            type="button"
            title="Insert property card"
            aria-label="Insert property card shortcode"
            className="blog-toolbar-btn blog-toolbar-btn-wide"
            onMouseDown={(e) => {
              e.preventDefault();
              onInsertProperty();
            }}
          >
            📍 Property
          </button>
        </>
      )}
    </div>
  );
}
