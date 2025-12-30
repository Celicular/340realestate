import React from "react";
import heroBg from "../../../assets/herebgsec.jpg";
import logo1 from "../../../assets/logo/logo1.png";
import logo2 from "../../../assets/logo/logo2.png";
import logo3 from "../../../assets/logo/logo3.png";
import logo4 from "../../../assets/logo/logo4.png";
import logo5 from "../../../assets/logo/logo5.png";

const HeroLogos = () => {
  const logos = [
    { src: logo1, alt: "Jolly Dog Logo", link: "https://www.thejollydog.com/" },
    { src: logo2, alt: "Zemi Logo", link: "https://www.zemistj.com/" },
    {
      src: logo3,
      alt: "Friends of Virgin Islands National Park",
      link: "https://friendsvinp.org/",
    },
    // {
    //   src: logo4,
    //   alt: "Equal Housing Opportunity",
    //   link: "https://www.hud.gov/program_offices/fair_housing_equal_opp",
    // },
    // {
    //   src: logo5,
    //   alt: "Realtor MLS Logo",
    //   link: "https://jollydog.shopsettings.com/",
    // },
  ];

  return (
    <section className="relative h-screen w-full text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury pool villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 drop-shadow">
          ST JOHN US VIRGIN ISLANDS
        </h2>
        <p className="uppercase font-semibold tracking-wider text-sm sm:text-lg mb-3">
          340 Real Estate Company
        </p>
        <p className="max-w-md sm:max-w-2xl text-xs sm:text-base mb-2 leading-relaxed px-2 sm:px-0">
          Offering residential, condos, land and commercial real estate on St
          John in the USVI — rock‑solid island wise since 1978.
        </p>
        <p className="mb-3 text-xs sm:text-sm font-medium tracking-wide">
          340‑643‑6068 | 340‑779‑4478
        </p>
        <h3 className="text-base sm:text-xl font-semibold mb-6 sm:mb-10">
          ST JOHN REAL ESTATE FOR SALE
        </h3>

        {/* Logos Section */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 px-2 animate-fade-in delay-300">
          {logos.map((logo, index) => (
            <a
              key={index}
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-3 sm:p-4 shadow-md w-[140px] sm:max-w-[140px] transition-all duration-300 transform hover:scale-105 hover:rotate-1 hover:shadow-xl flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroLogos;
