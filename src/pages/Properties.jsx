import React, { useState, useMemo, useCallback, useEffect } from "react";
import PropertiesHero from "./../components/properties/PropertiesHero";
import PropertiesForSale from "../components/properties/PropertiesForSale";
import SoldProperty from "../components/soldproperty/SoldProperty";
import { Home, DollarSign, CheckCircle, Crown, Building, TreePine } from "lucide-react";
import { getPortfolioItems } from "../firebase/firestore";
import SEOHead from "../components/SEO/SEOHead";

const Properties = () => {
  const [mainTab, setMainTab] = useState("sale");
  const [subTab, setSubTab] = useState("house");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch property types from Firestore for tab generation
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        const result = await getPortfolioItems('residential');
        if (result.success) {
          // Extract unique property types
          const types = new Set();
          result.data.forEach((property) => {
            if (property.subcategory) {
              types.add(property.subcategory);
            } else if (property.propertyType) {
              types.add(property.propertyType);
            }
          });
          const sortedTypes = Array.from(types).sort();
          setPropertyTypes(sortedTypes);
          
          // Set first type as default if available
          if (sortedTypes.length > 0 && !subTab) {
            setSubTab(sortedTypes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching property types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  const renderContent = () => {
    if (mainTab === "sale") {
      return <PropertiesForSale 
        selectedCategory={subTab}
      />;
    }
    if (mainTab === "sold") {
      return <SoldProperty />;
    }
  };

  // Memoize click handlers
  const handleSaleTabClick = useCallback(() => {
    setMainTab("sale");
    // Set the first available property type as default instead of "all"
    if (propertyTypes.length > 0) {
      setSubTab(propertyTypes[0]);
    }
  }, [propertyTypes]);

  const handleSoldTabClick = useCallback(() => {
    setMainTab("sold");
    setSubTab(""); // No sub-tab needed for sold
  }, []);

  // Memoize sub tabs with enhanced property type support
  const subTabs = useMemo(() => {
    if (mainTab === "sale") {
      const tabs = propertyTypes.map(propertyType => {
        // Enhanced icon mapping for different property types
        let icon = Building; // default
        let label = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
        
        switch(propertyType.toLowerCase()) {
          case 'villa':
            icon = Crown;
            break;
          case 'combo':
            icon = Building;
            label = 'Combo Properties';
            break;
          case 'cottage':
            icon = Home;
            break;
          case 'house':
            icon = Home;
            break;
          case 'condo':
            icon = Building;
            label = 'Condominiums';
            break;
          case 'apartment':
            icon = Building;
            break;
          case 'townhouse':
            icon = Building;
            label = 'Town Houses';
            break;
          case 'land':
            icon = TreePine;
            break;
          default:
            icon = Building;
        }
        
        return {
          id: propertyType,
          label: label,
          icon: icon,
        };
      });
      
      // Return only the property type tabs (no "All Properties" tab)
      return tabs;
    }
    return [];
  }, [mainTab, propertyTypes]);

  // Memoize sub tab click handler
  const handleSubTabClick = useCallback((tabId) => {
    setSubTab(tabId);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="App relative scroll-smooth">
        <PropertiesHero />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App relative scroll-smooth">
      <SEOHead
        title="Properties for Sale | 340 Real Estate St. John"
        description="Browse luxury properties for sale in St. John, USVI. Find your perfect home among our collection of villas, condos, and houses in paradise."
        keywords="St John properties for sale, USVI real estate, Virgin Islands properties, luxury homes St John, villas for sale, condos St John, houses USVI"
        canonicalUrl="https://340realestate.com/properties"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "340 Real Estate St. John",
          "description": "Luxury properties for sale in St. John, U.S. Virgin Islands",
          "url": "https://340realestate.com/properties",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "St. John",
            "addressRegion": "VI",
            "addressCountry": "US"
          },
          "areaServed": {
            "@type": "State",
            "name": "U.S. Virgin Islands"
          }
        }}
      />
      
      {/* Hero Section */}
      <PropertiesHero />

      {/* Professional Tab Container */}
      <div className="relative bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-4 py-8">
       

                     {/* Main Tabs - 50-50 Screen Width with Individual Centering */}
           <div className="flex mb-8 relative">
             <div className="w-1/2 flex justify-center">
               <button
                 onClick={handleSaleTabClick}
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
                 onClick={handleSoldTabClick}
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

                     {/* Sub Header */}
           {/* <div className="text-center mb-6">
             <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-2">
               {mainTab === "sale"
                 ? "Available for Sale"
                 : "Recent Sale Records"}
             </h2>
             <p className="text-slate-500 text-base">
               {mainTab === "sale"
                 ? "Browse properties and land currently available for purchase"
                 : "View records of recently sold properties and land"}
             </p>
           </div> */}

          {/* Sub Tabs - Dynamic grid layout for property types */}
          {mainTab === "sale" && subTabs.length > 0 && (
            <>
              {/* Property Type Tabs */}
              <div className="mb-10">
                <div className="grid grid-cols-2 md:grid-cols-3 justify-center lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {subTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleSubTabClick(tab.id)}
                      className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        subTab === tab.id
                          ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <tab.icon className={`w-6 h-6 ${subTab === tab.id ? "text-blue-600" : "text-slate-500"}`} />
                      <span className="text-sm font-medium text-center leading-tight">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm mb-8"></div>
            </>
          )}

          {/* Middle Border - Divided into Two */}
          <div className="flex mb-8">
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
            <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-sm"></div>
          </div>

                     {/* Content Area */}
           <div className="relative max-w-7xl mx-auto">
             <div className="bg-white rounded-xl overflow-hidden shadow-lg">
               <div className="p-6">
                 {renderContent()}
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Index exports for easy access
export { Properties };

// Export tab configurations for reuse
export const tabConfig = {
  mainTabs: [
    {
      id: "sale",
      label: "FOR SALE",
      icon: DollarSign,
    },
    {
      id: "sold",
      label: "RECENT SALES",
      icon: CheckCircle,
    },
  ],
};

// Export content mapping for reuse
export const contentMapping = {
  sale: {
    villa: "Villa Properties",
    combo: "Combo Properties", 
    cottage: "Cottage Properties",
    house: "House Properties",
    condo: "Condo Properties",
  },
  sold: {
    default: "SoldProperty",
  },
};

// Export default state values
export const defaultStates = {
  mainTab: "sale",
  subTab: "all", // Start with all properties
};

export default Properties;
