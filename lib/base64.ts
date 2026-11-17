export function encodeBase64(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(
      ...Array.from(bytes.subarray(index, index + chunkSize)),
    );
  }

  let encoded = btoa(binary);

  if (urlSafe) {
    encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return encoded;
}

export function decodeBase64(text: string): string {
  let normalized = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  const remainder = normalized.length % 4;
  if (remainder === 1) {
    throw new Error("Invalid Base64 length.");
  }
  if (remainder > 0) {
    normalized += "=".repeat(4 - remainder);
  }

  let binary: string;

  try {
    binary = atob(normalized);
  } catch {
    throw new Error("Invalid Base64 input.");
  }

  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
