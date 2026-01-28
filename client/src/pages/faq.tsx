import { useState } from "react";
import { Link } from "wouter";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Minus, HelpCircle, MessageCircle } from "lucide-react";

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["0-0"]));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqSections = [
    {
      title: "General Information",
      items: [
        {
          title: "What is Shopstr Markets?",
          content:
            "Shopstr Markets is a permissionless marketplace service building on Nostr to enable peer-to-peer commerce using Bitcoin. It provides secure and private ways to buy and sell items via the Lightning Network and Cashu token payments.",
        },
        {
          title: "What is Nostr?",
          content:
            "Nostr is a protocol that allows you to take control of your digital identity and data. No one can stop you from posting what you want, and you can use your Nostr keys to sign into any other compatible Nostr applications, taking your content with you.",
        },
      ],
    },
    {
      title: "Payments",
      items: [
        {
          title: "What payment methods are accepted?",
          content:
            "Shopstr Markets services currently support Bitcoin payments through the Lightning Network and Cashu. These help to facilitate fast, low-fee transactions while maintaining privacy.",
        },
        {
          title: "How do I claim a Cashu payment?",
          content:
            "You can instantly claim a received Cashu token to the Lightning address set on your Nostr profile by clicking the claim button then the redeem button when on the orders page. You can also receive the token directly into the integrated Cashu wallet and pay out to an external Lightning wallet at any time, or copy and paste the token into an external Cashu wallet (like Minibits, Coinos, cashu.me, etc.). Setting your profile payment preference to Lightning also automatically redeems incoming Cashu tokens.",
        },
      ],
    },
    {
      title: "Selling",
      items: [
        {
          title: "How do I start selling on Shopstr Markets services?",
          content:
            "To start selling, you'll simply need to: 1) Create a Nostr account or sign in with existing keys, 2) Set up your profile in settings, 3) List your products with descriptions and images, 4) Start receiving orders!",
        },
        {
          title: "What types of items can I sell?",
          content:
            "Shopstr Markets services support various product types including physical, resale, food, exchange, clothing, electronics, collectibles, and more. Each listing should clearly indicate the category and any shipping requirements.",
        },
        {
          title: "How does shipping work?",
          content:
            "Sellers can offer different shipping options including free shipping, local pickup, or an added shipping cost. The shipping method and any restrictions should be clearly specified in each listing and fulfillment will be handled by the merchant themselves.",
        },
      ],
    },
    {
      title: "Account & Privacy",
      items: [
        {
          title: "How can I sign in with an existing Nostr account?",
          content:
            "It is recommended that you sign in using an extension (Alby, nos2x, etc.) or bunker application ( Amber, nsec.app, etc.) in order to keep your private key secure. It is also possible to sign in by pasting your nsec and setting a passphrase to encrypt and store it in your browser, but it is not recommended as it could potentially leak your private key.",
        },
        {
          title: "How are my messages and data kept private?",
          content:
            "All messages are encrypted using Nostr's encrypted messaging protocol, specifically NIP-17. No one but the parties involved in a transaction can see what is happening. Your data is stored on your selected relays and isn't accessible by third parties.",
        },
        {
          title: "Why am I unable to view my messages?",
          content:
            "If you are unable to view order or inquiry messages, this is most likely due to not having NIP-44 encryption/decryption permissions set within your extension or bunker application. Make sure to go into your settings to see if NIP-44 encryption is supported and approve those permissions. If the issue persists, you are also able to view messages via apps like 0xchat, Amethyst, and other Nostr clients as long as they support NIP-17 DMs.",
        },
      ],
    },
    {
      title: "Customer Experience",
      items: [
        {
          title: "Is there a rating system?",
          content:
            "Yes, Shopstr Markets services implements NIP-85 for reviews, allowing buyers to leave feedback for sellers and their products, helping build trust in the marketplace. To leave a review, find the leave a review button at the bottom of an order message window. Merchants are also able to carry over their reviews to other services that support NIP-85.",
        },
        {
          title: "How do I contact a seller?",
          content:
            "You can contact sellers through each marketplace's encrypted messaging system. Simply navigate to a listing and click on the merchant profile to send a secure message to the seller.",
        },
        {
          title: "Am I able to return an item?",
          content:
            "You can contact sellers directly in order to request a refund and initiate a return.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar isHomePage={false} />

      {/* Hero Content */}
      <section className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 border-2 border-black text-sm mb-6 text-purple-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <HelpCircle className="w-4 h-4" />
            <span>Support Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about using Shopstr Markets, Nostr, and
            Bitcoin payments.
          </p>
        </div>
      </section>

      <main className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-12">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-black text-foreground mb-6 pl-4 border-l-4 border-black">
                {section.title}
              </h2>
              <div className="grid gap-4">
                {section.items.map((item, itemIndex) => {
                  const id = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openItems.has(id);

                  return (
                    <Card
                      key={itemIndex}
                      className={`rounded-xl border-2 border-black transition-all duration-300 ${isOpen ? "bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]" : "bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"}`}
                    >
                      <CardBody className="p-0">
                        <button
                          onClick={() => toggleItem(id)}
                          className="w-full flex items-center justify-between p-6 text-left"
                        >
                          <span
                            className={`text-lg font-bold pr-8 ${isOpen ? "text-purple-900" : "text-foreground"}`}
                          >
                            {item.title}
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
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Card className="bg-gray-900 text-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

            <CardBody className="p-6 md:p-12 text-center relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-lg border-2 border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                Can't find what you're looking for? Feel free to reach out to
                our community.
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
                  <a
                    href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Us 🤙
                  </a>
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
