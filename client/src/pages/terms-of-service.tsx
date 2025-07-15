import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  const tosContent = [
    {
      title: "1. Platform Nature",
      content:
        "Shopstr Markets is a permissionless marketplace service that operates on the Nostr and Bitcoin protocols. We do not hold custody of funds, products, or communications, nor do we act as an intermediary between buyers and sellers. Each marketplace provides an interface for peer-to-peer commerce without central authority.",
    },
    {
      title: "2. Relay Selection",
      content:
        "Users have complete control over which Nostr relays they connect to and consequently which products they see. Shopstr Markets does not control the content available on various relays. Users are responsible for configuring their relay connections according to their preferences and local regulations.",
    },
    {
      title: "3. User Responsibilities",
      content:
        "Users must maintain the security of their private keys and wallets, understand that transactions are irreversible, verify seller details before purchasing, and comply with local regulations regarding commerce, imports, and taxation. Sellers are responsible for the accuracy of their listings and legal compliance of their products.",
    },
    {
      title: "4. Prohibited Items",
      content:
        "Though Shopstr Markets has no technical ability to prevent listings on its services, users agree not to list or sell illegal goods, harmful substances, counterfeit items, stolen property, or any items that violate applicable laws. The community-based nature of Nostr allows users to choose relays that align with their values.",
    },
    {
      title: "5. Transaction Risks",
      content:
        "Users acknowledge that peer-to-peer transactions carry inherent risks including but not limited to: potential for scams, misrepresented items, shipping complications, and payment processing issues. Shopstr cannot intervene in disputes between buyers and sellers.",
    },
    {
      title: "6. Listing Guidelines",
      content:
        "Listings should contain accurate descriptions, clear images, precise pricing information, and transparent shipping details. Sellers are encouraged to respond promptly to inquiries and maintain professional communication standards.",
    },
    {
      title: "7. Technical Requirements",
      content:
        "A compatible Bitcoin Lightning wallet and/or Cashu implementation is required for transactions. Nostr key pair needed for authentication and encrypted communication. Users must ensure adequate network fees for transactions and maintain reliable internet connectivity.",
    },
    {
      title: "8. Disclaimers",
      content:
        "Shopstr Markets is not a custodial service, cannot guarantee product quality or seller reliability, cannot reverse blockchain transactions, and is not responsible for user errors or losses resulting from key mismanagement. Due to the decentralized nature of the services, Shopstr Markets cannot remove listings from Nostr relays.",
    },
    {
      title: "9. Dispute Resolution",
      content:
        "Any disputes must be resolved directly between buyers and sellers. We encourage users to communicate clearly and honestly. Each marketplace's review system helps create accountability in the marketplace, but Shopstr Markets cannot enforce resolutions or provide refunds.",
    },
    {
      title: "10. Modifications",
      content:
        "These terms may be updated periodically. Users are responsible for reviewing changes. Continued use of Shopstr Markets services constitutes acceptance of current terms.",
    },
    {
      title: "Contact",
      content:
        "Questions about these terms can be addressed through our Nostr channels or GitHub repository.",
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
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              User agreement and usage guidelines for Shopstr Markets services
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: July 14, 2025
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="space-y-8">
              {tosContent.map((section, index) => (
                <div
                  key={`tos-${index}`}
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
                Questions about these terms?
              </h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these Terms of Service, please
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
                  href="/privacy-policy"
                  className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-md hover:bg-background/50 transition-all font-medium"
                >
                  Privacy Policy
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
