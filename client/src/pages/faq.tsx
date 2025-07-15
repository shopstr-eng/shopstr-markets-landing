import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FAQ() {
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar isHomePage={false} />

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about Shopstr Markets services
            </p>
          </div>

          <div className="space-y-6">
            {faqSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={`${sectionIndex}-${itemIndex}`}
                      className="border-b border-border pb-6 last:border-b-0 last:pb-0"
                    >
                      <h3 className="font-medium text-foreground mb-3">
                        {item.title}
                      </h3>
                      <div className="text-muted-foreground leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-card rounded-lg border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Feel free to reach out to
                our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-shopstr-purple to-shopstr-yellow text-white rounded-md hover:from-shopstr-purple/90 hover:to-shopstr-yellow/90 transition-all font-medium"
                >
                  Back to Home
                </Link>
                <a
                  href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-md hover:bg-background/50 transition-all font-medium"
                >
                  Contact 🤙
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
