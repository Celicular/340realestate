import React from "react";
import { motion } from "framer-motion";
import { Search, Home, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MLSSearchSection = () => {
  const navigate = useNavigate();

  const handleSearchMLSClick = () => {
    navigate("/mls");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4"
          >
            Search MLS Listings
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Discover the finest properties in St. John, USVI. Browse our comprehensive MLS database featuring luxury homes, condos, land, and commercial properties.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Comprehensive Property Database
                </h3>
                <p className="text-gray-600">
                  Access the complete MLS database with residential homes, luxury villas, condos, and land parcels across St. John.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Prime Locations
                </h3>
                <p className="text-gray-600">
                  Explore properties in Cruz Bay, Coral Bay, Chocolate Hole, and other prestigious areas of St. John.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Advanced Search Tools
                </h3>
                <p className="text-gray-600">
                  Filter by price, property type, location, and amenities to find your perfect piece of paradise.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your Property Search
              </h3>
              <p className="text-gray-600 mb-6">
                Access our live MLS database and discover available properties in St. John, USVI. From beachfront estates to hillside retreats, find your dream property today.
              </p>
            </div>

            <button
              onClick={handleSearchMLSClick}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Search MLS Listings
              <Search className="inline-block w-5 h-5 ml-2" />
            </button>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">25+</div>
                <div className="text-sm text-gray-600">Areas Covered</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: "Luxury Homes", count: "150+", color: "blue" },
            { title: "Condominiums", count: "80+", color: "green" },
            { title: "Land Parcels", count: "120+", color: "purple" },
            { title: "Commercial", count: "25+", color: "orange" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`text-3xl font-bold text-${item.color}-600 mb-2`}>
                {item.count}
              </div>
              <div className="text-gray-700 font-medium">{item.title}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MLSSearchSection;