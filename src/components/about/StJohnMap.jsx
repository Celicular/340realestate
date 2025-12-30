import React, { useState } from "react";
import { motion } from "framer-motion";

const mapImages = [
  {
    label: "Illustrated Map",
    src: "https://i.pinimg.com/736x/1e/bb/ce/1ebbcec1215e56918f8940a310f6ee33.jpg",
  },
  {
    label: "Property Zones Map",
    src: "https://340realestatestjohn.com/wp-content/uploads/2024/07/340_MAP_TEMPLATE_V4.jpg",
  },
];

const StJohnMap = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          St. John Property & Area Maps
        </h2>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {mapImages.map((map, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-full  text-sm font-medium transition ${
                i === activeIndex
                  ? "bg-[#3c6a72] text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {map.label}
            </button>
          ))}
        </div>

        {/* Map Image */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl h-full overflow-hidden shadow-lg "
        >
          <img
            src={mapImages[activeIndex].src}
            alt={mapImages[activeIndex].label}
            className="w-full  object-contain"
          />
        </motion.div>

        <p className="mt-4 text-sm text-gray-500">
          Viewing: <strong>{mapImages[activeIndex].label}</strong>
        </p>
      </div>
    </section>
  );
};

export default StJohnMap;
