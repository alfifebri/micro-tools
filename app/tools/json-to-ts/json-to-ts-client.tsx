"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { jsonToTypeScript } from "@/lib/json-to-ts";

const sampleJson = `{
  "id": 101,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "developer"],
  "profile": {
    "email": "ada@example.com",
    "website": null,
    "social": {
      "github": "adalovelace"
    }
  },
  "projects": [
    {
      "title": "Analytical Engine",
      "stars": 42,
      "tags": ["math", "history"]
    }
  ]
}`;

export function JsonToTsClient() {
  const [input, setInput] = useState(sampleJson);
  const [rootName, setRootName] = useState("Root");

  const result = useMemo(
    () => jsonToTypeScript(input, rootName),
    [input, rootName],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Root type name
          </span>
          <input
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            spellCheck={false}
            className="h-9 w-44 rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInput(sampleJson)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              input.json
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {input.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            placeholder='{ "hello": "world" }'
            aria-label="JSON input"
            className="h-[420px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              types.ts
            </span>
            <CopyButton value={result.code} label="Copy types" />
          </div>
          <pre className="h-[420px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
            {result.code ? (
              <code>{result.code}</code>
            ) : (
              <span className="text-muted-foreground/60">
                Paste JSON on the left to generate TypeScript types.
              </span>
            )}
          </pre>
        </div>
      </div>

      {result.error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-600 dark:text-red-400"
        >
          {result.error}
        </p>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground">
          {result.code
            ? "Types inferred locally. Nested objects are inlined; arrays are detected automatically."
            : "Waiting for input…"}
        </p>
      )}
    </div>
  );
}
