import React from "react";
import { motion } from "framer-motion";
import img1 from "../../../assets/slh1.jpeg";
import img2 from "../../../assets/slh2.jpeg";
import img3 from "../../../assets/slh3.jpg";
import img4 from "../../../assets/slh4.jpg";

const sections = [
  {
    title: "St. John Facts",
    content: `Size: 20 square miles – 7 miles long, 3 miles wide.\nHighest Point: Bordeaux Mountain 1,277 ft above sea level.\nIn 1917, the United States purchased St. John from Denmark. By the 1930s, the island began attracting tourism interest from the U.S. mainland.`,
    image: img1,
  },
  {
    title: "A National Treasure",
    content: `In 1956, Laurence Rockefeller donated 5,000 acres to establish Virgin Islands National Park, now spanning 7,200 land acres and 5,600 underwater.\nNo passport needed for U.S. citizens. From eco-camping to luxury, St. John is for everyone — with accessible beaches like Trunk Bay.`,
    image: img2,
  },
  {
    title: "Real Estate & Ownership",
    content: `Ownership is "fee simple" under U.S. law. Property taxes:\n• Homes/Condos: 0.003770\n• Commercial: 0.007110\n• Timeshares: 0.014070\n• Land: 0.004946\nTransfer Tax:\n• 2% up to $350K\n• 3.5% above $5M`,
    image: img3,
  },
  {
    title: "Market Snapshot",
    content: `• Residential: $399K – $12M+\n• Condos: From $525K\n• Land: $50K – $7.5M\n• Timeshare: 98+ options\nFinancing available. Construction must meet hurricane/earthquake codes. Avg build cost: $600+/sq ft.`,
    image: img4,
  },
];

const AboutStJohnTab = () => {
  return (
    <section className="px-4 py-12 max-w-6xl mx-auto text-gray-800">
      <h1 className="text-4xl font-bold text-center text-[#2b4a9a] mb-12">
        Discover Beautiful About St. John
      </h1>

      {sections.map((section, idx) => {
        const isEven = idx % 2 === 0;

        return (
          <motion.div
            key={idx}
            className={`flex flex-col md:flex-row ${
              isEven ? "" : "md:flex-row-reverse"
            } items-center gap-8 mb-16`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            {/* Image */}
            <img
              src={section.image}
              alt={section.title}
              className="w-full md:w-1/2 h-64 sm:h-80 object-cover rounded-xl shadow-lg hover:scale-105 transition duration-500"
            />

            {/* Content */}
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl font-semibold text-blue-800">
                {section.title}
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base sm:text-lg">
                {section.content}
              </p>
            </div>
          </motion.div>
        );
      })}

      <p className="mt-10 text-center italic text-sm text-gray-600">
        Whether you're seeking investment or paradise, St. John welcomes you
        with open arms.
      </p>
    </section>
  );
};

export default AboutStJohnTab;
