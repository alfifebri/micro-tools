import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ContentSection,
  ExternalLink,
} from "@/components/content-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How micro.tools handles data. Our tools run in your browser and never store your payloads.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      description="This policy explains what information micro.tools collects, how it is used, and the choices you have. In short: our tools run entirely in your browser, and we do not store the content you process."
      updated="November 17, 2026"
    >
      <ContentSection title="1. Who we are">
        <p>
          micro.tools (&quot;we&quot;, &quot;us&quot;, or &quot;the
          site&quot;) provides free, browser-based utilities for developers.
          This Privacy Policy applies to micro.tools and all tools hosted on it.
          By using the site, you agree to the practices described here.
        </p>
      </ContentSection>

      <ContentSection title="2. Client-side processing">
        <p>
          Every tool on micro.tools is designed to run locally in your browser.
          The JSON, text, tokens, UUIDs, and other payloads you enter are
          processed on your device and are never transmitted to, stored in, or
          logged by a database controlled by us.
        </p>
        <p>
          We do not require an account, and we do not ask for personal
          information in order to use any tool.
        </p>
      </ContentSection>

      <ContentSection title="3. Information we collect">
        <p>
          We do not collect the content you process. We may receive limited
          technical information that is automatically generated when any website
          is visited, such as:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            IP address, browser type, device type, operating system, and
            referring page.
          </li>
          <li>
            Aggregated usage information such as page views, used to understand
            which tools are useful and to keep the site secure.
          </li>
          <li>
            Information you voluntarily provide if you contact us by email.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="4. Cookies and local storage">
        <p>
          micro.tools does not set advertising or tracking cookies itself. We use
          your browser&apos;s local storage for one purpose: remembering your
          light or dark theme preference. This value stays on your device and is
          never sent to us.
        </p>
        <p>
          Third-party services described below, including advertising partners,
          may set cookies or similar technologies when you visit the site.
        </p>
      </ContentSection>

      <ContentSection title="5. Advertising and Google AdSense">
        <p>
          We may display advertising to keep micro.tools free. Third-party
          vendors, including Google, may use cookies to serve ads based on your
          prior visits to this website or other websites.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners to
          serve ads to you based on your visit to this site and/or other sites on
          the internet. You can learn more about how Google uses information from
          sites that use its services in{" "}
          <ExternalLink href="https://policies.google.com/technologies/partner-sites">
            Google&apos;s partner sites policy
          </ExternalLink>
          .
        </p>
        <p>
          You may opt out of personalized advertising by visiting{" "}
          <ExternalLink href="https://www.google.com/settings/ads">
            Google Ads Settings
          </ExternalLink>
          , or opt out of some third-party vendors&apos; use of cookies for
          personalized advertising at{" "}
          <ExternalLink href="https://www.aboutads.info">
            www.aboutads.info
          </ExternalLink>
          . Opting out does not mean you will stop seeing ads; it means the ads
          you see may be less relevant to you.
        </p>
        <p>
          Third-party ad vendors operate under their own privacy policies. We do
          not control their cookies or data practices.
        </p>
      </ContentSection>

      <ContentSection title="6. Analytics">
        <p>
          We may use privacy-conscious, aggregate analytics to understand
          traffic and improve the site. Such information is not used to identify
          you personally and is not linked to the content you process in any
          tool.
        </p>
      </ContentSection>

      <ContentSection title="7. Third-party links">
        <p>
          The site may link to third-party websites, documentation, or
          resources. We are not responsible for the privacy practices or content
          of those websites. We encourage you to read their privacy policies
          before providing any information.
        </p>
      </ContentSection>

      <ContentSection title="8. Data retention and security">
        <p>
          Because tool payloads are processed locally, there is no server-side
          data to retain. If you contact us, we retain your message only for as
          long as needed to respond and for reasonable record-keeping. We use
          HTTPS and other reasonable measures to protect the site, but no method
          of transmission or storage is completely secure.
        </p>
      </ContentSection>

      <ContentSection title="9. Your rights">
        <p>
          Depending on where you live, you may have rights under laws such as the
          GDPR or CCPA, including the right to access, correct, or delete
          personal information, and to object to certain processing. Since we do
          not maintain accounts or store tool payloads, we may have little or no
          personal information about you.
        </p>
        <p>
          To exercise any applicable right, contact us at{" "}
          <a
            href="mailto:hello@micro.tools"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            hello@micro.tools
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="10. Children's privacy">
        <p>
          micro.tools is intended for developers and is not directed at
          children. We do not knowingly collect personal information from
          children. If you believe a child has provided personal information to
          us, please contact us and we will take reasonable steps to remove it.
        </p>
      </ContentSection>

      <ContentSection title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Changes are
          effective when posted on this page, and the &quot;Last updated&quot;
          date will reflect the latest revision. Continued use of the site after
          changes are posted means you accept the updated policy.
        </p>
      </ContentSection>

      <ContentSection title="12. Contact">
        <p>
          Questions about this policy? Email{" "}
          <a
            href="mailto:hello@micro.tools"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            hello@micro.tools
          </a>{" "}
          or read our{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Terms of Service
          </Link>
          .
        </p>
      </ContentSection>
    </ContentPage>
  );
}
