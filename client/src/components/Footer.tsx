import shopstrLogo from "@assets/shopstr-icon.png";
import nostrIcon from "@assets/nostr-icon.png";
import xLogo from "@assets/x-logo.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src={shopstrLogo}
                  alt="Shopstr Markets Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">
                Shopstr Markets
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering global commerce through permissionless technology and
              free market principles.
            </p>
          </div>

          {/* Mobile: Three columns side by side, Desktop: Continues as before */}
          <div className="grid grid-cols-3 gap-4 md:contents">
            <div className="flex flex-col">
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="/#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#marketplaces"
                    className="hover:text-foreground transition-colors"
                  >
                    Marketplaces
                  </a>
                </li>
                <li>
                  <a
                    href="/#technology"
                    className="hover:text-foreground transition-colors"
                  >
                    Technology
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="/#mission"
                    className="hover:text-foreground transition-colors"
                  >
                    Mission
                  </a>
                </li>
                {/* <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li> */}
                {/* <li><a href="/careers" className="hover:text-foreground transition-colors">Careers</a></li> */}
                <li>
                  <a
                    href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                {/* <li><a href="/help" className="hover:text-foreground transition-colors">Help Center</a></li> */}
                {/* <li><a href="/community" className="hover:text-foreground transition-colors">Community</a></li> */}
                <li>
                  <a
                    href="/faq"
                    className="hover:text-foreground transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* New footer bottom section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center gap-8 md:mb-0">
              <a
                href="/terms-of-service"
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-shopstr-purple"
              >
                Terms
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </a>
              <a
                href="/privacy-policy"
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-shopstr-purple"
              >
                Privacy
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </a>
              <div className="flex h-auto items-center gap-6">
                <a
                  href="https://github.com/shopstr-eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={nostrIcon} alt="Nostr Logo" className="w-8 h-8" />
                </a>
                <a
                  href="https://x.com/_shopstr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src={xLogo} alt="X Logo" className="w-6 h-6" />
                </a>
              </div>
            </div>
            <p className="text-muted-foreground">
              © 2025 Shopstr Markets Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
