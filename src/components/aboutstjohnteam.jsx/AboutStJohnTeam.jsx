import React from "react";
import aboutstHero from "../../assets/abouthero.jpg";

const AboutStJohnTeam = () => {
  return (
    <section className="w-full bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src={aboutstHero}
          alt="Search MLS Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            The 340 Real Estate Team
          </h1>
        </div>
      </div>
    </section>
  );
};

export default AboutStJohnTeam;
