import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import contacthero from "../../../assets/contacthero.jpg";
import listing from "../../../assets/tab/340clistings.png";
import mls from "../../../assets/logo/logo4.png";
import equal from "../../../assets/logo/logo5.png";
import abr from "../../../assets/logo/abr.png";

const ContactSection = () => {
  // Array of sticker images with alt text for accessibility
  const stickers = [
    // { src: listing, alt: "340c Featured Listing" },
    { src: mls, alt: "MLS Logo" },
    { src: equal, alt: "Equal Housing Logo" },
    { src: abr, alt: "abr" },
  ];

  return (
    <section id="contact" className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={contacthero}
          alt="St. John Office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          {/* Left Text Section */}
          <div className="text-white lg:w-1/2 text-left">
            <h2 className="text-3xl lg:text-5xl font-normal mb-6 leading-snug uppercase">
              licensed us virgin islands real estate broker / owner / ABR®
            </h2>
            <p className="text-lg lg:text-xl font-normal uppercase text-white/90 leading-relaxed max-w-xl">
              340 Real Estate Company Property, Sales, and Management on St John
              US Virgin Islands.
            </p>
          </div>

          {/* Right Contact Card */}
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tropical-100 rounded-full flex items-center justify-center">
                    <MapPin className="text-tropical-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Office Address
                    </h4>
                    <p className="text-gray-600">
                      340 Real Estate Company
                      <br />
                      PO Box 766
                      <br />
                      St John, VI 00831
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tropical-100 rounded-full flex items-center justify-center">
                    <Mail className="text-tropical-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Email Address
                    </h4>
                    <a
                      href="mailto:340realestateco@gmail.com"
                      className="text-tropical-600 hover:text-tropical-700 transition"
                    >
                      340realestateco@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-tropical-100 rounded-full flex items-center justify-center">
                    <Phone className="text-tropical-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Phone Number
                    </h4>
                    <a
                      href="tel:+13406436068"
                      className="text-tropical-600 hover:text-tropical-700 transition"
                    >
                      +1 340-643-6068
                    </a>
                  </div>
                </div>

                {/* Stickers Section */}
                <div className="pt-6 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-7">
                  {stickers.map((sticker, index) => (
                    <img
                      key={index}
                      src={sticker.src}
                      alt={sticker.alt}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
