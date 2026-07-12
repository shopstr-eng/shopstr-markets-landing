import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist/public");

const BASE_URL = "https://shopstrmarkets.com";

const NAV_HTML = `
<nav style="position:fixed;top:0;left:0;right:0;z-index:50;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;">
  <a href="/" style="font-weight:900;font-size:1.25rem;">Shopstr Markets</a>
  <div style="display:flex;gap:2rem;align-items:center;">
    <a href="/#features">Features</a>
    <a href="/#marketplaces">Marketplaces</a>
    <a href="/#technology">Technology</a>
    <a href="/#mission">Mission</a>
    <a href="/faq">FAQ</a>
    <a href="/#marketplaces" style="background:#a438ba;color:#fff;padding:0.5rem 1.25rem;border-radius:0.5rem;font-weight:700;">Get Started</a>
  </div>
</nav>`.trim();

const FOOTER_HTML = `
<footer style="background:#111;color:#fff;padding:3rem 2rem;">
  <div style="max-width:1280px;margin:0 auto;">
    <div style="display:flex;gap:4rem;flex-wrap:wrap;margin-bottom:2rem;">
      <div>
        <h3 style="font-weight:900;font-size:1.25rem;margin-bottom:0.5rem;">Shopstr Markets</h3>
        <p style="color:#9ca3af;max-width:280px;">Permissionless marketplaces powered by Bitcoin and Nostr.</p>
      </div>
      <div>
        <h4 style="font-weight:700;margin-bottom:0.75rem;">Product</h4>
        <ul style="list-style:none;padding:0;color:#9ca3af;line-height:2;">
          <li><a href="/#features" style="color:#9ca3af;">Features</a></li>
          <li><a href="/#marketplaces" style="color:#9ca3af;">Marketplaces</a></li>
          <li><a href="/#technology" style="color:#9ca3af;">Technology</a></li>
        </ul>
      </div>
      <div>
        <h4 style="font-weight:700;margin-bottom:0.75rem;">Company</h4>
        <ul style="list-style:none;padding:0;color:#9ca3af;line-height:2;">
          <li><a href="/#mission" style="color:#9ca3af;">Mission</a></li>
        </ul>
      </div>
      <div>
        <h4 style="font-weight:700;margin-bottom:0.75rem;">Support</h4>
        <ul style="list-style:none;padding:0;color:#9ca3af;line-height:2;">
          <li><a href="/faq" style="color:#9ca3af;">FAQ</a></li>
          <li><a href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e" style="color:#9ca3af;">Contact</a></li>
        </ul>
      </div>
    </div>
    <div style="border-top:1px solid #333;padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
      <div style="display:flex;gap:1.5rem;">
        <a href="/terms-of-service" style="color:#9ca3af;font-size:0.875rem;">Terms of Service</a>
        <a href="/privacy-policy" style="color:#9ca3af;font-size:0.875rem;">Privacy Policy</a>
      </div>
      <p style="color:#6b7280;font-size:0.875rem;">&copy; 2025 Shopstr Markets Inc.</p>
    </div>
  </div>
</footer>`.trim();

const PAGE_CONTENT = {
  "/": `
<div style="min-height:100vh;font-family:system-ui,sans-serif;">
  ${NAV_HTML}
  <main>
    <section style="padding:8rem 2rem 3rem;max-width:1280px;margin:0 auto;">
      <h1 style="font-size:3.5rem;font-weight:900;line-height:1.1;margin-bottom:1.5rem;">Commerce Without Boundaries 🚀</h1>
      <p style="font-size:1.25rem;color:#6b7280;max-width:36rem;margin-bottom:2rem;line-height:1.7;">
        Shopstr Markets operates truly permissionless marketplaces. Connect buyers and sellers globally through decentralized technology, enabling free trade without restrictions.
      </p>
      <div style="display:flex;gap:1rem;margin-bottom:2rem;">
        <a href="#marketplaces" style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border-radius:0.5rem;font-weight:700;font-size:1.1rem;">Start Shopping ⚡</a>
        <a href="#mission" style="background:#fff;color:#111;padding:0.75rem 2rem;border-radius:0.5rem;font-weight:700;font-size:1.1rem;border:2px solid #111;">Learn More</a>
      </div>
    </section>

    <section id="features" style="padding:4rem 2rem;max-width:1280px;margin:0 auto;">
      <h2 style="font-size:2.25rem;font-weight:900;text-align:center;margin-bottom:1rem;">Why Choose Shopstr Markets?</h2>
      <p style="text-align:center;color:#6b7280;margin-bottom:3rem;font-size:1.1rem;">Built on the principles of financial freedom and open markets.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem;">
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">No Restrictions</h3>
          <p style="color:#6b7280;">Trade freely without geographic, financial, or regulatory barriers. Our permissionless system opens markets to everyone.</p>
        </div>
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">Privacy First</h3>
          <p style="color:#6b7280;">Built-in encryption and privacy features protect your transactions and personal information from prying eyes.</p>
        </div>
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">Lightning Fast</h3>
          <p style="color:#6b7280;">Experience instant transactions with low fees through our Bitcoin Lightning Network integration.</p>
        </div>
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">Global Reach</h3>
          <p style="color:#6b7280;">Connect with buyers and sellers worldwide. No borders, no limitations, just pure market freedom.</p>
        </div>
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">Zero Middlemen</h3>
          <p style="color:#6b7280;">Direct peer-to-peer trading eliminates intermediaries, reducing costs and increasing efficiency.</p>
        </div>
        <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
          <h3 style="font-weight:700;font-size:1.25rem;margin-bottom:0.75rem;">Censorship Resistant</h3>
          <p style="color:#6b7280;">Built on decentralized protocols that ensure your ability to trade can never be revoked or restricted.</p>
        </div>
      </div>
    </section>

    <section id="marketplaces" style="padding:4rem 2rem;background:#fff;">
      <div style="max-width:1280px;margin:0 auto;">
        <h2 style="font-size:2.25rem;font-weight:900;text-align:center;margin-bottom:1rem;">Our Live Marketplaces</h2>
        <p style="text-align:center;color:#6b7280;margin-bottom:3rem;font-size:1.1rem;">Experience the future of commerce today.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:3rem;">
          <div style="background:#f5f5f5;border:2px solid #111;border-radius:0.75rem;padding:2rem;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;">Shopstr</h3>
            <p style="color:#6b7280;font-size:0.75rem;text-transform:uppercase;font-weight:700;letter-spacing:0.1em;margin-bottom:1.5rem;">GENERAL MARKETPLACE</p>
            <p style="color:#4b5563;margin-bottom:2rem;line-height:1.7;">The flagship permissionless marketplace for any and all goods. Trade everything from electronics to art, books to clothing — all without restrictions.</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:2rem;">
              <span style="background:#ede9fe;color:#581c87;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Electronics</span>
              <span style="background:#ede9fe;color:#581c87;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Art &amp; Collectibles</span>
              <span style="background:#ede9fe;color:#581c87;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Books</span>
              <span style="background:#ede9fe;color:#581c87;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Clothing</span>
            </div>
            <a href="https://shopstr.market" style="background:#a438ba;color:#fff;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;display:inline-block;">Visit shopstr.market ✨</a>
          </div>
          <div style="background:#111;border:2px solid #111;border-radius:0.75rem;padding:2rem;color:#fff;">
            <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:#fff;">Milk Market</h3>
            <p style="color:#9ca3af;font-size:0.75rem;text-transform:uppercase;font-weight:700;letter-spacing:0.1em;margin-bottom:1.5rem;">MARKETPLACE FOR FOOD PRODUCERS &amp; ARTISANS</p>
            <p style="color:#9ca3af;margin-bottom:2rem;line-height:1.7;">A permissionless marketplace for farmers, food makers, and artisan producers. Open a stall in minutes, sell with no platform fees, and get paid directly — your customers stay yours.</p>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:2rem;">
              <span style="background:#1f2937;color:#e5e7eb;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Local Farms</span>
              <span style="background:#1f2937;color:#e5e7eb;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Food Makers</span>
              <span style="background:#1f2937;color:#e5e7eb;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Artisan Goods</span>
              <span style="background:#1f2937;color:#e5e7eb;padding:0.375rem 1rem;border-radius:0.375rem;font-size:0.875rem;font-weight:700;">Zero Platform Fees</span>
            </div>
            <a href="https://milk.market" style="background:#facc15;color:#111;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:700;display:inline-block;">Visit milk.market 🥛</a>
          </div>
        </div>
      </div>
    </section>

    <section id="technology" style="padding:4rem 2rem;max-width:1280px;margin:0 auto;">
      <h2 style="font-size:2.25rem;font-weight:900;text-align:center;margin-bottom:1rem;">Powered by Freedom Tech</h2>
      <p style="text-align:center;color:#6b7280;margin-bottom:3rem;font-size:1.1rem;">Our service leverages permissionless technologies to create truly free and open marketplaces.</p>
      <div style="max-width:56rem;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;">
        <div style="border:2px solid #111;border-radius:0.75rem;padding:2rem;display:flex;gap:1.5rem;align-items:flex-start;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;">Bitcoin Network</h3>
            <p style="color:#6b7280;line-height:1.7;">The world's most secure and decentralized monetary network provides the foundation for all transactions. No central authority can freeze your funds.</p>
          </div>
        </div>
        <div style="border:2px solid #111;border-radius:0.75rem;padding:2rem;display:flex;gap:1.5rem;align-items:flex-start;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;">Nostr Protocol</h3>
            <p style="color:#6b7280;line-height:1.7;">Decentralized communication protocol ensures censorship-resistant messaging and data exchange. Your identity and reputation are portable.</p>
          </div>
        </div>
        <div style="border:2px solid #111;border-radius:0.75rem;padding:2rem;display:flex;gap:1.5rem;align-items:flex-start;">
          <div>
            <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;">Cashu Protocol</h3>
            <p style="color:#6b7280;line-height:1.7;">Privacy-preserving ecash system enabling anonymous transactions while maintaining auditability. Experience true digital cash.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="mission" style="padding:4rem 2rem;background:#000;color:#fff;">
      <div style="max-width:56rem;margin:0 auto;text-align:center;">
        <h2 style="font-size:2.5rem;font-weight:900;margin-bottom:1.5rem;">Making Markets Free 🕊️</h2>
        <p style="font-size:1.25rem;color:#9ca3af;margin-bottom:3rem;line-height:1.7;">We believe that free markets are the foundation of human prosperity. Our mission is to remove barriers, eliminate intermediaries, and create a truly open marketplace where anyone can participate.</p>
        <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:1rem;margin-bottom:3rem;text-align:left;max-width:40rem;margin-left:auto;margin-right:auto;">
          <li style="background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.2);border-radius:0.75rem;padding:1.5rem;font-size:1.1rem;color:#e5e7eb;">Breaking down geographical barriers to trade</li>
          <li style="background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.2);border-radius:0.75rem;padding:1.5rem;font-size:1.1rem;color:#e5e7eb;">Eliminating financial gatekeepers and intermediaries</li>
          <li style="background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.2);border-radius:0.75rem;padding:1.5rem;font-size:1.1rem;color:#e5e7eb;">Protecting privacy and financial sovereignty</li>
          <li style="background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.2);border-radius:0.75rem;padding:1.5rem;font-size:1.1rem;color:#e5e7eb;">Empowering individuals worldwide to prosper</li>
        </ul>
        <blockquote style="background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.2);border-radius:0.75rem;padding:2rem;color:#9ca3af;font-style:italic;font-size:1.1rem;max-width:40rem;margin:0 auto;">
          "Trade is the great civilizer. It brings people together, creates prosperity, and builds a better world for all."
        </blockquote>
      </div>
    </section>
  </main>
  ${FOOTER_HTML}
</div>`.trim(),

  "/faq": `
<div style="min-height:100vh;font-family:system-ui,sans-serif;">
  ${NAV_HTML}
  <main style="max-width:56rem;margin:0 auto;padding:8rem 2rem 6rem;">
    <div style="text-align:center;margin-bottom:3rem;">
      <h1 style="font-size:3rem;font-weight:900;margin-bottom:1rem;">Frequently Asked Questions</h1>
      <p style="font-size:1.25rem;color:#6b7280;max-width:40rem;margin:0 auto;line-height:1.7;">Everything you need to know about using Shopstr Markets, Nostr, and Bitcoin payments.</p>
    </div>

    <article>
      <section style="margin-bottom:3rem;">
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.5rem;border-left:4px solid #111;padding-left:1rem;">General Information</h2>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">What is Shopstr Markets?</h3>
            <p style="color:#4b5563;line-height:1.7;">Shopstr Markets is a permissionless marketplace service building on Nostr to enable peer-to-peer commerce using Bitcoin. It provides secure and private ways to buy and sell items via the Lightning Network and Cashu token payments.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">What is Nostr?</h3>
            <p style="color:#4b5563;line-height:1.7;">Nostr is a protocol that allows you to take control of your digital identity and data. No one can stop you from posting what you want, and you can use your Nostr keys to sign into any other compatible Nostr applications, taking your content with you.</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom:3rem;">
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.5rem;border-left:4px solid #111;padding-left:1rem;">Payments</h2>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">What payment methods are accepted?</h3>
            <p style="color:#4b5563;line-height:1.7;">Shopstr Markets services currently support Bitcoin payments through the Lightning Network and Cashu. These help to facilitate fast, low-fee transactions while maintaining privacy.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How do I claim a Cashu payment?</h3>
            <p style="color:#4b5563;line-height:1.7;">You can instantly claim a received Cashu token to the Lightning address set on your Nostr profile by clicking the claim button then the redeem button when on the orders page. You can also receive the token directly into the integrated Cashu wallet and pay out to an external Lightning wallet at any time, or copy and paste the token into an external Cashu wallet (like Minibits, Coinos, cashu.me, etc.). Setting your profile payment preference to Lightning also automatically redeems incoming Cashu tokens.</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom:3rem;">
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.5rem;border-left:4px solid #111;padding-left:1rem;">Selling</h2>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How do I start selling on Shopstr Markets services?</h3>
            <p style="color:#4b5563;line-height:1.7;">To start selling, you'll simply need to: 1) Create a Nostr account or sign in with existing keys, 2) Set up your profile in settings, 3) List your products with descriptions and images, 4) Start receiving orders!</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">What types of items can I sell?</h3>
            <p style="color:#4b5563;line-height:1.7;">Shopstr Markets services support various product types including physical, resale, food, exchange, clothing, electronics, collectibles, and more. Each listing should clearly indicate the category and any shipping requirements.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How does shipping work?</h3>
            <p style="color:#4b5563;line-height:1.7;">Sellers can offer different shipping options including free shipping, local pickup, or an added shipping cost. The shipping method and any restrictions should be clearly specified in each listing and fulfillment will be handled by the merchant themselves.</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom:3rem;">
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.5rem;border-left:4px solid #111;padding-left:1rem;">Account &amp; Privacy</h2>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How can I sign in with an existing Nostr account?</h3>
            <p style="color:#4b5563;line-height:1.7;">It is recommended that you sign in using an extension (Alby, nos2x, etc.) or bunker application (Amber, nsec.app, etc.) in order to keep your private key secure. It is also possible to sign in by pasting your nsec and setting a passphrase to encrypt and store it in your browser, but it is not recommended as it could potentially leak your private key.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How are my messages and data kept private?</h3>
            <p style="color:#4b5563;line-height:1.7;">All messages are encrypted using Nostr's encrypted messaging protocol, specifically NIP-17. No one but the parties involved in a transaction can see what is happening. Your data is stored on your selected relays and isn't accessible by third parties.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Why am I unable to view my messages?</h3>
            <p style="color:#4b5563;line-height:1.7;">If you are unable to view order or inquiry messages, this is most likely due to not having NIP-44 encryption/decryption permissions set within your extension or bunker application. Make sure to go into your settings to see if NIP-44 encryption is supported and approve those permissions. If the issue persists, you are also able to view messages via apps like 0xchat, Amethyst, and other Nostr clients as long as they support NIP-17 DMs.</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom:3rem;">
        <h2 style="font-size:1.5rem;font-weight:900;margin-bottom:1.5rem;border-left:4px solid #111;padding-left:1rem;">Customer Experience</h2>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Is there a rating system?</h3>
            <p style="color:#4b5563;line-height:1.7;">Yes, Shopstr Markets services implements NIP-85 for reviews, allowing buyers to leave feedback for sellers and their products, helping build trust in the marketplace. To leave a review, find the leave a review button at the bottom of an order message window. Merchants are also able to carry over their reviews to other services that support NIP-85.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">How do I contact a seller?</h3>
            <p style="color:#4b5563;line-height:1.7;">You can contact sellers through each marketplace's encrypted messaging system. Simply navigate to a listing and click on the merchant profile to send a secure message to the seller.</p>
          </div>
          <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
            <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Am I able to return an item?</h3>
            <p style="color:#4b5563;line-height:1.7;">You can contact sellers directly in order to request a refund and initiate a return.</p>
          </div>
        </div>
      </section>
    </article>
  </main>
  ${FOOTER_HTML}
</div>`.trim(),

  "/privacy-policy": `
<div style="min-height:100vh;font-family:system-ui,sans-serif;">
  ${NAV_HTML}
  <main style="max-width:56rem;margin:0 auto;padding:8rem 2rem 6rem;">
    <div style="text-align:center;margin-bottom:3rem;">
      <h1 style="font-size:3rem;font-weight:900;margin-bottom:1rem;">Privacy Policy</h1>
      <p style="font-size:1.25rem;color:#6b7280;max-width:40rem;margin:0 auto;line-height:1.7;">How we handle your data and privacy on Shopstr Markets services.</p>
      <p style="color:#9ca3af;font-size:0.875rem;margin-top:0.75rem;">Last updated: July 14, 2025</p>
    </div>

    <article style="display:flex;flex-direction:column;gap:1rem;">
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Introduction</h2>
        <p style="color:#4b5563;line-height:1.7;">Shopstr Markets is committed to protecting your privacy. As a permissionless marketplace service, we minimize data collection and processing to ensure your privacy and security. This policy explains our approach to data handling in the context of a permissionless service.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Information We Don't Collect</h2>
        <p style="color:#4b5563;line-height:1.7;">As a fully permissionless marketplace service with no centralized backend, Shopstr Markets services do not collect or store: personal identification information, KYC (Know Your Customer) data, financial information, usage tracking data, or user behavior analytics. All data remains under user control through the Nostr protocol and Bitcoin network.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Nostr Protocol Data</h2>
        <p style="color:#4b5563;line-height:1.7;">Communication and listings through the Nostr protocol are distributed across your selected relays and may include: product listings and metadata, public messages and updates, encrypted direct messages (viewable only by intended recipients), and public keys associated with your Nostr identity. Users select which relays to connect to, determining what content they see and share.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Bitcoin &amp; Lightning Network Data</h2>
        <p style="color:#4b5563;line-height:1.7;">All transactions occur on the Bitcoin network or Lightning Network and follow their respective privacy models. This may include: transaction amounts, Bitcoin/Lightning addresses or payment requests, and time-stamped records. Cashu ecash transactions provide additional privacy benefits where implemented.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Website Usage</h2>
        <p style="color:#4b5563;line-height:1.7;">Our website interface is static and does not use cookies or tracking mechanisms. Any data stored is kept locally in your browser and includes: local keys (if using in-browser storage), user preferences, relay selections, and interface settings. Shopstr has no access to this locally stored information.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Third-Party Services</h2>
        <p style="color:#4b5563;line-height:1.7;">Users may interact with: Bitcoin network and Lightning Network nodes, Nostr relays (which you select), and self-hosted infrastructure. Each third-party service has its own privacy practices. We recommend reviewing the privacy policies of any relays you connect to or payment processors you utilize.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Security Measures</h2>
        <p style="color:#4b5563;line-height:1.7;">Security is maintained through: open-source code verification (our codebase is publicly available for review), cryptographic protocols for secure communications, Bitcoin network security for transactions, and client-side security measures. Users are responsible for maintaining the security of their private keys and wallets.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">User Rights and Control</h2>
        <p style="color:#4b5563;line-height:1.7;">As a permissionless marketplace service, users maintain full control over their: private keys and funds, product listings, relay selections, communication preferences, and local data storage. You can delete local data at any time through your browser settings. Note that due to the nature of distributed systems, messages and listings published to Nostr relays may persist on those relays according to their individual data retention policies.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Changes to Privacy Policy</h2>
        <p style="color:#4b5563;line-height:1.7;">Any updates to this privacy policy will be posted on this page. As a permissionless service, fundamental changes to data handling are unlikely as each marketplace operates on open protocols with minimal central coordination.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Contact Information</h2>
        <p style="color:#4b5563;line-height:1.7;">For privacy-related questions, you can reach the Shopstr Markets team through our <a href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e">Nostr channels</a> or <a href="https://github.com/shopstr-eng">GitHub repository</a>.</p>
      </div>
    </article>
  </main>
  ${FOOTER_HTML}
</div>`.trim(),

  "/terms-of-service": `
<div style="min-height:100vh;font-family:system-ui,sans-serif;">
  ${NAV_HTML}
  <main style="max-width:56rem;margin:0 auto;padding:8rem 2rem 6rem;">
    <div style="text-align:center;margin-bottom:3rem;">
      <h1 style="font-size:3rem;font-weight:900;margin-bottom:1rem;">Terms of Service</h1>
      <p style="font-size:1.25rem;color:#6b7280;max-width:40rem;margin:0 auto;line-height:1.7;">User agreement and usage guidelines for Shopstr Markets services.</p>
      <p style="color:#9ca3af;font-size:0.875rem;margin-top:0.75rem;">Last updated: July 14, 2025</p>
    </div>

    <article style="display:flex;flex-direction:column;gap:1rem;">
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">1. Platform Nature</h2>
        <p style="color:#4b5563;line-height:1.7;">Shopstr Markets is a permissionless marketplace service that operates on the Nostr and Bitcoin protocols. We do not hold custody of funds, products, or communications, nor do we act as an intermediary between buyers and sellers. Each marketplace provides an interface for peer-to-peer commerce without central authority.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">2. Relay Selection</h2>
        <p style="color:#4b5563;line-height:1.7;">Users have complete control over which Nostr relays they connect to and consequently which products they see. Shopstr Markets does not control the content available on various relays. Users are responsible for configuring their relay connections according to their preferences and local regulations.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">3. User Responsibilities</h2>
        <p style="color:#4b5563;line-height:1.7;">Users must maintain the security of their private keys and wallets, understand that transactions are irreversible, verify seller details before purchasing, and comply with local regulations regarding commerce, imports, and taxation. Sellers are responsible for the accuracy of their listings and legal compliance of their products.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">4. Prohibited Items</h2>
        <p style="color:#4b5563;line-height:1.7;">Though Shopstr Markets has no technical ability to prevent listings on its services, users agree not to list or sell illegal goods, harmful substances, counterfeit items, stolen property, or any items that violate applicable laws. The community-based nature of Nostr allows users to choose relays that align with their values.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">5. Transaction Risks</h2>
        <p style="color:#4b5563;line-height:1.7;">Users acknowledge that peer-to-peer transactions carry inherent risks including but not limited to: potential for scams, misrepresented items, shipping complications, and payment processing issues. Shopstr cannot intervene in disputes between buyers and sellers.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">6. Listing Guidelines</h2>
        <p style="color:#4b5563;line-height:1.7;">Listings should contain accurate descriptions, clear images, precise pricing information, and transparent shipping details. Sellers are encouraged to respond promptly to inquiries and maintain professional communication standards.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">7. Technical Requirements</h2>
        <p style="color:#4b5563;line-height:1.7;">A compatible Bitcoin Lightning wallet and/or Cashu implementation is required for transactions. Nostr key pair needed for authentication and encrypted communication. Users must ensure adequate network fees for transactions and maintain reliable internet connectivity.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">8. Disclaimers</h2>
        <p style="color:#4b5563;line-height:1.7;">Shopstr Markets is not a custodial service, cannot guarantee product quality or seller reliability, cannot reverse blockchain transactions, and is not responsible for user errors or losses resulting from key mismanagement. Due to the decentralized nature of the services, Shopstr Markets cannot remove listings from Nostr relays.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">9. Dispute Resolution</h2>
        <p style="color:#4b5563;line-height:1.7;">Any disputes must be resolved directly between buyers and sellers. We encourage users to communicate clearly and honestly. Each marketplace's review system helps create accountability in the marketplace, but Shopstr Markets cannot enforce resolutions or provide refunds.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">10. Modifications</h2>
        <p style="color:#4b5563;line-height:1.7;">These terms may be updated periodically. Users are responsible for reviewing changes. Continued use of Shopstr Markets services constitutes acceptance of current terms.</p>
      </div>
      <div style="background:#fff;border:2px solid #111;border-radius:0.75rem;padding:1.5rem;">
        <h2 style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Contact</h2>
        <p style="color:#4b5563;line-height:1.7;">Questions about these terms can be addressed through our <a href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e">Nostr channels</a> or <a href="https://github.com/shopstr-eng">GitHub repository</a>.</p>
      </div>
    </article>
  </main>
  ${FOOTER_HTML}
</div>`.trim(),
};

const routes = [
  {
    path: "/",
    outDir: "",
    title: "Shopstr Markets - Commerce Without Boundaries",
    description:
      "Shopstr Markets operates permissionless marketplaces including shopstr.market and milk.market. Trade freely without restrictions using Bitcoin and Nostr.",
    ogTitle: "Shopstr Markets - Permissionless Marketplaces",
    ogDescription:
      "Trade freely without restrictions on our permissionless marketplaces powered by Bitcoin and Nostr.",
  },
  {
    path: "/faq",
    outDir: "faq",
    title: "FAQ | Shopstr Markets",
    description:
      "Frequently asked questions about Shopstr Markets, our permissionless marketplaces, Bitcoin payments, and how to buy and sell on Nostr-based platforms.",
    ogTitle: "FAQ | Shopstr Markets",
    ogDescription:
      "Find answers to common questions about Shopstr Markets, Bitcoin payments, Nostr protocol, and our permissionless marketplace platforms.",
  },
  {
    path: "/privacy-policy",
    outDir: "privacy-policy",
    title: "Privacy Policy | Shopstr Markets",
    description:
      "Shopstr Markets privacy policy. We minimize data collection and protect your privacy as a permissionless marketplace service.",
    ogTitle: "Privacy Policy | Shopstr Markets",
    ogDescription:
      "Learn how Shopstr Markets protects your privacy through minimal data collection in our permissionless marketplace service.",
  },
  {
    path: "/terms-of-service",
    outDir: "terms-of-service",
    title: "Terms of Service | Shopstr Markets",
    description:
      "Terms of Service for Shopstr Markets. Understand the rules and responsibilities for using our permissionless marketplace platforms.",
    ogTitle: "Terms of Service | Shopstr Markets",
    ogDescription:
      "Read the terms of service for Shopstr Markets and our permissionless marketplace platforms built on Bitcoin and Nostr.",
  },
];

const baseHtml = readFileSync(join(distDir, "index.html"), "utf-8");

for (const route of routes) {
  const canonicalUrl = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
  const bodyContent = PAGE_CONTENT[route.path];

  let html = baseHtml;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${route.description}" />`,
  );

  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    );
  } else {
    html = html.replace(
      '<link rel="icon"',
      `<link rel="canonical" href="${canonicalUrl}" />\n    <link rel="icon"`,
    );
  }

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${route.ogTitle}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${route.ogDescription}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${route.ogTitle}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${route.ogDescription}" />`,
  );

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyContent}</div>`,
  );

  const outPath =
    route.outDir === ""
      ? join(distDir, "index.html")
      : join(distDir, route.outDir, "index.html");

  if (route.outDir !== "") {
    mkdirSync(join(distDir, route.outDir), { recursive: true });
  }

  writeFileSync(outPath, html, "utf-8");
  console.log(`Generated: ${outPath}`);
}

console.log("Static HTML prerender complete.");
