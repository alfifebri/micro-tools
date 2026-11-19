"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BoldIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  HeadingIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  QuoteIcon,
  RefreshIcon,
  TrashIcon,
} from "@/components/icons";

const STORAGE_KEY = "micro-tools:markdown-previewer";

const SAMPLE_MARKDOWN = `# Markdown Live Preview

A clean playground for writing **Markdown** and seeing it render *instantly* — all in your browser.

## Quick checklist

- [x] Edit on the left
- [ ] Watch the preview update
- [ ] Copy, download, or reset

## Text formatting

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`, and [links](https://example.com).

> Everything runs locally. Your notes never leave this device.

## Code block

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Feature | Status |
| --- | --- |
| Live preview | Ready |
| GFM tables | Ready |
| Local storage | Ready |

## Ordered list

1. Write something
2. Preview it
3. Export the result

---

Made with **micro.tools**.`;

function InsertButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function MarkdownPreviewerClient() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable; fall back to the sample document.
    }

    const timer = setTimeout(() => {
      if (stored !== null) setMarkdown(stored);
      setReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, markdown);
    } catch {
      // Storage can be unavailable (private mode, quota); silently skip.
    }
  }, [ready, markdown]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const words = markdown.trim()
    ? markdown.trim().split(/\s+/).length
    : 0;

  function focusSelection(start: number, end: number) {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  }

  function insertInline(
    before: string,
    after: string,
    placeholder: string,
  ) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end) || placeholder;
    const next =
      markdown.slice(0, start) +
      before +
      selected +
      after +
      markdown.slice(end);

    setMarkdown(next);
    focusSelection(start + before.length, start + before.length + selected.length);
  }

  function insertLinePrefix(prefix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = markdown.lastIndexOf("\n", start - 1) + 1;
    const selected = markdown.slice(lineStart, end) || placeholder;
    const next =
      markdown.slice(0, lineStart) + prefix + markdown.slice(lineStart);

    setMarkdown(next);
    focusSelection(
      lineStart + prefix.length,
      lineStart + prefix.length + selected.length,
    );
  }

  const copyText = useCallback(
    async (value: string, label: string) => {
      if (!value.trim()) {
        showToast("Nothing to copy yet");
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        showToast(label);
      } catch {
        showToast("Could not copy — select the text manually");
      }
    },
    [showToast],
  );

  function copyHtml() {
    const html = previewRef.current?.innerHTML ?? "";
    if (!markdown.trim()) {
      showToast("Nothing to copy yet");
      return;
    }
    void copyText(html, "HTML copied");
  }

  function downloadMarkdown() {
    if (!markdown.trim()) {
      showToast("Nothing to download yet");
      return;
    }

    const blob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "markdown-preview.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Markdown downloaded");
  }

  function clearAll() {
    setMarkdown("");
    showToast("Editor cleared");
  }

  function resetSample() {
    setMarkdown(SAMPLE_MARKDOWN);
    showToast("Sample restored");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <span className="px-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Insert
          </span>
          <InsertButton
            label="Heading"
            onClick={() => insertLinePrefix("## ", "Heading")}
          >
            <HeadingIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Bold"
            onClick={() => insertInline("**", "**", "bold text")}
          >
            <BoldIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Italic"
            onClick={() => insertInline("*", "*", "italic text")}
          >
            <ItalicIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Inline code"
            onClick={() => insertInline("`", "`", "code")}
          >
            <CodeIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Link"
            onClick={() =>
              insertInline("[", "](https://example.com)", "link text")
            }
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Bullet list"
            onClick={() => insertLinePrefix("- ", "List item")}
          >
            <ListIcon className="h-3.5 w-3.5" />
          </InsertButton>
          <InsertButton
            label="Blockquote"
            onClick={() => insertLinePrefix("> ", "Quoted text")}
          >
            <QuoteIcon className="h-3.5 w-3.5" />
          </InsertButton>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ActionButton
            label="Copy MD"
            onClick={() => void copyText(markdown, "Markdown copied")}
          >
            <CopyIcon className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton label="Copy HTML" onClick={copyHtml}>
            <CodeIcon className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton label="Download .md" onClick={downloadMarkdown}>
            <DownloadIcon className="h-3.5 w-3.5" />
          </ActionButton>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            type="button"
            onClick={resetSample}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              markdown
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {words} {words === 1 ? "word" : "words"} ·{" "}
              {markdown.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            spellCheck={false}
            aria-label="Markdown editor"
            placeholder="# Start writing Markdown…"
            className="h-[420px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50 sm:h-[520px]"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              preview
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70">
              <CheckIcon className="h-3 w-3 text-brand" />
              html skipped · safe
            </span>
          </div>
          <div
            ref={previewRef}
            className="markdown-preview h-[420px] overflow-auto p-5 sm:h-[520px]"
          >
            {markdown.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
              >
                {markdown}
              </ReactMarkdown>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="text-sm font-medium">Nothing to preview yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start typing Markdown or restore the sample document.
                  </p>
                  <button
                    type="button"
                    onClick={resetSample}
                    className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    <RefreshIcon className="h-3.5 w-3.5" />
                    Load sample
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        GFM tables, task lists, and strikethrough supported · raw HTML is
        skipped for safety · your draft is saved locally.
      </p>

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium shadow-lg"
        >
          <span className="flex items-center gap-2">
            <CheckIcon className="h-3.5 w-3.5 text-brand" />
            {toast}
          </span>
        </div>
      ) : null}
    </div>
  );
}
