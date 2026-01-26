import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About St. John", to: "/about" },
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Contact", to: "/contact" },
    { name: "Terms of Use", to: "/termuse" },
  ];

  const services = [
    { name: "Sales History", to: "/saleshistory" },
    { name: "For Sale", to: "/properties" },
  ];

  const legalLinks = [];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/340realestateco/",
      label: "Facebook",
      bg: "hover:bg-[#1877F2]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/340realestateco/",
      label: "Instagram",
      bg: "hover:bg-[#E4405F]",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/13406436068",
      label: "WhatsApp",
      bg: "hover:bg-[#25D366]",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/channel/UCXXXXXX",
      label: "YouTube",
      bg: "hover:bg-[#FF0000]",
    },
    {
      icon:FaTwitter,
      href: "https://x.com/340realestateco",
      label: "X (Twitter)",
      bg: "hover:bg-[#1DA1F2]",
    }
  ];

  return (
    <footer className="bg-[#3c6a72] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={logo}
                alt="340 Real Estate logo"
                className="w-auto h-20"
                loading="lazy"
              />
              <h3 className="text-2xl font-bold text-white">340 Real Estate</h3>
            </div>
            <p className="leading-relaxed mb-6 max-w-lg">
              In 1917 the United States bought St. John from Denmark. By the
              1930s, news of the beautiful American island quickly spread...
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="text-tropical-400 mt-0.5" size={18} />
                <span>
                  340 Real Estate Company, PO Box 766, St John, VI 00831
                </span>
              </div>

              {/* Clickable Phone Numbers */}
              <div className="flex items-center gap-3 flex-wrap">
                <Phone className="text-tropical-400" size={18} />
                <a
                  href="tel:+13406436068"
                  className="hover:text-tropical-400 transition underline"
                >
                  +1 340-643-6068
                </a>
                <span className="hidden sm:inline">|</span>
                <a
                  href="tel:+13407794478"
                  className="hover:text-tropical-400 transition underline"
                >
                  +1 340-779-4478
                </a>
              </div>

              {/* Clickable Email */}
              <div className="flex items-center gap-3">
                <Mail className="text-tropical-400" size={18} />
                <a
                  href="mailto:340realestateco@gmail.com"
                  className="hover:text-tropical-400 transition underline"
                >
                  340realestateco@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-100 hover:text-tropical-400 transition duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.to}
                    className="text-gray-300 hover:text-tropical-400 transition duration-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 mb-[-10]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-xs text-center md:text-left">
              Information on this site is believed to be accurate but not
              guaranteed. 340 Real Estate Co LLC is a member of the St. John
              Board of Realtors, St Thomas Board of Realtors and the Multiple
              Listing Service.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-sm text-center md:text-left">
              © 2025 340 Real Estate St. John. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition transform hover:scale-110 ${social.bg}`}
                >
                  <social.icon className="text-white" size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6 text-sm text-gray-400">
            {legalLinks.map((item, i) => (
              <React.Fragment key={item.name}>
                <Link
                  to={item.to}
                  className="hover:text-tropical-400 transition duration-300"
                >
                  {item.name}
                </Link>
                {i !== legalLinks.length - 1 && (
                  <span className="hidden sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;