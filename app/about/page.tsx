import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "micro.tools is a free, focused collection of developer utilities built to help you work faster with zero friction.",
};

const toolsList = [
  { href: "/tools/json-to-ts", label: "JSON to TypeScript" },
  { href: "/tools/base64", label: "Base64 Encoder / Decoder" },
  { href: "/tools/jwt-decoder", label: "JWT Decoder" },
  { href: "/tools/uuid-generator", label: "UUID Generator" },
];

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="Tools for developers who would rather be building."
      description="micro.tools is a free, independent collection of focused utilities. It exists for one reason: to help developers work faster, with no accounts, no paywalls, and no unnecessary steps in the way."
    >
      <ContentSection title="Our mission">
        <p>
          Developers spend enough time switching between tabs, wrestling with
          bloated tools, and signing up for services just to perform a simple
          task. micro.tools is dedicated to removing that friction.
        </p>
        <p>
          Each utility is built to do one job well and open instantly. Paste your
          input, get a clean result, and move on. No onboarding, no newsletter
          prompts, no upsells.
        </p>
      </ContentSection>

      <ContentSection title="What we build">
        <p>
          The platform is a growing set of micro-tools for everyday development
          work — conversion, encoding, security inspection, and generation.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          {toolsList.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
        <p>
          More utilities are added over time. If a tool saves you a few minutes,
          it belongs here.
        </p>
      </ContentSection>

      <ContentSection title="The principles we build by">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Speed first.</span>{" "}
            Pages load fast, tools respond instantly, and results are copy-ready.
          </li>
          <li>
            <span className="font-medium text-foreground">Private by design.</span>{" "}
            Everything runs in your browser. Your payloads are never uploaded or
            stored on our servers.
          </li>
          <li>
            <span className="font-medium text-foreground">Radically simple.</span>{" "}
            No accounts, no configuration, and no feature bloat. Just the tool you
            came for.
          </li>
          <li>
            <span className="font-medium text-foreground">Free to use.</span> The
            tools are available to everyone, from students to teams shipping
            production software.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Independent and evolving">
        <p>
          micro.tools is an independent project. The site is supported by
          unobtrusive advertising, which keeps the tools free without turning
          your data into the product. You can read exactly how that works in our{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          Have a suggestion for a tool or found a bug? We would like to hear
          about it at{" "}
          <a
            href="mailto:hello@micro.tools"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            hello@micro.tools
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="Start using the tools">
        <p>
          No sign-up required. Browse the full collection on the{" "}
          <Link
            href="/tools"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            tools page
          </Link>{" "}
          and pick what you need.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
