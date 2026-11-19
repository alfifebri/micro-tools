export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

export type PaletteMode =
  | "harmony"
  | "complementary"
  | "analogous"
  | "monochrome";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitter(amount: number) {
  return (Math.random() * 2 - 1) * amount;
}

export function normalizeHex(input: string): string | null {
  const value = input.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(value)) {
    const expanded = value
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }

  if (/^[0-9a-f]{6}$/i.test(value)) {
    return `#${value.toUpperCase()}`;
  }

  return null;
}

export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex) ?? "#000000";
  const value = normalized.slice(1);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (channel: number) =>
    clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation =
      lightness > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);

    if (max === red) {
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }

    hue *= 60;
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hueToRgb(p: number, q: number, t: number) {
  let value = t;
  if (value < 0) value += 1;
  if (value > 1) value -= 1;
  if (value < 1 / 6) return p + (q - p) * 6 * value;
  if (value < 1 / 2) return q;
  if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  };
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function formatRgb(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatHsl(hex: string): string {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

export function randomHex(): string {
  return rgbToHex({
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  });
}

export function generatePalette(
  mode: PaletteMode,
  count: number,
  seed: string,
): string[] {
  const base = rgbToHsl(hexToRgb(seed));
  const safeCount = clamp(Math.floor(count) || 1, 1, 12);

  return Array.from({ length: safeCount }, (_, index) => {
    let hue = base.h;
    let saturation = base.s;
    let lightness = base.l;

    switch (mode) {
      case "complementary":
        hue = base.h + (index % 2 === 0 ? 0 : 180) + jitter(10);
        saturation = clamp(base.s + jitter(12), 35, 85);
        lightness = clamp(28 + ((index * 13) % 48) + jitter(6), 18, 82);
        break;

      case "analogous":
        hue =
          base.h + (index - (safeCount - 1) / 2) * 24 + jitter(6);
        saturation = clamp(base.s + jitter(10), 35, 85);
        lightness = clamp(38 + index * 6 + jitter(5), 22, 78);
        break;

      case "monochrome":
        hue = base.h;
        saturation = clamp(base.s + jitter(6), 20, 70);
        lightness =
          88 - (index * 70) / Math.max(safeCount - 1, 1) + jitter(3);
        break;

      default:
        hue = base.h + index * 137.508 + jitter(8);
        saturation = clamp(55 + (index % 3) * 10 + jitter(8), 35, 85);
        lightness = clamp(42 + (index % 4) * 8 + jitter(6), 28, 72);
        break;
    }

    return hslToHex({
      h: ((hue % 360) + 360) % 360,
      s: saturation,
      l: lightness,
    });
  });
}
