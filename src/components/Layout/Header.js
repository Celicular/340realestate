import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getRentalProperties } from "../../firebase/firestore";
import { makeSlug } from "../../utils/slugify";
import logo from "../../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rentalProperties, setRentalProperties] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchRentalProperties = async () => {
      try {
        const result = await getRentalProperties({ status: "approved" });
        if (result.success) setRentalProperties(result.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentalProperties();
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutus" },
    { name: "About St. John", path: "/about" },

    {
    name: "Rentals",
    children: [
      { name: "--- Premium Villas ---", path: "#", disabled: true },

      ...(rentalProperties.length > 0
        ? rentalProperties.map((item) => {
            // ✅ SAFE DISPLAY NAME (UI ONLY)
            const safeName =
              item?.propertyInfo?.name?.trim() ||
              item?.property?.propertyInfo?.name?.trim() ||
              item?.title?.trim() ||
              `Property ${item?.id || ""}`;

            return {
              name: safeName,
              path: `/rental/${makeSlug(item)}`,
            };
          })
        : [
            {
              name: "Loading villas...",
              path: "#",
              disabled: true,
            },
          ]),
    ],
  },
   
    { name: "Testimonials", path: "/testimonial" },

    {
      name: "Property Search",
      children: [
        { name: "Residential", path: "/properties" },
        { name: "Land", path: "/landproperties" },
      ],
    },

    { name: "Sales History", path: "/saleshistory" },

    {
      name: "Attractions",
      children: [
        { name: "Reef Bay Trail", path: "https://www.nps.gov/thingstodo/reef-bay-trail.htm" },
        { name: "Explore St. John", path: "https://explorestj.com" },
        { name: "Videos", path: "/attraction/video" },
      ],
    },

    {
      name: "Blogs",
      children: [{ name: "Read Blogs", path: "/blogs" }],
    },

    { name: "Incentives", path: "/incentives" },
  ];

  const HamburgerIcon = ({ open }) => (
    <span className="inline-block transition-transform duration-300">
      {open ? <X size={32} /> : <Menu size={32} />}
    </span>
  );

  const renderMobileLink = (link, depth = 0) => {
    const hasChildren = link.children?.length > 0;
    const isOpen = openDropdowns[link.name];

    if (hasChildren) {
      return (
        <div key={link.name} className={`mb-3 ${depth > 0 ? "pl-4" : ""}`}>
          <button
            onClick={() => toggleDropdown(link.name)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-semibold hover:bg-[#f4eee9]"
            style={{ paddingLeft: `${depth * 16 + 16}px` }}
          >
            <span className="text-[#523d2c]">{link.name}</span>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isOpen && (
            <div className="mt-2 space-y-1">
              {link.children.map((child) => renderMobileLink(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    if (link.disabled) {
      return (
        <span
          key={link.name}
          className="block px-4 py-2 rounded-xl text-gray-400 cursor-not-allowed"
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          {link.name}
        </span>
      );
    }

    const isExternal = link.path.startsWith("http");

    if (isExternal) {
      return (
        <a
          key={link.name}
          href={link.path}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-3 rounded-xl text-[#523d2c] hover:bg-[#f4eee9]"
          onClick={() => setIsMenuOpen(false)}
        >
          {link.name}
        </a>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.path}
        onClick={() => setIsMenuOpen(false)}
        className={`block px-4 py-3 rounded-xl hover:bg-[#f4eee9] ${
          location.pathname === link.path
            ? "text-[#a67c52] font-bold"
            : "text-[#523d2c]"
        }`}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
      >
        {link.name}
      </Link>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-500 ${
          isScrolled ? "bg-[#fbf9f8] shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LEFT NAV */}
            <nav className="hidden lg:flex gap-x-2 uppercase">
              <div className="relative group">
                <span
                  className={`cursor-pointer font-barlow text-sm px-2 py-1 ${
                    isScrolled ? "text-[#3c6a72]" : "text-white"
                  }`}
                >
                  Property Search
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50">
                  <Link to="/properties" className="block px-4 py-2 hover:bg-blue-50">
                    Residential
                  </Link>
                  <Link to="/landproperties" className="block px-4 py-2 hover:bg-blue-50">
                    Land
                  </Link>
                </div>
              </div>

              <Link to="/aboutus" className={`${isScrolled ? "text-[#3c6a72]" : "text-white"} font-barlow text-sm px-2 py-1`}>
                About Us
              </Link>

              <Link to="/about" className={`${isScrolled ? "text-[#3c6a72]" : "text-white"} font-barlow text-sm px-2 py-1`}>
                About St. John
              </Link>
            </nav>

            {/* LOGO */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="flex items-center space-x-3">
                <img src={logo} alt="340 Real Estate" className="h-16 w-auto" />
                <h1 className="text-xl font-bold uppercase" style={{ color: isScrolled ? "#2d3a3a" : "white" }}>
                  340 Real Estate
                </h1>
              </Link>
            </div>

            {/* RIGHT NAV */}
            <div className="hidden lg:flex items-center gap-x-2">
              <div className="relative group">
                <span
                  className={`cursor-pointer uppercase text-sm px-2 py-1 ${
                    isScrolled ? "text-[#3c6a72]" : "text-white"
                  }`}
                >
                  Rentals
                </span>

                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 rounded-lg">
                  <div className="bg-gray-50 px-3 py-2 border-b">
                    <span className="text-xs font-semibold uppercase">Premium Villas</span>
                  </div>

                  {rentalProperties.length > 0 ? (
                    rentalProperties.map((item) => {
                      const slug = makeSlug(item);
                      return (
                        <Link
                          key={item.id}
                          to={`/rental/${slug}`}
                          className="block px-4 py-2 hover:bg-blue-50 border-b"
                        >
                          {item.propertyInfo?.name || item.property.propertyInfo?.name}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">Loading...</div>
                  )}
                </div>
              </div>

              <Link to="/testimonial" className={`${isScrolled ? "text-[#3c6a72]" : "text-white"} uppercase text-sm px-2 py-1`}>
                Testimonial
              </Link>

              <a href="tel:+13406436068" className={`${isScrolled ? "text-[#3c6a72]" : "text-white"} text-sm px-2 py-1`}>
                +1 340-643-6068
              </a>
            </div>

            {/* MOBILE BUTTON */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${isScrolled ? "text-[#3c6a72]" : "text-white"}`}>
              <HamburgerIcon open={isMenuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[90]" onClick={() => setIsMenuOpen(false)} />

          <div className="fixed top-0 right-0 h-full w-[85vw] bg-[#fefaf6] shadow-2xl z-[100] flex flex-col border-l">
            <div className="flex items-center justify-between px-6 py-6 border-b">
              <span className="text-2xl font-bold text-[#2d1f15]">St John</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full">
                <X size={28} className="text-[#2d1f15]" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => renderMobileLink(link))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
