import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TeamSection = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-gray-100 overflow-hidden">
      {/* Watermark logo in background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
        <img
          src="/images/logo.png"
          alt="Watermark logo"
          className="opacity-25 w-2/3 h-auto max-w-lg"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-8">
          Meet the 340 Real Estate St. John Team
        </h2>

        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>
            Our experienced team of brokers and sales agents is dedicated to
            helping you find the perfect property—whether it's a cozy condo,
            sprawling land, luxurious home, or commercial space. We work with
            all listings on the St. John MLS and offer Accredited Buyer
            Representative services to guide you every step of the way.
          </p>

          <p>
            Our website features a user-friendly, fully searchable database of
            all MLS listings, plus a robust archive of over 5,000 real estate
            sales dating back to 2009. You can explore historical trends by
            area, property type, or time frame—empowering you with the insights
            you need to make a smart investment.
          </p>

          <div className="bg-transparent rounded-2xl p-8 shadow-lg ">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Ready to Make the Move?
            </h3>
            <p className="text-gray-600 mb-6">
              Whether you're planning a weeklong getaway or a permanent
              relocation, we're here to help. With over 70 years of combined
              experience in St. John real estate, the 340 Real Estate team is
              ready to turn your island dream into reality.
            </p>

            <Link to="/about-340-realestate-team">
              <button className="inline-flex items-center px-8 py-4 bg-tropical-600 hover:bg-tropical-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group">
                Know More
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
