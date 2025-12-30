import React from "react";
import { motion } from "framer-motion";

const InsentiveHero = () => {
  return (
    <div>
      {/* 🖼 Hero Section with Overlay */}
      <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="St. John"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.4] scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 " />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <h1 className="text-white text-3xl md:text-5xl font-bold tracking-wide mb-4">
            Incentives
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-tropical-500 to-blue-400 rounded-full mb-4"></div>
          <p className="text-white text-lg md:text-2xl max-w-2xl font-light">
            Discover St. John: A Journey Through History, Nature, and Island
            Charm
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default InsentiveHero;
