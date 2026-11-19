"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BracesIcon,
  CheckIcon,
  CloseIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  FileJsonIcon,
  RefreshIcon,
  SparklesIcon,
  TrashIcon,
} from "@/components/icons";
import {
  formatJson,
  minifyJson,
  validateJson,
  type JsonIndent,
} from "@/lib/json-format";

const STORAGE_KEY = "micro-tools:json-formatter";

const SAMPLE_JSON = `{"project":"micro.tools","version":"1.0.0","tools":[{"slug":"json-formatter","name":"JSON Formatter","tags":["json","format","validate"],"clientSide":true},{"slug":"base64","name":"Base64 Encoder","clientSide":true}],"features":{"offline":true,"tracking":false,"accounts":0}}`;

type StoredState = {
  input: string;
  indent: JsonIndent;
  output: string;
};

function isJsonIndent(value: unknown): value is JsonIndent {
  return value === "2" || value === "4" || value === "tab";
}

function readStoredState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const input =
      typeof parsed.input === "string" ? parsed.input : SAMPLE_JSON;
    const indent = isJsonIndent(parsed.indent) ? parsed.indent : "2";
    const output =
      typeof parsed.output === "string" ? parsed.output : "";

    return {
      input,
      indent,
      output: validateJson(input) ? "" : output,
    };
  } catch {
    return null;
  }
}

export function JsonFormatterClient() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indent, setIndent] = useState<JsonIndent>("2");
  const [output, setOutput] = useState("");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => {
    const stored = readStoredState();
    const timer = setTimeout(() => {
      if (stored) {
        setInput(stored.input);
        setIndent(stored.indent);
        setOutput(stored.output);
      }
      setReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ input, indent, output }),
      );
    } catch {
      // Storage can be unavailable (private mode, quota); silently skip.
    }
  }, [ready, input, indent, output]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const error = useMemo(() => validateJson(input), [input]);
  const hasInput = input.trim().length > 0;
  const status = !hasInput ? "empty" : error ? "invalid" : "valid";
  const inputLines = hasInput ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;

  const statusStyles =
    status === "valid"
      ? "border-brand/30 bg-brand/10 text-brand"
      : status === "invalid"
        ? "border-red-500/30 bg-red-500/10 text-red-500"
        : "border-border bg-muted/50 text-muted-foreground";

  function handleInputChange(value: string) {
    setInput(value);
    setOutput("");
  }

  function runFormat() {
    if (!hasInput) {
      showToast("Paste some JSON first");
      return;
    }

    try {
      setOutput(formatJson(input, indent));
      showToast("JSON formatted");
    } catch {
      setOutput("");
      showToast("Fix the JSON errors first");
    }
  }

  function runMinify() {
    if (!hasInput) {
      showToast("Paste some JSON first");
      return;
    }

    try {
      setOutput(minifyJson(input));
      showToast("JSON minified");
    } catch {
      setOutput("");
      showToast("Fix the JSON errors first");
    }
  }

  function loadSample() {
    setInput(SAMPLE_JSON);
    setOutput("");
    showToast("Sample JSON loaded");
  }

  function clearAll() {
    setInput("");
    setOutput("");
    showToast("Cleared");
  }

  function resetAll() {
    setInput(SAMPLE_JSON);
    setIndent("2");
    setOutput("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; the in-memory reset still applies.
    }
    showToast("Reset to defaults");
  }

  async function copyOutput() {
    if (!output) {
      showToast("Nothing to copy yet");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      showToast("JSON copied");
    } catch {
      showToast("Could not copy — select the output manually");
    }
  }

  function downloadOutput() {
    if (!output) {
      showToast("Nothing to download yet");
      return;
    }

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("JSON downloaded");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Indentation
          </span>
          <select
            value={indent}
            onChange={(event) =>
              setIndent(event.target.value as JsonIndent)
            }
            className="h-9 w-36 rounded-lg border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
          >
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="tab">Tab</option>
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runFormat}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            Format
          </button>
          <button
            type="button"
            onClick={runMinify}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            <CodeIcon className="h-3.5 w-3.5" />
            Minify
          </button>

          <span className="mx-0.5 hidden h-5 w-px bg-border sm:block" />

          <button
            type="button"
            onClick={loadSample}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            <BracesIcon className="h-3.5 w-3.5" />
            Load sample
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/5 p-4"
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-500">
              <CloseIcon className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-500">Invalid JSON</p>
              <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-red-500/90">
                {error.message}
              </p>
              {error.line !== null && error.column !== null ? (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-red-500/70">
                  Line {error.line}, column {error.column}
                </p>
              ) : null}
              {error.snippet ? (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-red-500/20 bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-red-500/90">
                  {error.snippet}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between gap-3 border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              json input
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] ${statusStyles}`}
              >
                {status === "valid" ? (
                  <CheckIcon className="h-3 w-3" />
                ) : status === "invalid" ? (
                  <CloseIcon className="h-3 w-3" />
                ) : null}
                {status === "empty"
                  ? "waiting"
                  : status === "valid"
                    ? "valid JSON"
                    : "invalid JSON"}
              </span>
              <span className="hidden font-mono text-[10px] text-muted-foreground/70 sm:inline">
                {inputLines} lines · {input.length.toLocaleString()} chars
              </span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            spellCheck={false}
            aria-label="Raw JSON input"
            placeholder='Paste JSON here, e.g. {"hello":"world"}'
            className="h-[360px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50 sm:h-[420px]"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-11 items-center justify-between gap-3 border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              formatted json
            </span>
            <div className="flex items-center gap-1">
              <span className="mr-1 hidden font-mono text-[10px] text-muted-foreground/70 sm:inline">
                {outputLines} lines · {output.length.toLocaleString()} chars
              </span>
              <button
                type="button"
                onClick={() => void copyOutput()}
                disabled={!output}
                aria-label="Copy JSON output"
                className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CopyIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                type="button"
                onClick={downloadOutput}
                disabled={!output}
                aria-label="Download JSON output"
                className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          {output ? (
            <textarea
              value={output}
              readOnly
              spellCheck={false}
              aria-label="Formatted JSON output"
              className="h-[360px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none sm:h-[420px]"
            />
          ) : (
            <div className="grid h-[360px] place-items-center p-6 text-center sm:h-[420px]">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                  <FileJsonIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium">
                  {error ? "Fix the JSON to continue" : "No output yet"}
                </p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                  {error
                    ? "Resolve the validation error above, then format or minify again."
                    : "Paste JSON on the left, then choose Format or Minify."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        Parsed with JSON.parse · nothing is uploaded · your last input and
        output are saved locally.
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
