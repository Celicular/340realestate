import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

const condosData = [
  {
    name: "Battery Hill",
    description:
      "Four three-story buildings just outside Cruz Bay with views of the harbor and St. Thomas. Two bedrooms one bath units and one studio unit. Shared pool.",
  },
  {
    name: "Bethany/Upper Deck",
    description:
      "Single and double units in masonry buildings with stunning views from South to West. Five-minute drive to Cruz Bay.",
  },
  {
    name: "Conch Villas",
    description:
      "Five one and two-bedroom hardwood units with views of Enighed Pond. Walking distance to Cruz Bay.",
  },
  {
    name: "Cruz Bay Villas",
    description:
      "Converted home with one-bedroom units on Pocket Money Hill. Great St. Thomas views, sunset, and a shared pool.",
  },
  {
    name: "Cruz Views",
    description:
      "Ten one-bedroom masonry units on Pocket Money Hill with shared pool and sunset views.",
  },
  {
    name: "Gallows Point",
    description:
      "Fifteen waterfront buildings with four one-bedroom units each. Shared pool and beach. Easy walk to town.",
  },
  {
    name: "Grande Bay",
    description:
      "One to three-bedroom units on Cruz Bay beach. Resort-style amenities including pool and gym. Walkable to town.",
  },
  {
    name: "Lavender Hill",
    description:
      "Two buildings with twelve one and two-bedroom units, harbor views, and a shared pool. Walkable to town.",
  },
  {
    name: "Palm & Mango Terrace",
    description:
      "Two and three-bedroom condos just outside Cruz Bay. Walking distance to town and Frank Bay beach.",
  },
  {
    name: "Pastory Estate",
    description:
      "Four buildings with thirteen condos and shared pool. Five minutes from Cruz Bay by car.",
  },
  {
    name: "Selene’s",
    description: "Six masonry studio units in the heart of Cruz Bay.",
  },
  {
    name: "Serendip",
    description:
      "Sunset views over St. Thomas from ten one-bedroom and studio condos just above Cruz Bay.",
  },
  {
    name: "Sirenusa",
    description:
      "Forty luxury condos with pool, gym, and game room overlooking Cruz Bay.",
  },
  {
    name: "Sunset Ridge",
    description:
      "Six two-bedroom units with timeshare ownership and splash pools. RCI affiliation. Incredible views.",
  },
  {
    name: "Villa Caribe",
    description:
      "Five condos with lap pool, lovely south views, just outside Cruz Bay. Walkable.",
  },
  {
    name: "Virgin Grand Villas",
    description:
      "Two seasonal homes with three bedrooms on Gift Hill. Gorgeous views of St. Thomas and sunset.",
  },
  {
    name: "Westin Vacation Club",
    description:
      "Studio to 3BR timeshares across from the Westin Resort. Access to pools and hotel facilities.",
  },
];

const CondosInfoGrid = () => {
  return (
    <section className="bg-[#ede4de] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-[#3c6a72] mb-12"
        >
          About the Different Areas of St. John – Condos
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {condosData.map((condo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3 text-[#3c6a72]">
                <FaMapMarkerAlt className="text-lg" />
                <h3 className="text-xl font-semibold">{condo.name}</h3>
              </div>
              <p className="text-[#3c6a72] text-sm leading-relaxed">
                {condo.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CondosInfoGrid;
