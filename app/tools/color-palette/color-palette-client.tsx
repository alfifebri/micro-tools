"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  CloseIcon,
  LockIcon,
  PaletteIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
  UnlockIcon,
} from "@/components/icons";
import {
  contrastRatio,
  formatHsl,
  formatRgb,
  generatePalette,
  hexToRgb,
  normalizeHex,
  randomHex,
  rgbToHsl,
  type PaletteMode,
} from "@/lib/color";

const DEFAULT_FG = "#0F172A";
const DEFAULT_BG = "#F8FAFC";
const DEFAULT_PALETTE = [
  "#0F172A",
  "#1D4ED8",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
];
const DEFAULT_MODE: PaletteMode = "harmony";
const STORAGE_KEY = "micro-tools:color-palette";
const MIN_COLORS = 2;
const MAX_COLORS = 8;

const PALETTE_MODES: { value: PaletteMode; label: string }[] = [
  { value: "harmony", label: "Harmonious" },
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "monochrome", label: "Shades & tints" },
];

type StoredSettings = {
  fg: string;
  bg: string;
  palette: string[];
  locked: boolean[];
  mode: PaletteMode;
};

type ColorFieldProps = {
  label: string;
  value: string;
  draft: string;
  onDraftChange: (value: string) => void;
  onCommit: () => void;
  onColorChange: (value: string) => void;
};

function ColorField({
  label,
  value,
  draft,
  onDraftChange,
  onCommit,
  onColorChange,
}: ColorFieldProps) {
  const { r, g, b } = hexToRgb(value);
  const { h, s, l } = rgbToHsl({ r, g, b });

  return (
    <div className="space-y-2 rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <input
          type="color"
          value={value}
          onChange={(event) => onColorChange(event.target.value)}
          aria-label={`${label} color picker`}
          className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
        />
      </div>

      <input
        type="text"
        value={draft}
        onChange={(event) => {
          const cleaned = event.target.value
            .toUpperCase()
            .replace(/[^#0-9A-F]/g, "")
            .slice(0, 7);
          onDraftChange(cleaned);
        }}
        onBlur={onCommit}
        spellCheck={false}
        aria-label={`${label} HEX value`}
        placeholder="#000000"
        className="h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
      />

      <dl className="grid gap-1 font-mono text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between gap-2">
          <dt>RGB</dt>
          <dd className="truncate">
            {r}, {g}, {b}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt>HSL</dt>
          <dd className="truncate">
            {h}°, {s}%, {l}%
          </dd>
        </div>
      </dl>
    </div>
  );
}

function readStoredSettings(): StoredSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const fg =
      normalizeHex(typeof parsed.fg === "string" ? parsed.fg : "") ??
      DEFAULT_FG;
    const bg =
      normalizeHex(typeof parsed.bg === "string" ? parsed.bg : "") ??
      DEFAULT_BG;

    const rawPalette = Array.isArray(parsed.palette) ? parsed.palette : [];
    const palette = rawPalette
      .map((item) => (typeof item === "string" ? normalizeHex(item) : null))
      .filter((item): item is string => item !== null)
      .slice(0, MAX_COLORS);
    const finalPalette =
      palette.length >= MIN_COLORS ? palette : [...DEFAULT_PALETTE];

    const rawLocked = Array.isArray(parsed.locked) ? parsed.locked : [];
    const locked = finalPalette.map((_, index) => Boolean(rawLocked[index]));

    const rawMode = parsed.mode;
    const mode = PALETTE_MODES.some((item) => item.value === rawMode)
      ? (rawMode as PaletteMode)
      : DEFAULT_MODE;

    return { fg, bg, palette: finalPalette, locked, mode };
  } catch {
    return null;
  }
}

export function ColorPaletteClient() {
  const [fg, setFg] = useState(DEFAULT_FG);
  const [bg, setBg] = useState(DEFAULT_BG);
  const [fgDraft, setFgDraft] = useState(DEFAULT_FG);
  const [bgDraft, setBgDraft] = useState(DEFAULT_BG);
  const [palette, setPalette] = useState<string[]>(DEFAULT_PALETTE);
  const [locked, setLocked] = useState<boolean[]>(() =>
    DEFAULT_PALETTE.map(() => false),
  );
  const [mode, setMode] = useState<PaletteMode>(DEFAULT_MODE);
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
      if (stored) {
        setFg(stored.fg);
        setBg(stored.bg);
        setFgDraft(stored.fg);
        setBgDraft(stored.bg);
        setPalette(stored.palette);
        setLocked(stored.locked);
        setMode(stored.mode);
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
        JSON.stringify({ fg, bg, palette, locked, mode }),
      );
    } catch {
      // Storage can be unavailable (private mode, quota); silently skip.
    }
  }, [ready, fg, bg, palette, locked, mode]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const ratio = contrastRatio(fg, bg);
  const checks = [
    {
      label: "Normal text",
      level: "AA",
      threshold: "≥ 4.5:1",
      pass: ratio >= 4.5,
    },
    {
      label: "Normal text",
      level: "AAA",
      threshold: "≥ 7:1",
      pass: ratio >= 7,
    },
    {
      label: "Large text",
      level: "AA",
      threshold: "≥ 3:1",
      pass: ratio >= 3,
    },
    {
      label: "Large text",
      level: "AAA",
      threshold: "≥ 4.5:1",
      pass: ratio >= 4.5,
    },
  ];
  const passesAA = ratio >= 4.5;

  function setColor(which: "fg" | "bg", value: string) {
    const next = normalizeHex(value);
    if (!next) return;

    if (which === "fg") {
      setFg(next);
      setFgDraft(next);
    } else {
      setBg(next);
      setBgDraft(next);
    }
  }

  function commitDraft(which: "fg" | "bg") {
    const draft = which === "fg" ? fgDraft : bgDraft;
    const next = normalizeHex(draft) ?? (which === "fg" ? fg : bg);

    if (which === "fg") {
      setFg(next);
      setFgDraft(next);
    } else {
      setBg(next);
      setBgDraft(next);
    }
  }

  function swapColors() {
    setFg(bg);
    setFgDraft(bg);
    setBg(fg);
    setBgDraft(fg);
    showToast("Foreground and background swapped");
  }

  function toggleLock(index: number) {
    setLocked((prev) =>
      prev.map((value, itemIndex) =>
        itemIndex === index ? !value : value,
      ),
    );
  }

  function regeneratePalette() {
    if (!locked.some((value) => !value)) {
      showToast("Unlock at least one color to regenerate");
      return;
    }

    const seed =
      palette.find((_, index) => locked[index]) ?? randomHex();
    const generated = generatePalette(mode, palette.length, seed);

    setPalette((prev) =>
      prev.map((color, index) =>
        locked[index] ? color : (generated[index] ?? color),
      ),
    );
    showToast("Palette regenerated");
  }

  function addColor() {
    if (palette.length >= MAX_COLORS) {
      showToast(`Palette is limited to ${MAX_COLORS} colors`);
      return;
    }

    const seed = palette[palette.length - 1] ?? randomHex();
    const next = generatePalette("harmony", 2, seed)[1] ?? randomHex();

    setPalette((prev) => [...prev, next]);
    setLocked((prev) => [...prev, false]);
    showToast("Color added");
  }

  function removeColor(index: number) {
    if (palette.length <= MIN_COLORS) {
      showToast(`Keep at least ${MIN_COLORS} colors`);
      return;
    }

    setPalette((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setLocked((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    showToast("Color removed");
  }

  const copyToClipboard = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast(`${label} copied`);
      } catch {
        showToast("Could not copy — select the value manually");
      }
    },
    [showToast],
  );

  function resetAll() {
    setFg(DEFAULT_FG);
    setBg(DEFAULT_BG);
    setFgDraft(DEFAULT_FG);
    setBgDraft(DEFAULT_BG);
    setPalette(DEFAULT_PALETTE);
    setLocked(DEFAULT_PALETTE.map(() => false));
    setMode(DEFAULT_MODE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures; the in-memory reset still applies.
    }
    showToast("Reset to defaults");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Contrast checker</h2>
            <button
              type="button"
              onClick={swapColors}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Swap
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ColorField
              label="Text foreground"
              value={fg}
              draft={fgDraft}
              onDraftChange={setFgDraft}
              onCommit={() => commitDraft("fg")}
              onColorChange={(value) => setColor("fg", value)}
            />
            <ColorField
              label="Background"
              value={bg}
              draft={bgDraft}
              onDraftChange={setBgDraft}
              onCommit={() => commitDraft("bg")}
              onColorChange={(value) => setColor("bg", value)}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[11px] text-muted-foreground">
              {formatRgb(fg)} on {formatRgb(bg)}
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Contrast ratio
              </p>
              <p className="mt-0.5 font-mono text-3xl font-semibold tracking-tight">
                {ratio.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">
                  :1
                </span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                passesAA
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-red-500/30 bg-red-500/10 text-red-500"
              }`}
            >
              {passesAA ? (
                <CheckIcon className="h-3 w-3" />
              ) : (
                <CloseIcon className="h-3 w-3" />
              )}
              Normal AA {passesAA ? "pass" : "fail"}
            </span>
          </div>

          <div className="space-y-3 p-4">
            <div
              style={{ backgroundColor: bg, color: fg }}
              className="rounded-lg border border-border p-4"
            >
              <p className="text-2xl font-semibold tracking-tight">
                Large heading preview
              </p>
              <p className="mt-2 text-sm leading-relaxed">
                Normal body text at 14px. Check how readable your copy feels
                before shipping it.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  style={{ backgroundColor: fg, color: bg }}
                  className="rounded-md px-3 py-1.5 text-xs font-medium"
                >
                  Primary button
                </span>
                <span
                  style={{ borderColor: fg, color: fg }}
                  className="rounded-md border px-3 py-1.5 text-xs font-medium"
                >
                  Secondary
                </span>
                <span
                  style={{ color: fg }}
                  className="font-mono text-[11px] underline underline-offset-2"
                >
                  Link text
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {checks.map((check) => (
                <div
                  key={`${check.label}-${check.level}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium">
                      {check.label} · {check.level}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {check.threshold}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium ${
                      check.pass
                        ? "bg-brand/10 text-brand"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {check.pass ? (
                      <CheckIcon className="h-3 w-3" />
                    ) : (
                      <CloseIcon className="h-3 w-3" />
                    )}
                    {check.pass ? "Pass" : "Fail"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-medium">Palette builder</h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              {palette.length} colors
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={mode}
              onChange={(event) =>
                setMode(event.target.value as PaletteMode)
              }
              aria-label="Palette generation mode"
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
            >
              {PALETTE_MODES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={regeneratePalette}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              Generate
            </button>
            <button
              type="button"
              onClick={addColor}
              disabled={palette.length >= MAX_COLORS}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {palette.map((color, index) => (
            <div
              key={`${color}-${index}`}
              className="overflow-hidden rounded-xl border border-border bg-background"
            >
              <button
                type="button"
                onClick={() => copyToClipboard(color, "HEX")}
                aria-label={`Copy ${color}`}
                className="group relative block h-24 w-full"
                style={{ backgroundColor: color }}
              >
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">
                  <span className="rounded-md bg-black/65 px-2 py-1 font-mono text-[10px] font-medium text-white">
                    Copy {color}
                  </span>
                </span>
              </button>

              <div className="space-y-2 p-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-xs font-medium">
                    {color}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleLock(index)}
                    aria-label={
                      locked[index]
                        ? `Unlock ${color}`
                        : `Lock ${color}`
                    }
                    aria-pressed={locked[index]}
                    className={`rounded-md p-1 transition-colors ${
                      locked[index]
                        ? "bg-brand/10 text-brand"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {locked[index] ? (
                      <LockIcon className="h-3.5 w-3.5" />
                    ) : (
                      <UnlockIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(color, "HEX")}
                    className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    HEX
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(formatRgb(color), "RGB")
                    }
                    className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    RGB
                  </button>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    disabled={palette.length <= MIN_COLORS}
                    aria-label={`Remove ${color}`}
                    className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <CloseIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="border-t border-border px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
          Lock a swatch to keep it during regeneration · click a swatch to copy
          HEX · palette saved locally
        </p>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        Contrast uses the WCAG 2.1 relative luminance formula · {formatHsl(fg)}{" "}
        on {formatHsl(bg)} · nothing is uploaded.
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
