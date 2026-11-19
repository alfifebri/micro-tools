export type ToolIconName =
  | "braces"
  | "binary"
  | "key"
  | "hash"
  | "qr"
  | "palette"
  | "markdown";

export type Tool = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  href: string;
  icon: ToolIconName;
};

export const tools: Tool[] = [
  {
    slug: "json-to-ts",
    name: "JSON to TypeScript",
    shortName: "json-to-ts",
    description:
      "Paste any JSON payload and get clean, ready-to-use TypeScript types instantly.",
    category: "Conversion",
    href: "/tools/json-to-ts",
    icon: "braces",
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    shortName: "base64",
    description:
      "Encode and decode Base64 with full Unicode support and optional URL-safe output.",
    category: "Encoding",
    href: "/tools/base64",
    icon: "binary",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortName: "jwt-decoder",
    description:
      "Inspect JWT headers, payloads, and claims. Everything stays in your browser.",
    category: "Security",
    href: "/tools/jwt-decoder",
    icon: "key",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortName: "uuid-generator",
    description:
      "Generate cryptographically random v4 UUIDs in bulk, with formatting options.",
    category: "Generators",
    href: "/tools/uuid-generator",
    icon: "hash",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortName: "qr-code-generator",
    description:
      "Turn any text or URL into a customized QR code. Download PNG or copy it, all locally.",
    category: "Generators",
    href: "/tools/qr-code-generator",
    icon: "qr",
  },
  {
    slug: "color-palette",
    name: "Color Palette & Contrast Checker",
    shortName: "color-palette",
    description:
      "Build harmonious color palettes and verify WCAG contrast for text and UI colors.",
    category: "Design",
    href: "/tools/color-palette",
    icon: "palette",
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Live Previewer",
    shortName: "markdown-previewer",
    description:
      "Write Markdown and see a clean, safe live preview. Copy the source or HTML and export as .md.",
    category: "Text",
    href: "/tools/markdown-previewer",
    icon: "markdown",
  },
];
