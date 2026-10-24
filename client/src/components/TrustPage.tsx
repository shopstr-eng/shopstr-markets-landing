import { Card, CardBody } from "@nextui-org/react";
import { Globe, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import trustPages from "@shared/trust-pages.json";

type TrustPageName = keyof typeof trustPages;

export default function TrustPage({ page }: { page: TrustPageName }) {
  const content = trustPages[page];
  const isContact = page === "contact";
  const Icon = isContact ? Mail : Globe;

  return (
    <div className="min-h-screen bg-background font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar isHomePage={false} />

      <main>
        <section className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 border-2 border-black text-sm mb-6 text-purple-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{isContact ? "Get in touch" : "Our mission"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              {content.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </div>
        </section>

        <div className="pb-24 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {isContact && (
            <ul
              aria-label="Public contact details"
              className="grid sm:grid-cols-2 gap-4 mb-8"
            >
              <li>
                <a
                  href="mailto:biz@shopstrmarkets.com"
                  className="flex items-center gap-3 p-5 rounded-xl bg-purple-100 text-purple-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Mail className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-bold break-all">
                    biz@shopstrmarkets.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+12062909736"
                  className="flex items-center gap-3 p-5 rounded-xl bg-purple-100 text-purple-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Phone className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-bold">+1 (206) 290-9736</span>
                </a>
              </li>
            </ul>
          )}

          <div className="space-y-6">
            {content.sections.map((section) => (
              <Card
                key={section.title}
                className="rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <CardBody className="p-6 md:p-8">
                  <h2 className="text-2xl font-black text-foreground mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-gray-900 text-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardBody className="p-6 md:p-8">
              <h2 className="text-2xl font-black mb-6 text-center">
                Helpful links
              </h2>
              <nav
                aria-label="Related resources"
                className="flex flex-wrap gap-4 justify-center"
              >
                {[
                  { href: "/faq", label: "FAQ" },
                  { href: "/privacy", label: "Privacy Policy" },
                  {
                    href: isContact ? "/about" : "/contact",
                    label: isContact ? "About us" : "Contact us",
                  },
                  { href: "/#marketplaces", label: "Our products" },
                ].map((link) => (
                  <Button
                    key={link.href}
                    variant="outline"
                    asChild
                    className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <a href={link.href}>{link.label}</a>
                  </Button>
                ))}
                {[
                  {
                    href: "https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e",
                    label: "Official Nostr",
                  },
                  {
                    href: "https://github.com/shopstr-eng",
                    label: "Official GitHub",
                  },
                ].map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    className="bg-primary text-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </Button>
                ))}
              </nav>
            </CardBody>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
