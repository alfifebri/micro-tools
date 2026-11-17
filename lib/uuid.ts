function fallbackUuid(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUuids(
  count: number,
  uppercase: boolean,
  hyphens: boolean,
): string[] {
  const amount = Math.min(50, Math.max(1, Math.floor(count) || 1));

  return Array.from({ length: amount }, () => {
    let id =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : fallbackUuid();

    if (!hyphens) id = id.replace(/-/g, "");
    if (uppercase) id = id.toUpperCase();

    return id;
  });
}
