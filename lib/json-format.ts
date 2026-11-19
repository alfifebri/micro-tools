export type JsonIndent = "2" | "4" | "tab";

export const JSON_INDENTS: Record<JsonIndent, string> = {
  "2": "  ",
  "4": "    ",
  tab: "\t",
};

export type JsonErrorDetails = {
  message: string;
  position: number | null;
  line: number | null;
  column: number | null;
  snippet: string | null;
};

function buildSnippet(
  input: string,
  line: number,
  column: number,
): string | null {
  const lines = input.split(/\r?\n/);
  const text = lines[line - 1];

  if (text === undefined) return null;

  const caret = Math.max(0, Math.min(column - 1, text.length));
  const start = Math.max(0, caret - 60);
  const cropped = text.slice(start, start + 140);

  return `${cropped}\n${" ".repeat(caret - start)}^`;
}

export function describeJsonError(
  input: string,
  cause: unknown,
): JsonErrorDetails {
  const message =
    cause instanceof Error ? cause.message : "Invalid JSON.";

  const positionMatch = message.match(/position\s+(\d+)/i);
  const lineMatch = message.match(/line\s+(\d+)/i);
  const columnMatch = message.match(/column\s+(\d+)/i);

  let position = positionMatch ? Number(positionMatch[1]) : null;
  let line = lineMatch ? Number(lineMatch[1]) : null;
  let column = columnMatch ? Number(columnMatch[1]) : null;

  if (position !== null && (line === null || column === null)) {
    const before = input.slice(0, Math.max(0, position));
    const parts = before.split(/\r?\n/);
    line = parts.length;
    column = parts[parts.length - 1].length + 1;
  }

  if (position === null && line !== null && column !== null) {
    const lines = input.split(/\r?\n/);
    position = 0;
    for (let index = 0; index < line - 1 && index < lines.length; index++) {
      position += lines[index].length + 1;
    }
    position += Math.max(0, column - 1);
  }

  return {
    message,
    position,
    line,
    column,
    snippet: line !== null ? buildSnippet(input, line, column ?? 1) : null,
  };
}

export function validateJson(input: string): JsonErrorDetails | null {
  if (!input.trim()) return null;

  try {
    JSON.parse(input);
    return null;
  } catch (cause) {
    return describeJsonError(input, cause);
  }
}

export function formatJson(input: string, indent: JsonIndent): string {
  const parsed = JSON.parse(input) as unknown;
  return JSON.stringify(parsed, null, JSON_INDENTS[indent]) ?? "";
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input) as unknown;
  return JSON.stringify(parsed) ?? "";
}
