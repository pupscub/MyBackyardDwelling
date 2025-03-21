import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/theme-provider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to scroll to a section on the homepage
  const scrollToSection = (sectionId, e) => {
    e.preventDefault();
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Need a slight delay to ensure the page loads before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on the homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Close mobile menu if it's open
    setIsOpen(false);
  };

  const navLinks = [
    { 
      name: "Features", 
      path: "/#features",
      onClick: (e) => scrollToSection('features', e)
    },
    { name: "How It Works", 
      path: "/how-it-works",
      onClick: (e) => scrollToSection('how-it-works', e)
    },
    { name: "Success Stories", 
      path: "/success-stories",
      onClick: (e) => scrollToSection('success-stories', e)
     },
    { name: "Resources", 
      path: "/resources",
      onClick: (e) => scrollToSection('Resources', e)
     },
    { name: "FAQ", 
      path: "/faq"
     },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled 
          ? isDarkTheme 
            ? "py-3 bg-navy/90 backdrop-blur shadow-subtle" 
            : "py-3 bg-white/90 backdrop-blur shadow-subtle"
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center transition-standard hover:opacity-90"
          aria-label="MyBackyardDwelling Home"
        >
          <div className="flex items-center">
            <img 
              src="/house-icon.svg" 
              alt="MyBackyardDwelling Logo" 
              className="h-10 md:h-12 mr-3"
            />
            <span className={cn(
              "hidden md:block text-xl font-semibold font-display",
              isDarkTheme ? "text-white" : "text-gray-800"
            )}>
              MyBackyard<span className="text-sunnyellow">Dwelling</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            link.onClick ? (
              <a
                key={link.name}
                href={link.path}
                onClick={link.onClick}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-standard cursor-pointer",
                  isDarkTheme 
                    ? "text-gray-200 hover:text-sunnyellow" 
                    : "text-gray-700 hover:text-sunnyellow"
                )}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-standard",
                  isDarkTheme 
                    ? "text-gray-200 hover:text-sunnyellow" 
                    : "text-gray-700 hover:text-sunnyellow"
                )}
              >
                {link.name}
              </Link>
            )
          ))}
          <Link
            to="/contact#get-in-touch"
            className="ml-4 px-6 py-2.5 rounded-full bg-sunnyellow text-gray-800 font-medium text-sm transition-standard hover:bg-sunnyellow/90 hover:shadow-md"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex md:hidden focus:outline-none",
            isDarkTheme ? "text-white" : "text-gray-800"
          )}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 md:hidden backdrop-blur",
          "transition-all duration-300 ease-in-out overflow-hidden border-t",
          isDarkTheme 
            ? "bg-navy/95 border-gray-700" 
            : "bg-white/95 border-gray-200",
          isOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-5 space-y-3">
          {navLinks.map((link) => (
            link.onClick ? (
              <a
                key={link.name}
                href={link.path}
                onClick={link.onClick}
                className={cn(
                  "block px-4 py-3 rounded-md transition-standard cursor-pointer",
                  isDarkTheme 
                    ? "text-gray-200 hover:bg-gray-800" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block px-4 py-3 rounded-md transition-standard",
                  isDarkTheme 
                    ? "text-gray-200 hover:bg-gray-800" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          <Link
            to="/contact#get-in-touch"
            className="block px-4 py-3 text-center rounded-md bg-sunnyellow text-gray-800 font-medium transition-standard hover:bg-sunnyellow/90"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
