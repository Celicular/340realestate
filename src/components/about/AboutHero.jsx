import React from "react";
import { motion } from "framer-motion";
import abouthero from "../../assets/abouthero.jpg";

const AboutHero = () => {
  return (
    <div>
      {/* 🖼 Hero Section with Overlay */}
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <img
          src={abouthero}
          alt="St. John"
          className="absolute inset-0 w-full h-full object-cover object-center  scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/40 " />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            About St. John, Virgin Islands
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
          <p className="text-white text-lg md:text-2xl max-w-2xl font-light">
            Discover St. John: A Journey Through History, Nature, and Island
            Charm
          </p>
        </motion.div>
      </section>

      {/* 📜 Informational Section with Logo Watermark */}
      <section
        className="relative bg-[#ede4de] max-w-6xl mx-auto px-4 py-16 space-y-16"
        style={{
          backgroundImage: "url('/images/logo.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "50%",
        }}
      >
        {/* Soft overlay to improve readability */}
        <div className="absolute inset-0 bg-white/90  z-15 rounded-xl" />

        <div className="relative z-10 space-y-16">
          {/* 📌 Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
              St. John, Virgin Islands Real Estate
            </h2>
            <p className="text-gray-500 text-lg">
              A Historical Journey and Modern Paradise
            </p>
          </motion.div>

          {/* 📌 Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 text-gray-700"
          >
            <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
              <li>
                <strong>Size:</strong> 20 square miles – 7 miles long, 3 miles
                wide.
              </li>
              <li>
                <strong>Highest Point:</strong> Bordeaux Mountain – 1,277 ft
                above sea level
              </li>
              <li>
                <strong>Map of St. John</strong>
              </li>
            </ul>
            <div className="text-sm text-gray-500 italic leading-relaxed">
              real estate companies in st john in US virgin islands, real estate
              for sale in st John US virgin islands, real estate for sale in st
              thomas virgin islands, real estate for sale in the virgin islands,
              real estate for sale st john usvi, real estate news, caribbean
              real estate, rentals & more.
            </div>
          </motion.div>

          {/* 📌 Historical Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6 text-gray-800 leading-relaxed"
          >
            <h3 className="text-2xl font-semibold text-tropical-600">
              A Historical Journey and Modern Paradise
            </h3>
            <p>
              St. John became part of the United States in 1917 when it was
              purchased from Denmark. However, it wasn’t until the 1930s that
              word of this tropical paradise began to reach mainland America.
              This marked the beginning of a tourism era that would eventually
              blossom into a thriving industry.
            </p>
            <p>
              A pivotal moment came in 1956 when conservationist and
              philanthropist Laurance S. Rockefeller donated a significant
              portion of St. John to the U.S. Federal Government, forming the
              Virgin Islands National Park—initially 5,000 acres of protected
              land.
            </p>
            <p>
              Rockefeller’s donation was accepted by Secretary of the Interior
              Fred Seaton, who declared:
              <em className="text-gray-600">
                “The government will take care of this sacred soil—these green
                hills, valleys, and flaming miles. Take good, proper,
                Christ-like care!”
              </em>
            </p>
            <p>
              Since then, the park has expanded to over 7,200 acres of land and
              5,600 acres of marine habitat, preserving nearly 56,500 acres of
              beauty and biodiversity.
            </p>
          </motion.div>

          {/* 📌 Modern Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6 text-gray-800 leading-relaxed"
          >
            <h3 className="text-2xl font-semibold text-tropical-600">
              Modern-Day St. John: Accessible, Accommodating, and Awe-Inspiring
            </h3>
            <p>
              One of the best parts? U.S. citizens don’t need a passport to
              visit. Whether you prefer rustic campgrounds or luxury resorts,
              St. John offers accommodations for every traveler.
            </p>
            <p>
              The island also boasts accessible beaches like Trunk
              Bay—frequently ranked among the most beautiful in the Caribbean
              and the world.
            </p>
            <p>
              Today, St. John is more than just a tropical escape—it’s a shining
              example of nature preserved, history honored, and paradise made
              accessible to all.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutHero;
