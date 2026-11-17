import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of micro.tools and its browser-based developer utilities.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Service"
      description="These terms govern your access to and use of micro.tools. By using the site, you agree to them. If you do not agree, please do not use the site."
      updated="November 17, 2026"
    >
      <ContentSection title="1. Acceptance of terms">
        <p>
          By accessing or using micro.tools (&quot;the site&quot;,
          &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms
          of Service and our{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            Privacy Policy
          </Link>
          . If you do not agree with any part of these terms, you must not use
          the site.
        </p>
      </ContentSection>

      <ContentSection title="2. The service">
        <p>
          micro.tools provides free, browser-based utilities for developers,
          including conversion, encoding, decoding, and generation tools. The
          tools are provided for convenience and general use.
        </p>
        <p>
          We may add, modify, suspend, or discontinue any part of the site at any
          time without notice. We do not guarantee that any tool will always be
          available or remain unchanged.
        </p>
      </ContentSection>

      <ContentSection title="3. Permitted use">
        <p>You agree to use the site only for lawful purposes. You must not:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Use the site in any way that violates applicable laws or regulations.
          </li>
          <li>
            Attempt to gain unauthorized access to the site, its servers, or
            related systems.
          </li>
          <li>
            Interfere with, disrupt, overload, or attempt to damage the site or
            other users&apos; access to it.
          </li>
          <li>
            Use automated means to scrape or harvest content in a manner that
            imposes an unreasonable load on the site.
          </li>
          <li>
            Misrepresent the site, its tools, or your affiliation with us.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="4. Your content">
        <p>
          You retain all rights to the content you process with the tools. Tool
          inputs are handled locally in your browser and are not sent to us or
          stored on our servers.
        </p>
        <p>
          You are solely responsible for the content you process and for ensuring
          that you have the right to use it. Do not process sensitive or
          confidential information in any tool unless you are comfortable doing
          so on your own device.
        </p>
      </ContentSection>

      <ContentSection title="5. No warranty and verification">
        <p>
          The tools and all content on the site are provided on an &quot;as
          is&quot; and &quot;as available&quot; basis, without warranties of any
          kind, express or implied, including merchantability, fitness for a
          particular purpose, accuracy, and non-infringement.
        </p>
        <p>
          Outputs from the tools may contain errors or omissions. You are
          responsible for reviewing and verifying any result before relying on it
          in production, security-sensitive, or business-critical contexts. The
          tools are not a substitute for professional advice.
        </p>
      </ContentSection>

      <ContentSection title="6. Third-party links and advertising">
        <p>
          The site may contain links to third-party websites and may display
          advertisements served by third parties, including Google AdSense. We do
          not control and are not responsible for the content, products, or
          practices of third parties. Your interactions with advertisers or
          third-party sites are solely between you and them.
        </p>
      </ContentSection>

      <ContentSection title="7. Intellectual property">
        <p>
          Unless otherwise stated, the site&apos;s design, branding, text, and
          original content are owned by micro.tools and are protected by
          applicable intellectual property laws. You may not copy, reproduce, or
          redistribute the site&apos;s branding or content without permission,
          except as permitted by law.
        </p>
        <p>
          Tool outputs generated from your own input remain yours. Nothing in
          these terms transfers ownership of your content to us.
        </p>
      </ContentSection>

      <ContentSection title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, micro.tools and its operators
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or for any loss of profits, data,
          goodwill, or business opportunity, arising out of or related to your
          use of or inability to use the site.
        </p>
        <p>
          Where liability cannot be excluded, our total liability for any claim
          relating to the site shall not exceed the amount you paid us to use it,
          which is zero.
        </p>
      </ContentSection>

      <ContentSection title="9. Indemnification">
        <p>
          You agree to indemnify and hold harmless micro.tools and its operators
          from any claims, damages, liabilities, and expenses arising from your
          misuse of the site, your violation of these terms, or your violation of
          any law or third-party right.
        </p>
      </ContentSection>

      <ContentSection title="10. Changes to these terms">
        <p>
          We may update these terms from time to time. Updated terms take effect
          when posted on this page, and the &quot;Last updated&quot; date will be
          revised. Your continued use of the site after changes are posted
          constitutes acceptance of the updated terms.
        </p>
      </ContentSection>

      <ContentSection title="11. Governing law">
        <p>
          These terms are governed by the laws applicable to the operator of
          micro.tools, without regard to conflict-of-law principles. Any dispute
          shall be subject to the exclusive jurisdiction of the competent courts
          in that jurisdiction, unless mandatory local law provides otherwise.
        </p>
      </ContentSection>

      <ContentSection title="12. Contact">
        <p>
          Questions about these terms? Email{" "}
          <a
            href="mailto:hello@micro.tools"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            hello@micro.tools
          </a>
          .
        </p>
      </ContentSection>
    </ContentPage>
  );
}
