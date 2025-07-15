import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const privacyContent = [
    {
      title: "Introduction",
      content:
        "Shopstr Markets is committed to protecting your privacy. As a permissionless marketplace service, we minimize data collection and processing to ensure your privacy and security. This policy explains our approach to data handling in the context of a permissionless service.",
    },
    {
      title: "Information We Don't Collect",
      content:
        "As a fully permissionless marketplace service with no centralized backend, Shopstr Markets services do not collect or store: personal identification information, KYC (Know Your Customer) data, financial information, usage tracking data, or user behavior analytics. All data remains under user control through the Nostr protocol and Bitcoin network.",
    },
    {
      title: "Nostr Protocol Data",
      content:
        "Communication and listings through the Nostr protocol are distributed across your selected relays and may include: product listings and metadata, public messages and updates, encrypted direct messages (viewable only by intended recipients), and public keys associated with your Nostr identity. Users select which relays to connect to, determining what content they see and share.",
    },
    {
      title: "Bitcoin & Lightning Network Data",
      content:
        "All transactions occur on the Bitcoin network or Lightning Network and follow their respective privacy models. This may include: transaction amounts, Bitcoin/Lightning addresses or payment requests, and time-stamped records. Cashu ecash transactions provide additional privacy benefits where implemented.",
    },
    {
      title: "Website Usage",
      content:
        "Our website interface is static and does not use cookies or tracking mechanisms. Any data stored is kept locally in your browser and includes: local keys (if using in-browser storage), user preferences, relay selections, and interface settings. Shopstr has no access to this locally stored information.",
    },
    {
      title: "Third-Party Services",
      content:
        "Users may interact with: Bitcoin network and Lightning Network nodes, Nostr relays (which you select), and self-hosted infrastructure. Each third-party service has its own privacy practices. We recommend reviewing the privacy policies of any relays you connect to or payment processors you utilize.",
    },
    {
      title: "Security Measures",
      content:
        "Security is maintained through: open-source code verification (our codebase is publicly available for review), cryptographic protocols for secure communications, Bitcoin network security for transactions, and client-side security measures. Users are responsible for maintaining the security of their private keys and wallets.",
    },
    {
      title: "User Rights and Control",
      content:
        "As a permissionless marketplace service, users maintain full control over their: private keys and funds, product listings, relay selections, communication preferences, and local data storage. You can delete local data at any time through your browser settings. Note that due to the nature of distributed systems, messages and listings published to Nostr relays may persist on those relays according to their individual data retention policies.",
    },
    {
      title: "Changes to Privacy Policy",
      content:
        "Any updates to this privacy policy will be posted on this page. As a permissionless service, fundamental changes to data handling are unlikely as each marketplace operates on open protocols with minimal central coordination.",
    },
    {
      title: "Contact Information",
      content:
        "For privacy-related questions, you can reach the Shopstr Markets team through our Nostr channels or GitHub repository.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar isHomePage={false} />

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              How we handle your data and privacy on Shopstr Markets services
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: July 14, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="space-y-8">
              {privacyContent.map((section, index) => (
                <div
                  key={`privacy-${index}`}
                  className="border-b border-border pb-8 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-semibold text-foreground mb-4">
                    {section.title}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Questions about privacy?
              </h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about this Privacy Policy, please
                contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-shopstr-purple to-shopstr-yellow text-white rounded-md hover:from-shopstr-purple/90 hover:to-shopstr-yellow/90 transition-all font-medium"
                >
                  Back to Home
                </Link>
                <Link
                  href="/terms-of-service"
                  className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-md hover:bg-background/50 transition-all font-medium"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
