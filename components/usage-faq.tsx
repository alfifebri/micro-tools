import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { tools, type Tool } from "@/lib/tools";

const steps = [
  {
    title: "Pick a tool",
    description:
      "Browse the toolbox or press Ctrl/Cmd + K to search by name, category, or keyword.",
  },
  {
    title: "Add your input",
    description:
      "Type or paste text, JSON, a URL, or colors. Results update instantly as you work.",
  },
  {
    title: "Take the result",
    description:
      "Copy, download, or fine-tune the options. Every tool has a reset action for a clean slate.",
  },
];

const EXAMPLE_NOTES: Record<string, string> = {
  "json-to-ts":
    "Paste a sample API response to generate ready-to-use TypeScript types.",
  base64: "Encode a token or config value with full Unicode support.",
  "markdown-previewer":
    "Write a README, then copy the HTML or download it as a .md file.",
};

const exampleSlugs = ["json-to-ts", "base64", "markdown-previewer"];
const examples = exampleSlugs
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter((tool): tool is Tool => Boolean(tool));

const faqs = [
  {
    question: "Is my data sent anywhere?",
    answer:
      "No. Every tool runs entirely in your browser. Inputs, colors, and Markdown are processed locally and never uploaded to a server.",
  },
  {
    question: "Do I need an account or a paid plan?",
    answer:
      "No. There is no sign-up, login, or paywall. Open any utility from the toolbox and use it immediately.",
  },
  {
    question: "How do I switch tools quickly?",
    answer:
      "Press Ctrl + K on Windows/Linux or Cmd + K on Mac, then search and use the arrow keys with Enter. You can also browse the full toolbox anytime.",
  },
  {
    question: "Will my work survive a refresh?",
    answer:
      "Tools with settings save your last input in localStorage on this device. QR Code Generator, Color Palette, and Markdown Previewer each include a reset action to clear it.",
  },
  {
    question: "Can I trust the output in production?",
    answer:
      "The tools use standard algorithms and libraries, but always review generated values, contrast results, and rendered Markdown before shipping. The Markdown previewer skips raw HTML for safety.",
  },
];

export function UsageFaq() {
  return (
    <section id="guide" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-brand">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Three steps. No setup.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Every utility follows the same simple flow — open, work, and take
              the result. Nothing is installed and nothing leaves your device.
            </p>

            <ol className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-muted/60 font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Common examples
              </p>
              <ul className="mt-3 space-y-3">
                {examples.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={tool.href}
                      className="group flex items-start justify-between gap-3"
                    >
                      <span>
                        <span className="text-sm font-medium transition-colors group-hover:text-brand">
                          {tool.name}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                          {EXAMPLE_NOTES[tool.slug] ?? tool.description}
                        </span>
                      </span>
                      <ArrowRightIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="faq" className="scroll-mt-20">
            <p className="font-mono text-xs uppercase tracking-wider text-brand">
              FAQ
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Questions, answered.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Privacy, speed, and the small details that keep the toolbox
              friction-free.
            </p>

            <div className="mt-6 space-y-2">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-xl border border-border bg-card open:bg-muted/20"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <PlusIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
