import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import realestate from "../../assets/realestateownership.jpeg";

const slides = [
  {
    title: "Real Estate Ownership in the U.S. Virgin Islands",
    image: realestate,
    content: `Ownership is held as “fee simple”, protected under the U.S. flag. There are no restrictions on investment purchases, nor obligations to build on vacant land within any set timeframe.`,
  },
  {
    title: "Property Taxes",
    image:
      "https://assets.telegraphindia.com/telegraph/2024/Dec/1733329794_tax.jpg",
    content: `Property taxes are low and based on purchase price:\n- Homes/Condos: 0.003770\n- Commercial: 0.007110\n- Timeshares: 0.014070\n- Land: 0.004946`,
  },
  {
    title: "Government Transfer Tax (Stamp Tax)",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    content: `Typically paid by seller unless negotiated:\n- 2% – up to $350,000\n- 2.5% – $350,001 to $1M\n- 3% – $1M to $5M\n- 3.5% – Over $5M`,
  },
  {
    title: "Financing",
    image:
      "https://media.istockphoto.com/id/1484779739/photo/real-estate-agents-recommend-interest-rates-discuss-the-terms-of-the-home-purchase-agreement.jpg?s=612x612&w=0&k=20&c=CON2qfAss2pApUZymNjkFQMlwdAEx2I5QW_qT5V8EpQ=",
    content: `Leeward Island Mortgage\n  CMG Home Loans\n Mortgage financing available via:\n- North Pointe\n- First Liberty Lending\n- Virgins Bay Mortgage\n\nBuyers cover:\n- Appraisal\n- Survey\n- Title Insurance\n- Attorney Fees`,
  },
  {
    title: "Insurance Requirements",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1600&q=80",
    content: `Hazard insurance is mandatoryhazard insurance is only mandatory if you have a mortgage
Under property types and market\n we have 82 homes +/-, 12 condos +/-, i get that it fluctuates but maybe but a +/- symbol next to the amount`,
  },
  {
    title: "Building Codes & Construction",
    image:
      "https://thumbs.dreamstime.com/b/house-under-construction-blueprints-building-project-53360048.jpg",
    content: `Standards include:\n- 110+ mph wind resistance\n- Earthquake Zone 4 compliance\n- ~$600+/sq.ft based on finish`,
  },
  {
    title: "Property Types & Market Snapshot",
    image:
      "https://img.freepik.com/premium-photo/house-growth-chart-real-estate-market-concept-generative-ai_609002-980.jpg",
    content: `• Residential: 73 listings ($399K–$12M+)\n• Condos: 14 listings ($525K–$1M+)\n• Land: 180+ parcels ($59K–$7.5M)\n• Commercial: Leaseholds & Biz Ops\n• Timeshares: Westin + others`,
  },
];

const OwnershipSection = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="bg-white py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -40 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl shadow-2xl overflow-hidden bg-white"
          >
            <div className="relative h-[55vh] md:h-[70vh] group">
              <img
                src={slides[index].image}
                alt={slides[index].title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 md:p-10 z-20">
                <h2 className="text-white text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                  {slides[index].title}
                </h2>
                <p className="text-white whitespace-pre-line text-sm md:text-base leading-relaxed max-w-3xl drop-shadow-md">
                  {slides[index].content}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-md"
            >
              <FaArrowLeft className="text-sm" />
              <span className="text-sm font-medium">Previous</span>
            </button>

            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-md"
            >
              <span className="text-sm font-medium">Next</span>
              <FaArrowRight className="text-sm" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === index ? "bg-gray-800 scale-110" : "bg-gray-400"
                } transition-transform duration-300`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnershipSection;
