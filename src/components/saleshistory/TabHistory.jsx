import React, { useState } from "react";
import HomeTab from "./tab/HomeTab";
import AboutStJohnTab from "./tab/AboutStJohnTab";
import VillaRentalsTab from "./tab/VillaRentalsTab";
import TestimonialsTab from "./tab/TestimonialsTab";
import SalesHistoryTab from "./tab/SalesHistoryTab";
import SearchMLSTab from "./tab/SearchMLS";

// Images
import homeIcon from "../../assets/tab/Home.png";
import aboutIcon from "../../assets/tab/about_stj.jpg";
import testimonialsIcon from "../../assets/tab/testimonials.jpg";
import villaIcon from "../../assets/tab/villa_rentals.jpg";
import salesIcon from "../../assets/tab/sales_history.jpg";
import searchIcon from "../../assets/tab/search_mls.jpg";

const TabHistory = () => {
  const tabs = [
    { icon: homeIcon, alt: "Home", component: <HomeTab /> },
    { icon: aboutIcon, alt: "About St John", component: <AboutStJohnTab /> },
    {
      icon: testimonialsIcon,
      alt: "Testimonials",
      component: <TestimonialsTab />,
    },
    { icon: villaIcon, alt: "Villa Rentals", component: <VillaRentalsTab /> },
    { icon: salesIcon, alt: "Sales History", component: <SalesHistoryTab /> },
    { icon: searchIcon, alt: "Search MLS", component: <SearchMLSTab /> },
  ];

  const [activeTab, setActiveTab] = useState(4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Circle Tab Bar */}
      {/* <div className="flex flex-wrap justify-center gap-20 mb-10">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg ${
                activeTab === index
                  ? "border-blue-600 scale-110"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <img
                src={tab.icon}
                alt={tab.alt}
                className={`w-8 h-8 object-contain transition-transform duration-300 ${
                  activeTab === index ? "scale-110" : "scale-100"
                }`}
              />
            </div>
            <span
              className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === index
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-blue-500"
              }`}
            >
              {tab.alt}
            </span>
          </button>
        ))}
      </div> */}

      {/* Tab Content */}
      <div className="bg-white border shadow-md rounded-2xl p-6 animate-fadeIn">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default TabHistory;
