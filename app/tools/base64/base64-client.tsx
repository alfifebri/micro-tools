"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { RefreshIcon, TrashIcon } from "@/components/icons";
import { decodeBase64, encodeBase64 } from "@/lib/base64";

type Mode = "encode" | "decode";

const sampleText = "Hello, developer! 👋";

export function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState(sampleText);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };

    try {
      const output =
        mode === "encode"
          ? encodeBase64(input, urlSafe)
          : decodeBase64(input);

      return { output, error: null as string | null };
    } catch (error) {
      return {
        output: "",
        error:
          error instanceof Error ? error.message : "Something went wrong.",
      };
    }
  }, [input, mode, urlSafe]);

  function swap() {
    if (!result.output) return;
    setInput(result.output);
    setMode(mode === "encode" ? "decode" : "encode");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
          {(["encode", "decode"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                mode === option
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(event) => setUrlSafe(event.target.checked)}
            className="h-3.5 w-3.5 accent-brand"
          />
          URL-safe output
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              {mode === "encode" ? "plain text" : "base64"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {input.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-label={mode === "encode" ? "Text to encode" : "Base64 to decode"}
            placeholder={
              mode === "encode"
                ? "Type or paste text…"
                : "Paste Base64 string…"
            }
            className="h-[300px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              {mode === "encode" ? "base64" : "plain text"}
            </span>
            <CopyButton value={result.output} />
          </div>
          <textarea
            value={result.output}
            readOnly
            aria-label="Result"
            placeholder="Result will appear here…"
            className="h-[300px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swap}
            disabled={!result.output}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            Swap input / output
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        {result.error ? (
          <p role="alert" className="font-mono text-xs text-red-500">
            {result.error}
          </p>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground">
            UTF-8 safe · processed locally
          </p>
        )}
      </div>
    </div>
  );
}
