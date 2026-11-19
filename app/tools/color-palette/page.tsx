import type { Metadata } from "next";
import { ToolPageHeader } from "@/components/tool-page-header";
import { tools } from "@/lib/tools";
import { ColorPaletteClient } from "./color-palette-client";

const tool = tools.find((item) => item.slug === "color-palette")!;

export const metadata: Metadata = {
  title: "Color Palette & Contrast Checker",
  description:
    "Build harmonious color palettes and check WCAG AA/AAA contrast ratios for text and UI colors — all in your browser.",
};

export default function ColorPalettePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolPageHeader tool={tool} />
      <ColorPaletteClient />
    </div>
  );
}
