import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Disclosure from "@/components/Disclosure";
import { FileText, Scale } from "lucide-react";

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
    <div className="min-h-screen bg-background font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar isHomePage={false} />

      <main>
        {/* Hero Content */}
        <section className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 border-2 border-black text-sm mb-6 text-purple-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-4 h-4" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              User agreement and usage guidelines for Shopstr Markets services.
              <br />
              <span className="text-sm opacity-70 block mt-2">
                Last updated: July 14, 2025
              </span>
            </p>
          </div>
        </section>

        <div className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            {tosContent.map((section, index) => (
              <Disclosure
                key={section.title}
                title={section.title}
                open={index < 2}
              >
                {section.content}
              </Disclosure>
            ))}
          </div>

          <div className="mt-20">
            <Card className="bg-gray-900 text-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

              <CardBody className="p-6 md:p-12 text-center relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-lg border-2 border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <Scale className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Questions about these terms?
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                  If you have any questions about these Terms of Service, please
                  contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    asChild
                    className="bg-primary text-white rounded-lg px-8 py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <a href="/">Back to Home</a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black rounded-lg px-8 py-6 text-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <a href="/privacy-policy">Privacy Policy</a>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
