import { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@/components/ui/button";
import shopstrLogo from "@assets/shopstr-icon.png";
import milkLogo from "@assets/milk-market-icon.png";
import bitcoinLogo from "@assets/bitcoin-icon.png";
import nostrOstrich from "@assets/nostr-ostrich.gif";
import rocketSketch from "@assets/rocket-sketch.png";
import cashuIcon from "@assets/cashu-icon.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Zap,
  Shield,
  Globe,
  Lock,
  Coins,
  Component,
  Check,
  LayoutGrid,
  Bird,
} from "lucide-react";

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
      icon: <Coins className="w-8 h-8 text-primary" />,
      title: "No Restrictions",
      description:
        "Trade freely without geographic, financial, or regulatory barriers. Our permissionless system opens markets to everyone.",
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Privacy First",
      description:
        "Built-in encryption and privacy features protect your transactions and personal information from prying eyes.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Lightning Fast",
      description:
        "Experience instant transactions with low fees through our Bitcoin Lightning Network integration.",
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Global Reach",
      description:
        "Connect with buyers and sellers worldwide. No borders, no limitations, just pure market freedom.",
    },
    {
      icon: <LayoutGrid className="w-8 h-8 text-primary" />,
      title: "Zero Middlemen",
      description:
        "Direct peer-to-peer trading eliminates intermediaries, reducing costs and increasing efficiency.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
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
        "The world's most secure and decentralized monetary network provides the foundation for all transactions. No central authority can freeze your funds.",
    },
    {
      icon: nostrOstrich,
      title: "Nostr Protocol",
      description:
        "Decentralized communication protocol ensures censorship-resistant messaging and data exchange. Your identity and reputation are portable.",
    },
    {
      icon: cashuIcon,
      title: "Cashu Protocol",
      description:
        "Privacy-preserving ecash system enabling anonymous transactions while maintaining auditability. Experience true digital cash.",
    },
  ];

  const missionPoints = [
    "Breaking down geographical barriers to trade",
    "Eliminating financial gatekeepers and intermediaries",
    "Protecting privacy and financial sovereignty",
    "Empowering individuals worldwide to prosper",
  ];

  return (
    <div className="min-h-screen bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar isHomePage={true} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="selection:bg-shopstr-yellow selection:text-black">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-foreground tracking-tight">
                <span className="bg-black text-white px-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#FACC15] inline-block mr-3">
                  Commerce
                </span>{" "}
                Without <br />
                <span className="text-purple-800">Boundaries</span> 🚀
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Shopstr Markets operates truly permissionless marketplaces.
                Connect buyers and sellers globally through decentralized
                technology, enabling free trade without restrictions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  asChild
                  className="bg-purple-600 text-white rounded-lg px-8 py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <a href="#marketplaces">Start Shopping ⚡</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-white text-black rounded-lg px-8 py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <a href="#mission">Learn More</a>
                </Button>
              </div>
              {/* New Small Info Row */}
              <div className="flex flex-wrap gap-4 sm:gap-8 items-center mt-8">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                  <div className="w-12 h-12 bg-purple-50 rounded-md border-2 border-purple-200 flex items-center justify-center">
                    <span className="text-xl">🤝</span>
                  </div>
                  Direct Transactions
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                  <div className="w-12 h-12 bg-purple-50 rounded-md border-2 border-purple-200 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                  Private & Secure
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                  <div className="w-12 h-12 bg-purple-50 rounded-md border-2 border-purple-200 flex items-center justify-center">
                    <span className="text-xl">🌍</span>
                  </div>
                  Global Access
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-[600px] aspect-square floating-element flex items-center justify-center">
                {/* Rocket Image */}
                <img
                  src={rocketSketch}
                  alt="Global Commerce Rocket"
                  className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-2xl"
                />

                <img
                  src={shopstrLogo}
                  alt="Shopstr Brand"
                  className="absolute z-20 w-5 h-5 md:w-8 md:h-8 top-[38%] right-[22%] -rotate-[35deg] opacity-80 grayscale brightness-75 contrast-125"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-md border-2 border-black bg-purple-100 text-purple-700 font-bold text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🚀 Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Why Choose Shopstr Markets?
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
                className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all relative overflow-hidden group"
              >
                <CardBody className="p-8">
                  <div className="w-16 h-16 bg-purple-100 text-primary rounded-lg border-2 border-black flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplaces Section */}
      <section id="marketplaces" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-md border-2 border-black bg-purple-100 text-purple-700 font-bold text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🛍️ Our Platforms
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Our Live Marketplaces
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of commerce today. Our active marketplaces
              are already connecting buyers and sellers worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardBody className="p-8 text-black relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={shopstrLogo}
                        alt="Shopstr Logo"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Shopstr
                      </h3>
                      <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mt-1">
                        GENERAL MARKETPLACE
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8 mt-6 leading-relaxed">
                    The flagship permissionless marketplace for any and all
                    goods. Trade everything from electronics to art, books to
                    clothing - all without restrictions.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="bg-purple-100 border border-black text-purple-900 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Electronics
                    </span>
                    <span className="bg-purple-100 border border-black text-purple-900 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Art & Collectibles
                    </span>
                    <span className="bg-purple-100 border border-black text-purple-900 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Books
                    </span>
                    <span className="bg-purple-100 border border-black text-purple-900 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Clothing
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="bg-primary text-white w-fit rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    onClick={() =>
                      window.open("https://shopstr.market", "_blank")
                    }
                  >
                    Visit shopstr.market ✨
                  </Button>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-[#111] rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardBody className="p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={milkLogo}
                        alt="Milk Market Icon"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Milk Market
                      </h3>
                      <p className="text-gray-400 uppercase text-xs font-bold tracking-wider mt-1">
                        RAW MILK MARKETPLACE
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-8 mt-6 leading-relaxed">
                    A specialized permissionless marketplace focused on raw milk
                    and dairy products. Connecting local farmers with
                    health-conscious consumers.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      Raw Milk
                    </span>
                    <span className="bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      Fresh Dairy
                    </span>
                    <span className="bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      Local Farms
                    </span>
                    <span className="bg-gray-800 border border-gray-600 text-gray-200 px-4 py-2 rounded-md text-sm font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                      Health Foods
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="text-black bg-yellow-400 hover:bg-yellow-500 min-w-fit transition-all duration-300 font-bold px-6 py-6 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    onClick={() => window.open("https://milk.market", "_blank")}
                  >
                    Visit milk.market 🥛
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mt-16">
            <Card className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-400 w-full">
              <CardBody className="p-12 text-center">
                <h4 className="text-xl font-bold mb-4 text-foreground">
                  More Marketplaces Coming Soon
                </h4>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're planning on expanding our network of specialized
                  marketplaces to serve every community and niche.
                </p>
                <Button
                  className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg font-medium"
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
      <section id="technology" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-md border-2 border-black bg-purple-100 text-purple-700 font-bold text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🚀 Innovation
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Powered by Freedom Tech
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our service leverages permissionless technologies to create truly
              free and open marketplaces.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {technologies.map((tech, index) => (
              <Card
                key={index}
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <CardBody className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-16 h-16 bg-primary rounded-lg border-2 border-black flex items-center justify-center shrink-0">
                    <img
                      src={tech.icon}
                      alt={tech.title}
                      className={`object-contain ${
                        tech.title === "Nostr Protocol"
                          ? "w-12 h-12 brightness-0 invert"
                          : "w-8 h-8"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {tech.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="bg-purple-50 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-black mb-4 text-foreground">
                The Future of Commerce is Here
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These technologies work together to create an unstoppable
                marketplace that puts freedom and privacy first.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <CardBody className="p-8 text-center items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-lg border-2 border-black flex items-center justify-center mb-4">
                    <Component className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground text-lg">
                    Decentralized
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    No single point of failure or control
                  </p>
                </CardBody>
              </Card>

              <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <CardBody className="p-8 text-center items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-lg border-2 border-black flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground text-lg">
                    Private
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Your data belongs to you
                  </p>
                </CardBody>
              </Card>

              <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <CardBody className="p-8 text-center items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-lg border-2 border-black flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground text-lg">
                    Global
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Accessible from anywhere
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        className="py-24 text-white bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] md:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-yellow-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border-2 border-white/20 text-sm mb-6 text-gray-200">
                <Bird className="w-4 h-4" />
                <span>Our Purpose</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                Making Markets Free
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                We believe that free markets are the foundation of human
                prosperity. Our mission is to remove barriers, eliminate
                intermediaries, and create a truly open marketplace where anyone
                can participate.
              </p>
              <div className="space-y-4 mb-8">
                {missionPoints.map((point, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 border-2 border-white/20 text-left max-w-2xl mx-auto backdrop-blur-sm rounded-xl"
                  >
                    <CardBody className="p-6 flex flex-row items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-md border border-white/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-200 font-medium text-lg">
                        {point}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
              <div className="mt-16 bg-white/5 rounded-xl p-8 max-w-2xl mx-auto border-2 border-white/20">
                <p className="italic text-gray-400 text-lg">
                  "Trade is the great civilizer. It brings people together,
                  creates prosperity, and builds a better world for all."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
            Ready to Experience True Market Freedom? 🎯
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the shoppers who are already experiencing the power of
            permissionless commerce. Start your journey towards financial
            freedom today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-primary text-white rounded-lg px-6 md:px-10 py-6 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <a href="#marketplaces">Get Started 🚀</a>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium">No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium">Start selling immediately</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-primary text-white rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-medium">Users in complete control</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
