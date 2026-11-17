type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ConversionResult = {
  code: string;
  error: string | null;
};

function formatKey(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function renderType(value: JsonValue, indent: number): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "null";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";

    const itemTypes = unique(value.map((item) => renderType(item, indent)));

    if (itemTypes.length === 1) {
      return `${itemTypes[0]}[]`;
    }

    return `(${itemTypes.join(" | ")})[]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) return "Record<string, never>";

    const body = entries
      .map(
        ([key, child]) =>
          `${pad}  ${formatKey(key)}: ${renderType(child, indent + 1)};`,
      )
      .join("\n");

    return `{\n${body}\n${pad}}`;
  }

  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";

  return "unknown";
}

function toTypeName(input: string): string {
  const cleaned = input
    .trim()
    .replace(/[^A-Za-z0-9_$]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  if (!cleaned) return "Root";
  return /^[A-Za-z_$]/.test(cleaned) ? cleaned : `T${cleaned}`;
}

export function jsonToTypeScript(
  input: string,
  rootName = "Root",
): ConversionResult {
  if (!input.trim()) {
    return { code: "", error: null };
  }

  let parsed: JsonValue;

  try {
    parsed = JSON.parse(input) as JsonValue;
  } catch (error) {
    return {
      code: "",
      error:
        error instanceof Error
          ? `Invalid JSON: ${error.message}`
          : "Invalid JSON input.",
    };
  }

  const name = toTypeName(rootName);
  const body = renderType(parsed, 0);

  return {
    code: `export type ${name} = ${body};\n`,
    error: null,
  };
}
