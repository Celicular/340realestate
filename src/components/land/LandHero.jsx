import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import image1 from "../../assets/villa/stilwater/image15.jpg";
// import image2 from "../../assets/villa/ripple/ripple.JPEG";

import image1 from "../../assets/herosale/image1.webp";
import image2 from "../../assets/herosale/image2.webp";
import image3 from "../../assets/herosale/image3.webp";
import image4 from "../../assets/herosale/image4.webp";
import image5 from "../../assets/herosale/image5.webp";
import image6 from "../../assets/herosale/image6.webp";
import image7 from "../../assets/herosale/image7.webp";
import image8 from "../../assets/herosale/image8.webp";
import image9 from "../../assets/herosale/image9.webp";
import image10 from "../../assets/herosale/image10.webp";
import image11 from "../../assets/herosale/image11.webp";
import image12 from "../../assets/herosale/image12.webp";

const carouselImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  image12,
];

const LandHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* 🏠 Properties Hero Section with Carousel Background */}
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        {/* Carousel Images as background */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence>
            <motion.img
              key={current}
              src={carouselImages[current]}
              alt={`Slide ${current + 1}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            Our Land Portfolio
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-4" />
          <p className="text-white text-lg md:text-2xl max-w-2xl font-light">
            Discover luxurious Land across St. John.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LandHero;
