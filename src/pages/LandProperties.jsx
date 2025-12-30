import React, { useState, useMemo, useCallback } from "react";
import LandProperty from "../components/land/LandProperty";
import LandSold from "../components/landsold/LandSold";
import { DollarSign, CheckCircle } from "lucide-react";
import LandHero from "../components/land/LandHero";

const LandProperties = () => {
  const [mainTab, setMainTab] = useState("sale");

  // Render content based on active tab
  const renderContent = () => {
    if (mainTab === "sale") {
      return <LandProperty />;
    } else {
      return <LandSold />;
    }
  };

  return (
    <div className="App relative scroll-smooth">
      {/* Hero Section */}
      <LandHero />

      {/* Professional Tab Container */}
      <div className="relative bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Main Tabs - 50-50 Screen Width with Individual Centering */}
          <div className="flex mb-8 relative">
            <div className="w-1/2 flex justify-center">
              <button
                onClick={useCallback(() => {
                  setMainTab("sale");
                }, [])}
                className={`relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                  mainTab === "sale"
                    ? "text-slate-800 border-b-2 border-slate-800"
                    : "text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300"
                }`}
              >
                <DollarSign className="w-6 h-6" />
                FOR SALE
              </button>
            </div>
            {/* Vertical Border in Middle */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent shadow-sm"></div>
            <div className="w-1/2 flex justify-center">
              <button
                onClick={useCallback(() => {
                  setMainTab("sold");
                }, [])}
                className={`relative flex items-center justify-center gap-3 px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                  mainTab === "sold"
                    ? "text-slate-800 border-b-2 border-slate-800"
                    : "text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300"
                }`}
              >
                <CheckCircle className="w-6 h-6" />
                RECENT SALES
              </button>
            </div>
          </div>

          {/* Top Border */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm mb-8"></div>

          {/* Middle Border - Divided into Two */}
          <div className="flex mb-8">
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
          </div>

          {/* Content Area */}
          <div className="relative max-w-7xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandProperties;
