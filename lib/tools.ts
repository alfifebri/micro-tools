export type ToolIconName = "braces" | "binary" | "key" | "hash";

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
];
