"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  QrCodeIcon,
  TrashIcon,
} from "@/components/icons";

type ErrorLevel = "L" | "M" | "Q" | "H";

type QrSettings = {
  text: string;
  size: number;
  fg: string;
  bg: string;
  level: ErrorLevel;
};

const STORAGE_KEY = "micro-tools:qr-code-generator";
const DEFAULTS: QrSettings = {
  text: "",
  size: 320,
  fg: "#09090b",
  bg: "#ffffff",
  level: "M",
};
const SIZE_OPTIONS = [200, 256, 320, 400, 512, 1024] as const;
const LEVELS: ErrorLevel[] = ["L", "M", "Q", "H"];
const LEVEL_HINTS: Record<ErrorLevel, string> = {
  L: "7% recovery — smallest code",
  M: "15% recovery — balanced",
  Q: "25% recovery — sturdier",
  H: "30% recovery — most durable",
};

function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function readStoredSettings(): QrSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<QrSettings>;
    const level =
      typeof parsed.level === "string" &&
      LEVELS.includes(parsed.level as ErrorLevel)
        ? (parsed.level as ErrorLevel)
        : DEFAULTS.level;

    return {
      text: typeof parsed.text === "string" ? parsed.text : DEFAULTS.text,
      size:
        typeof parsed.size === "number" &&
        (SIZE_OPTIONS as readonly number[]).includes(parsed.size)
          ? parsed.size
          : DEFAULTS.size,
      fg: isHex(parsed.fg) ? parsed.fg : DEFAULTS.fg,
      bg: isHex(parsed.bg) ? parsed.bg : DEFAULTS.bg,
      level,
    };
  } catch {
    return null;
  }
}

export function QrCodeGeneratorClient() {
  const [settings, setSettings] = useState<QrSettings>(DEFAULTS);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => {
    const stored = readStoredSettings();
    const timer = setTimeout(() => {
      if (stored) setSettings(stored);
      setReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage can be unavailable (private mode, quota); silently skip.
    }
  }, [ready, settings]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!settings.text.trim()) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsGenerating(true);
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(settings.text, {
          width: settings.size,
          margin: 2,
          errorCorrectionLevel: settings.level,
          color: { dark: settings.fg, light: settings.bg },
        });

        if (!cancelled) {
          setDataUrl(url);
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setDataUrl("");
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not generate a QR code for this input.",
          );
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [settings]);

  function update<K extends keyof QrSettings>(key: K, value: QrSettings[K]) {
    if (key === "text" && typeof value === "string" && !value.trim()) {
      setDataUrl("");
      setError(null);
      setIsGenerating(false);
    }
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function downloadPng() {
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("PNG downloaded");
  }

  async function copyImage() {
    if (!dataUrl) return;

    try {
      const blob = await (await fetch(dataUrl)).blob();

      if (
        !navigator.clipboard?.write ||
        typeof ClipboardItem === "undefined"
      ) {
        throw new Error("Clipboard image writing is unavailable.");
      }

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      showToast("Image copied to clipboard");
    } catch {
      downloadPng();
      showToast("Clipboard unavailable — downloaded PNG instead");
    }
  }

  function resetAll() {
    setSettings(DEFAULTS);
    setDataUrl("");
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; the in-memory reset still applies.
    }
    showToast("Cleared and reset to defaults");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
              <span className="font-mono text-xs text-muted-foreground">
                text or url
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {settings.text.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={settings.text}
              onChange={(event) => update("text", event.target.value)}
              spellCheck={false}
              aria-label="Text or URL to encode"
              placeholder="https://example.com or any text you want to share…"
              className="h-[190px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  QR size
                </span>
                <select
                  value={settings.size}
                  onChange={(event) =>
                    update("size", Number(event.target.value))
                  }
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
                >
                  {SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} × {size} px
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Error correction
                </span>
                <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => update("level", level)}
                      aria-pressed={settings.level === level}
                      className={`flex-1 rounded-md px-2 py-1.5 font-mono text-xs font-medium transition-colors ${
                        settings.level === level
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Foreground
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase text-muted-foreground">
                    {settings.fg}
                  </span>
                  <input
                    type="color"
                    value={settings.fg}
                    onChange={(event) => update("fg", event.target.value)}
                    aria-label="Foreground color"
                    className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                </span>
              </label>

              <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Background
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase text-muted-foreground">
                    {settings.bg}
                  </span>
                  <input
                    type="color"
                    value={settings.bg}
                    onChange={(event) => update("bg", event.target.value)}
                    aria-label="Background color"
                    className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                </span>
              </label>
            </div>

            <p className="mt-3 font-mono text-[11px] text-muted-foreground/80">
              {LEVEL_HINTS[settings.level]}
            </p>
          </div>
        </div>

        <div className="self-start overflow-hidden rounded-xl border border-border bg-card lg:sticky lg:top-24">
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
            <span className="font-mono text-xs text-muted-foreground">
              preview
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">
              {settings.size} × {settings.size} px
            </span>
          </div>

          <div className="grid min-h-[260px] place-items-center p-5">
            {dataUrl ? (
              <Image
                src={dataUrl}
                alt="Generated QR code"
                width={settings.size}
                height={settings.size}
                unoptimized
                className="h-auto w-full max-w-[260px] rounded-lg border border-border"
              />
            ) : (
              <div className="px-4 py-10 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
                  <QrCodeIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium">
                  {isGenerating ? "Generating…" : "Nothing to encode yet"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Type text or paste a URL to generate a QR code instantly.
                </p>
              </div>
            )}
          </div>

          {error ? (
            <p
              role="alert"
              className="border-t border-border bg-red-500/5 px-4 py-2.5 font-mono text-[11px] text-red-500"
            >
              {error}
            </p>
          ) : null}

          <div className="space-y-2 border-t border-border bg-muted/20 p-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadPng}
                disabled={!dataUrl}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                Download PNG
              </button>
              <button
                type="button"
                onClick={copyImage}
                disabled={!dataUrl}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CopyIcon className="h-3.5 w-3.5" />
                Copy image
              </button>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Clear & reset
            </button>
          </div>
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        Generated locally with the qrcode library · settings saved to your
        browser · nothing is uploaded.
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
