import { useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import shopstrLogo from "@assets/shopstr-icon.png";
import milkLogo from "@assets/milk-market-icon.png";
import bitcoinLogo from "@assets/bitcoin-icon.png";
import nostrOstrich from "@assets/nostr-ostrich.gif";
import cashuIcon from "@assets/cashu-icon.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const element = document.querySelector(
          target.getAttribute("href") || "",
        );
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  const features = [
    {
      icon: "💸",
      title: "No Restrictions",
      description:
        "Trade freely without geographic, financial, or regulatory barriers. Our permissionless system opens markets to everyone.",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description:
        "Built-in encryption and privacy features protect your transactions and personal information from prying eyes.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Experience instant transactions with low fees through our Bitcoin Lightning Network integration.",
    },
    {
      icon: "🌐",
      title: "Global Reach",
      description:
        "Connect with buyers and sellers worldwide. No borders, no limitations, just pure market freedom.",
    },
    {
      icon: "💎",
      title: "Zero Middlemen",
      description:
        "Direct peer-to-peer trading eliminates intermediaries, reducing costs and increasing efficiency.",
    },
    {
      icon: "🛡️",
      title: "Censorship Resistant",
      description:
        "Built on decentralized protocols that ensure your ability to trade can never be revoked or restricted.",
    },
  ];

  const technologies = [
    {
      icon: bitcoinLogo,
      title: "Bitcoin Network",
      description:
        "The world's most secure and decentralized monetary network provides the foundation for all transactions.",
    },
    {
      icon: nostrOstrich,
      title: "Nostr Protocol",
      description:
        "Decentralized communication protocol ensures censorship-resistant messaging and data exchange.",
    },
    {
      icon: cashuIcon,
      title: "Cashu Protocol",
      description:
        "Privacy-preserving ecash system enabling anonymous transactions while maintaining auditability.",
    },
  ];

  const missionPoints = [
    "Breaking down geographical barriers to trade",
    "Eliminating financial gatekeepers and intermediaries",
    "Protecting privacy and financial sovereignty",
    "Empowering individuals worldwide to prosper",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Commerce Without <span className="text-accent">Boundaries</span>{" "}
                🚀
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Shopstr Markets operates truly permissionless marketplaces.
                Connect buyers and sellers globally through decentralized
                technology, enabling free trade without restrictions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  as="a"
                  href="#marketplaces"
                  className="text-light-text shadow-lg bg-gradient-to-tr from-shopstr-yellow via-shopstr-yellow-light to-shopstr-yellow min-w-fit hover:from-shopstr-yellow/90 hover:via-shopstr-yellow-light/90 hover:to-shopstr-yellow/90 transition-all duration-300 text-lg px-8 py-4"
                >
                  Start Shopping 🛒
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  as="a"
                  href="#mission"
                  className="border-2 border-shopstr-yellow text-yellow-600 hover:bg-shopstr-yellow hover:text-light-text text-lg px-8 py-4 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🤝</span>
                  <span>Direct Transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔐</span>
                  <span>Private & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌐</span>
                  <span>Global Access</span>
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-96 h-96 floating-element">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="cube-3d w-32 h-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-accent to-accent/80 rounded-xl"></div>
                    <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-white/10 rounded-lg backdrop-blur-sm flex items-center justify-center">
                      <img
                        src={shopstrLogo}
                        alt="Shopstr Logo"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="absolute top-8 right-8 w-16 h-16 bg-primary/30 rounded-full blur-xl floating-element"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-8 left-8 w-12 h-12 bg-accent/30 rounded-full blur-xl floating-element"
                  style={{ animationDelay: "3s" }}
                ></div>
                <div
                  className="absolute top-1/2 left-4 w-8 h-8 bg-white/20 rounded-full blur-lg floating-element"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Shopstr Markets? 🎯
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built on the principles of financial freedom and open markets, our
              platform empowers global commerce through cutting-edge
              decentralized technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card rounded-2xl shadow-lg card-hover border-border modern-card"
              >
                <CardBody className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplaces Section */}
      <section id="marketplaces" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Live Marketplaces 🛍️
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of commerce today. Our active marketplaces
              are already connecting buyers and sellers worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card
              className="rounded-2xl shadow-xl border-border overflow-hidden card-hover modern-card"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <CardBody className="p-8 text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <img
                        src={shopstrLogo}
                        alt="Shopstr Logo"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-shopstr-purple">
                        Shopstr
                      </h3>
                      <p className="text-gray-600">General Marketplace</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    The flagship permissionless marketplace for any and all
                    goods. Trade everything from electronics to art, books to
                    clothing - all without restrictions.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Electronics
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Art & Collectibles
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Books
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Clothing
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="text-white shadow-lg bg-gradient-to-tr from-shopstr-purple via-shopstr-purple-light to-shopstr-purple min-w-fit hover:from-shopstr-purple/90 hover:via-shopstr-purple-light/90 hover:to-shopstr-purple/90 transition-all duration-300 font-semibold"
                    onClick={() =>
                      window.open("https://shopstr.market", "_blank")
                    }
                  >
                    Visit shopstr.market 🚀
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white rounded-2xl shadow-xl border-border overflow-hidden card-hover modern-card">
              <CardBody className="p-8 text-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-black/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <img
                        src={milkLogo}
                        alt="Milk Market Icon"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black">
                        Milk Market
                      </h3>
                      <p className="text-gray-600">Raw Milk Marketplace</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    A specialized permissionless marketplace focused on raw milk
                    and dairy products. Connecting local farmers with
                    health-conscious consumers.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Raw Milk
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Fresh Dairy
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Local Farms
                    </span>
                    <span className="bg-black/10 text-black px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      Health Foods
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="text-white shadow-lg bg-black min-w-fit hover:bg-gray-800 transition-all duration-300 font-semibold"
                    onClick={() => window.open("https://milk.market", "_blank")}
                  >
                    Visit milk.market 🥛
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-card rounded-2xl shadow-lg border-border inline-block modern-card">
              <CardBody className="p-8">
                <h4 className="text-xl font-bold mb-4 text-foreground">
                  More Marketplaces Coming Soon
                </h4>
                <p className="text-muted-foreground mb-4">
                  We're planning on expanding our network of specialized
                  marketplaces to serve every community and niche.
                </p>
                <Button
                  variant="bordered"
                  className="border-shopstr-purple text-shopstr-purple hover:bg-shopstr-purple hover:text-dark-text transition-all duration-300"
                  onClick={() =>
                    window.open(
                      "https://njump.me/npub15dc33fyg3cpd9r58vlqge2hh8dy6hkkrjxkhluv2xpyfreqkmsesesyv6e",
                      "_blank",
                    )
                  }
                >
                  Stay Updated 🤙
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powered by Freedom Tech 🚀
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our service leverages permissionless technologies to create truly
              free and open marketplaces.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div
                      className="absolute w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl orbit-element flex items-center justify-center"
                      style={{ animationDelay: "0s" }}
                    >
                      <img
                        src={bitcoinLogo}
                        alt="Bitcoin"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div
                      className="absolute w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl orbit-element flex items-center justify-center"
                      style={{ animationDelay: "2s" }}
                    >
                      <img
                        src={nostrOstrich}
                        alt="Nostr"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div
                      className="absolute w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl orbit-element flex items-center justify-center"
                      style={{ animationDelay: "4s" }}
                    >
                      <img
                        src={cashuIcon}
                        alt="Cashu"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Built on Proven Foundations
              </h3>
              <div className="space-y-6">
                {technologies.map((tech, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="tech-badge text-black p-3 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img
                        src={tech.icon}
                        alt={tech.title}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-foreground">
                        {tech.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 modern-card border-border">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                The Future of Commerce is Here
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These technologies work together to create an unstoppable
                marketplace that puts freedom and privacy first.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <span className="text-lg md:text-2xl">🔄</span>
                </div>
                <h4 className="font-semibold mb-1 md:mb-2 text-foreground text-sm md:text-base">
                  Decentralized
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm">
                  No single point of failure or control
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <span className="text-lg md:text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold mb-1 md:mb-2 text-foreground text-sm md:text-base">
                  Private
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Your data belongs to you
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <span className="text-lg md:text-2xl">🌐</span>
                </div>
                <h4 className="font-semibold mb-1 md:mb-2 text-foreground text-sm md:text-base">
                  Global
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Accessible from anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="mb-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="max-w-4xl text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Making Markets Free 🕊️
              </h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                We believe that free markets are the foundation of human
                prosperity. Our mission is to remove barriers, eliminate
                intermediaries, and create a truly open marketplace where anyone
                can participate.
              </p>
              <div className="space-y-4 mb-8">
                {missionPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-left max-w-2xl mx-auto"
                  >
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-foreground">{point}</p>
                  </div>
                ))}
              </div>
              <blockquote className="border-l-4 border-accent pl-6 italic text-muted-foreground text-left max-w-2xl mx-auto">
                "Trade is the great civilizer. It brings people together,
                creates prosperity, and builds a better world for all."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience True Market Freedom? 🎯
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join the shoppers who are already experiencing the power of
            permissionless commerce. Start your journey towards financial
            freedom today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              as="a"
              href="#marketplaces"
              className="text-light-text shadow-lg bg-gradient-to-tr from-shopstr-yellow via-shopstr-yellow-light to-shopstr-yellow min-w-fit hover:from-shopstr-yellow/90 hover:via-shopstr-yellow-light/90 hover:to-shopstr-yellow/90 transition-all duration-300 text-lg px-8 py-4"
            >
              Get Started 🚀
            </Button>
            {/* <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
              View Demo
            </Button> */}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Start selling immediately</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Users in complete control</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
