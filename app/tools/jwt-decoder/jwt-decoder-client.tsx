"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { ShieldIcon, TrashIcon } from "@/components/icons";
import { decodeJwt } from "@/lib/jwt";

const sampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoderClient() {
  const [token, setToken] = useState("");

  const result = useMemo(() => decodeJwt(token), [token]);
  const decoded = result.decoded;

  const expiry = useMemo(() => {
    const exp = decoded?.payload.exp;
    if (typeof exp !== "number" || !Number.isFinite(exp)) return null;
    return {
      date: new Date(exp * 1000)
        .toISOString()
        .replace(".000Z", " UTC"),
    };
  }, [decoded]);

  const algorithm =
    typeof decoded?.header.alg === "string" ? decoded.header.alg : null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
          <span className="font-mono text-xs text-muted-foreground">
            encoded token
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setToken(sampleToken)}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setToken("")}
              aria-label="Clear token"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <textarea
          value={token}
          onChange={(event) => setToken(event.target.value)}
          spellCheck={false}
          aria-label="JWT token"
          placeholder="Paste a JWT (header.payload.signature)…"
          className="h-32 w-full resize-y bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {result.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-600 dark:text-red-400"
        >
          {result.error}
        </p>
      )}

      {decoded ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-[11px] font-medium text-brand">
              alg: {algorithm ?? "unknown"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              <ShieldIcon className="h-3 w-3" />
              signature not verified
            </span>
            {expiry && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                title={`exp: ${expiry.date}`}
              >
                exp · {expiry.date}
              </span>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
                <span className="font-mono text-xs text-muted-foreground">
                  header
                </span>
                <CopyButton
                  value={JSON.stringify(decoded.header, null, 2)}
                  label="Copy"
                />
              </div>
              <pre className="h-[260px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
                <code>{JSON.stringify(decoded.header, null, 2)}</code>
              </pre>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
                <span className="font-mono text-xs text-muted-foreground">
                  payload
                </span>
                <CopyButton
                  value={JSON.stringify(decoded.payload, null, 2)}
                  label="Copy"
                />
              </div>
              <pre className="h-[260px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
                <code>{JSON.stringify(decoded.payload, null, 2)}</code>
              </pre>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex h-11 items-center justify-between border-b border-border bg-muted/40 px-4">
              <span className="font-mono text-xs text-muted-foreground">
                signature
              </span>
              <CopyButton value={decoded.signature} label="Copy" />
            </div>
            <p className="break-all p-4 font-mono text-[13px] text-muted-foreground">
              {decoded.signature || "(empty signature)"}
            </p>
          </div>
        </>
      ) : (
        !result.error && (
          <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm font-medium">No token loaded</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Paste a JWT above to inspect its header and claims, or load the
              sample token. Decoding happens entirely in your browser.
            </p>
          </div>
        )
      )}

      <p className="font-mono text-[11px] text-muted-foreground">
        JWT decoding does not verify signatures. Never paste production secrets
        into untrusted tools.
      </p>
    </div>
  );
}
