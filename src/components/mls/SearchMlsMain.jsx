import React from "react";
import mlsHero from "../../assets/abouthero.jpg";

const SearchMlsMain = () => {
  return (
    <section className="w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <img
          src={mlsHero}
          alt="Search MLS Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Search MLS
          </h1>
          <p className="text-base sm:text-lg max-w-2xl leading-relaxed">
            Offering residential, condos, land & commercial real estate on St.
            John in the US Virgin Islands.
          </p>
        </div>
      </div>

      {/* Embedded MLS Page */}
      <div className="mt-10 w-full px-4 sm:px-8">
        <iframe
          src="https://my.flexmls.com/tameladonnelly/search/idx_links/20211211180913981114000000/listings"
          title="MLS Search Listings"
          className="w-full min-h-[90vh] border rounded-lg shadow-lg"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default SearchMlsMain;
