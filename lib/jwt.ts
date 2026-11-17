export type JwtDecoded = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
};

export type JwtResult = {
  decoded: JwtDecoded | null;
  error: string | null;
};

function decodeSegment(segment: string): string {
  let normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;

  if (remainder === 1) {
    throw new Error("Malformed Base64URL segment.");
  }

  if (remainder > 0) {
    normalized += "=".repeat(4 - remainder);
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseObject(segment: string, label: string): Record<string, unknown> {
  let value: unknown;

  try {
    value = JSON.parse(decodeSegment(segment));
  } catch {
    throw new Error(`The JWT ${label} is not valid JSON.`);
  }

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`The JWT ${label} must be a JSON object.`);
  }

  return value as Record<string, unknown>;
}

export function decodeJwt(rawToken: string): JwtResult {
  const token = rawToken.trim().replace(/^Bearer\s+/i, "");

  if (!token) {
    return { decoded: null, error: null };
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return {
      decoded: null,
      error: `Expected 3 segments separated by dots, received ${parts.length}.`,
    };
  }

  try {
    return {
      decoded: {
        header: parseObject(parts[0], "header"),
        payload: parseObject(parts[1], "payload"),
        signature: parts[2],
      },
      error: null,
    };
  } catch (error) {
    return {
      decoded: null,
      error: error instanceof Error ? error.message : "Unable to decode JWT.",
    };
  }
}
