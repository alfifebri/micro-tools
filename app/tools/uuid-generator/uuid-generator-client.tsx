"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { RefreshIcon, TrashIcon } from "@/components/icons";
import { generateUuids } from "@/lib/uuid";

export function UuidGeneratorClient() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  function generate() {
    setUuids(generateUuids(count, uppercase, hyphens));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              How many?
            </span>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(event) => {
                const next = Number(event.target.value);
                setCount(Number.isFinite(next) ? next : 1);
              }}
              className="h-9 w-24 rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
            />
          </label>

          <label className="flex h-9 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(event) => setUppercase(event.target.checked)}
              className="h-3.5 w-3.5 accent-brand"
            />
            Uppercase
          </label>

          <label className="flex h-9 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(event) => setHyphens(event.target.checked)}
              className="h-3.5 w-3.5 accent-brand"
            />
            Hyphens
          </label>
        </div>

        <button
          type="button"
          onClick={generate}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
          Generate
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
          <span className="font-mono text-xs text-muted-foreground">
            uuid v4 · {uuids.length} {uuids.length === 1 ? "value" : "values"}
          </span>
          <div className="flex items-center gap-1">
            <CopyButton
              value={uuids.join("\n")}
              label="Copy all"
              disabled={uuids.length === 0}
            />
            <button
              type="button"
              onClick={() => setUuids([])}
              aria-label="Clear UUIDs"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {uuids.length > 0 ? (
          <ul className="max-h-[420px] divide-y divide-border overflow-auto">
            {uuids.map((uuid, index) => (
              <li
                key={uuid}
                className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/30"
              >
                <span className="w-6 shrink-0 font-mono text-[10px] text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <code className="flex-1 break-all font-mono text-[13px]">
                  {uuid}
                </code>
                <CopyButton value={uuid} label="Copy" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium">No UUIDs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose your options and hit generate.
            </p>
          </div>
        )}
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        Generated with crypto.randomUUID() — cryptographically secure and
        created locally.
      </p>
    </div>
  );
}
