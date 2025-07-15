import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import shopstrLogo from "@assets/shopstr-icon.png";

interface NavbarProps {
  isHomePage?: boolean;
}

export default function Navbar({ isHomePage = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only update navbar visibility if scrolled more than 50px
      if (currentScrollY > 50) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsNavbarVisible(false);
        } else {
          // Scrolling up - show navbar
          setIsNavbarVisible(true);
        }
      } else {
        setIsScrolled(false);
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Dynamic text color based on background
  const getNavbarTextColor = () => {
    if (isScrolled) {
      return "text-foreground"; // Always dark when scrolled (white background)
    }

    if (isHomePage) {
      return "text-white"; // Light text on dark hero background
    } else {
      return "text-foreground"; // Dark text on light background for other pages
    }
  };

  const navbarBgColor = isScrolled
    ? "bg-white/90 backdrop-blur-sm"
    : "bg-transparent";
  const navbarTextColor = getNavbarTextColor();
  const mobileBgColor = isMobileMenuOpen ? "bg-white" : "bg-transparent";

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 ${isNavbarVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div
        className={`w-full transition-all duration-300 ${navbarBgColor} ${mobileBgColor} border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src={shopstrLogo}
                  alt="Shopstr Markets Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span
                className={`text-xl font-bold transition-colors duration-300 ${navbarTextColor} hover:opacity-80`}
              >
                Shopstr Markets
              </span>
            </a>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                <a
                  href={isHomePage ? "#features" : "/#features"}
                  className={`transition-colors duration-300 ${navbarTextColor} hover:text-primary`}
                >
                  Features
                </a>
                <a
                  href={isHomePage ? "#marketplaces" : "/#marketplaces"}
                  className={`transition-colors duration-300 ${navbarTextColor} hover:text-primary`}
                >
                  Marketplaces
                </a>
                <a
                  href={isHomePage ? "#technology" : "/#technology"}
                  className={`transition-colors duration-300 ${navbarTextColor} hover:text-primary`}
                >
                  Technology
                </a>
                <a
                  href={isHomePage ? "#mission" : "/#mission"}
                  className={`transition-colors duration-300 ${navbarTextColor} hover:text-primary`}
                >
                  Mission
                </a>
              </div>
            </div>

            {/* Desktop Get Started Button - Hidden on mobile */}
            <div className="hidden md:block">
              <a
                href={isHomePage ? "#marketplaces" : "/#marketplaces"}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-shopstr-purple to-shopstr-yellow !text-white rounded-md hover:from-shopstr-purple/90 hover:to-shopstr-yellow/90 transition-all font-medium"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Hamburger Menu - Only visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden hamburger-icon transition-colors duration-300 ${navbarTextColor} hover:text-primary p-2`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Full-Screen Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col">
            {/* Menu Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <a
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img
                    src={shopstrLogo}
                    alt="Shopstr Markets Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900 hover:text-shopstr-purple transition-colors">
                  Shopstr Markets
                </span>
              </a>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 flex flex-col justify-center px-6 bg-white">
              <div className="flex flex-col space-y-8 text-center">
                {!isHomePage && (
                  <a
                    href="/"
                    className="text-2xl font-medium text-gray-700 hover:text-shopstr-purple transition-colors py-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </a>
                )}
                <a
                  href={isHomePage ? "#features" : "/#features"}
                  className="text-2xl font-medium text-gray-700 hover:text-shopstr-purple transition-colors py-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href={isHomePage ? "#marketplaces" : "/#marketplaces"}
                  className="text-2xl font-medium text-gray-700 hover:text-shopstr-purple transition-colors py-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplaces
                </a>
                <a
                  href={isHomePage ? "#technology" : "/#technology"}
                  className="text-2xl font-medium text-gray-700 hover:text-shopstr-purple transition-colors py-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Technology
                </a>
                <a
                  href={isHomePage ? "#mission" : "/#mission"}
                  className="text-2xl font-medium text-gray-700 hover:text-shopstr-purple transition-colors py-4 mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mission
                </a>
                <div className="pt-4 pb-12">
                  <a
                    href={isHomePage ? "#marketplaces" : "/#marketplaces"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-shopstr-purple to-shopstr-yellow text-white rounded-md hover:from-shopstr-purple/90 hover:to-shopstr-yellow/90 transition-all font-medium text-lg"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
