import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, SearchIcon } from "lucide-react";

const SearchMLSTab = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setResults([
      {
        id: 1,
        title: "Ocean View Villa",
        location: "Chocolate Hole",
        price: "$1.2M",
      },
      {
        id: 2,
        title: "Coral Bay Cottage",
        location: "Coral Bay",
        price: "$850K",
      },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="relative flex-1">
          <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter location, MLS, or property type"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
        <button
          type="submit"
          className="flex items-center bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <SearchIcon className="w-5 h-5 mr-2" />
          Search
        </button>
      </motion.form>

      {/* 🧭 Embedded FlexMLS Page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Live Listings From FlexMLS
        </h2>
        <div className="w-full h-[700px] border-2 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://my.flexmls.com/tameladonnelly/search/idx_links/20211211180913981114000000/listings"
            title="FlexMLS Listings"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* (Optional) Search Results if needed */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {results.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold">{prop.title}</h3>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {prop.location}
              </p>
              <p className="text-green-700 font-bold mt-2">{prop.price}</p>
              <button className="mt-4 inline-block text-sm text-blue-600 hover:underline">
                View Property Details
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchMLSTab;
