import React, { useEffect, useState } from "react";

import AboutSection from "../../home/Sections/AboutSection";
import logo340 from "../../../assets/tab/340clistings.png";
import { motion } from "framer-motion";
import AgentsSection from "../../home/Sections/AgentsSection";
import jollydog from "../../../assets/tab/Jolly-Dog.png";
import realtor from "../../../assets/tab/Realtor.png";
import zemi from "../../../assets/tab/Zemi.png";
import equal from "../../../assets/tab/equal.png";
import friendslogo from "../../../assets/tab/friendslogo.png";

const logos = [jollydog, zemi, equal, friendslogo, realtor];

const JumpingLogo = ({ src, index }) => {
  return (
    <motion.img
      src={src}
      alt={`Logo ${index}`}
      className="h-16 w-auto px-4 absolute"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * 200,
      }}
      animate={{
        x: [null, Math.random() * window.innerWidth],
        y: [null, Math.random() * 200],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 3 + Math.random() * 2,
        ease: "easeInOut",
        delay: index * 0.5,
      }}
    />
  );
};

const HomeTab = () => {
  return (
    <div>
      <AboutSection />
      {/* section */}
      <div className="w-full bg-gradient-to-r from-white via-blue-200 to-white py-16 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="lg:w-2/3 text-center lg:text-left space-y-5"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-blue-900 leading-snug">
              Licensed US Virgin Islands Real Estate Broker/Owner
            </h2>
            <p className="text-blue-800 text-lg font-medium">
              340 Real Estate Company – Property, Sales, and Management on St
              John, US Virgin Islands.
            </p>

            <div className="space-y-1 text-blue-700 text-base font-medium">
              <p className="text-lg font-semibold text-blue-900">
                340 Real Estate Company
              </p>
              <p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=PO+Box+766,+St+John,+VI+00831"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-blue-900 transition"
                >
                  PO Box 766, St John, VI 00831
                </a>
              </p>
              <p>
                <a
                  href="mailto:340realestateco@gmail.com"
                  className="hover:underline hover:text-blue-900 transition"
                >
                  340realestateco@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+13406436068"
                  className="hover:underline hover:text-blue-900 transition"
                >
                  340-643-6068
                </a>
              </p>
            </div>
          </motion.div>

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="lg:w-1/3 flex justify-center lg:justify-end"
          >
            <img
              src={logo340}
              alt="340 Real Estate Logo"
              className="w-48 h-auto object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </motion.div>
        </div>
      </div>

      {/* agents */}
      <AgentsSection />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-white via-blue-100 to-white pt-12 text-sm text-gray-700">
        {/* Animated Floating Logos */}
        <div className="relative h-48 overflow-hidden">
          {logos.map((logo, idx) => (
            <JumpingLogo key={idx} src={logo} index={idx} />
          ))}
        </div>

        {/* Contact Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-1 max-w-3xl mx-auto text-center text-gray-800"
        >
          <div className="text-center px-4 py-2 space-y-2 sm:space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2b4a9a] tracking-tight">
              340 Real Estate Company
            </h2>

            <p className="text-gray-700 text-lg sm:text-xl">
              St. John, US Virgin Islands
            </p>

            <p className="text-gray-800 font-medium">
              Residential &bull; Condos &bull; Land &bull; Commercial
            </p>

            <p className="italic text-gray-600 text-base">
              Rock Solid Island Wide Since 1978
            </p>

            <p className="text-blue-700 font-semibold text-lg sm:text-xl">
              340-643-6068 &nbsp;&middot;&nbsp; 340-779-4478
            </p>

            <p className="text-sm text-gray-500">
              Your Trusted Partner for St. John Real Estate
            </p>
          </div>
        </motion.div>

        {/* Bottom Info Bar */}
        <div className="bg-gradient-to-r from-white via-blue-100 to-white font-bold text-black text-center px-4 py-8 mt-16">
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-base sm:text-lg md:text-xl">
              Information on this site is believed to be accurate but not
              guaranteed.
            </p>

            <p className="text-base sm:text-lg md:text-xl">
              <span className="block sm:inline">340 Real Estate Co LLC</span> is
              a member of the
              <span className="block sm:inline">
                {" "}
                St. John Board of Realtors
              </span>
              ,
              <span className="block sm:inline">
                {" "}
                St. Thomas Board of Realtors
              </span>
              , and the
              <span className="block sm:inline">
                {" "}
                Multiple Listing Service.
              </span>
            </p>

            <p className="text-sm sm:text-base font-semibold">
              ©2025 340 Real Estate Co
            </p>

            <p className="text-sm sm:text-base italic text-gray-700 font-medium">
              Site by{" "}
              <a
                href="https://www.thewebsitesolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline"
              >
                The website Solutions
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeTab;
