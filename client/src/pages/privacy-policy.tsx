import { useState } from "react";
import { Link } from "wouter";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Plus, Minus } from "lucide-react";

export default function PrivacyPolicy() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0, 1]));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

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
    <div className="min-h-screen bg-background font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar isHomePage={false} />

      {/* Hero Content */}
      <section className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 border-2 border-black text-sm mb-6 text-purple-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="w-4 h-4" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            How we handle your data and privacy on Shopstr Markets services.
            <br />
            <span className="text-sm opacity-70 block mt-2">
              Last updated: July 14, 2025
            </span>
          </p>
        </div>
      </section>

      <main className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          {privacyContent.map((section, index) => {
            const isOpen = openItems.has(index);
            return (
              <Card
                key={index}
                className={`rounded-xl border-2 border-black transition-all duration-300 ${isOpen ? "bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]" : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`}
              >
                <CardBody className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span
                      className={`text-lg font-bold pr-8 ${isOpen ? "text-purple-900" : "text-foreground"}`}
                    >
                      {section.title}
                    </span>
                    <div
                      className={`flex-shrink-0 rounded-lg border-2 border-black p-1 transition-all ${isOpen ? "bg-purple-600 text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="mt-20">
          <Card className="bg-gray-900 text-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2"></div>

            <CardBody className="p-6 md:p-12 text-center relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-lg border-2 border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Questions about privacy?
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                If you have any questions about this Privacy Policy, please
                contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary text-white rounded-lg px-8 py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black rounded-lg px-8 py-6 text-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Link href="/terms-of-service">Terms of Service</Link>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
