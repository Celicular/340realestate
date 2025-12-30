// ============================================================================
// LEGACY HARDCODED DATA - COMMENTED OUT
// ============================================================================
// This file contains hardcoded property data that is no longer used.
// The application now exclusively uses backend data from Firestore.
// Keeping this commented out for reference only.
// ============================================================================

/* 
// Image imports - Combo Package (separate from individual tabs)
import comboStillwater1 from "../assets/villa/stilwater/image15.jpg";
import comboRipple1 from "../assets/villa/ripple/ripple.JPEG";
import comboStillwater2 from "../assets/villa/stilwater/image16.jpg";
import comboRipple2 from "../assets/villa/ripple/ripple1.JPEG";
import comboStillwater3 from "../assets/villa/stilwater/image17.jpg";

import comboStillwater4 from "../assets/villa/stilwater/image18.jpg";
import comboStillwater5 from "../assets/villa/stilwater/image19.jpg";

// Image imports - Still Water Only (completely separate)
import stillwater1 from "../assets/villa/stilwater/image15.jpg";
import stillwater2 from "../assets/villa/stilwater/image16.jpg";
import stillwater3 from "../assets/villa/stilwater/image17.jpg";
import stillwater4 from "../assets/villa/stilwater/image18.jpg";
import stillwater5 from "../assets/villa/stilwater/image19.jpg";

// Image imports - Ripple Only (completely separate)
import ripple1 from "../assets/villa/ripple/ripple.JPEG";

import ripple4 from "../assets/villa/ripple/ripple3.jpg";
import ripple5 from "../assets/villa/ripple/ripple4.jpg";
import ripple6 from "../assets/villa/ripple/ripple5.jpg";
import ripple7 from "../assets/villa/ripple/ripple6.jpg";
import ripple8 from "../assets/villa/ripple/ripple7.jpg";
import ripple9 from "../assets/villa/ripple/ripple8.jpg";
import ripple10 from "../assets/villa/ripple/ripple9.jpg";
import ripple11 from "../assets/villa/ripple/ripple10.jpg";
import ripple12 from "../assets/villa/ripple/ripple11.jpg";
import ripple13 from "../assets/villa/ripple/ripple12.jpg";
import ripple14 from "../assets/villa/ripple/ripple13.jpg";
import ripple15 from "../assets/villa/ripple/ripple14.jpg";
import ripple16 from "../assets/villa/ripple/ripple15.jpg";

// double vision
import dv1 from "../assets/villa/doublevision/dv1.jpg";
import db2 from "../assets/villa/doublevision/db2.jpg";
import db3 from "../assets/villa/doublevision/db3.jpg";
import db4 from "../assets/villa/doublevision/db4.jpg";
import db5 from "../assets/villa/doublevision/db5.jpg";
import db6 from "../assets/villa/doublevision/db6.jpg";
import db7 from "../assets/villa/doublevision/db7.jpg";
import db8 from "../assets/villa/doublevision/db8.jpg";
import db9 from "../assets/villa/doublevision/db9.jpg";

// casa amor
import casa1 from "../assets/villa/casa-amor/casa1.jpg";
import casa2 from "../assets/villa/casa-amor/casa2.jpg";
import casa3 from "../assets/villa/casa-amor/casa3.jpg";
import casa4 from "../assets/villa/casa-amor/casa4.jpeg";
import casa5 from "../assets/villa/casa-amor/casa5.jpeg";
import casa6 from "../assets/villa/casa-amor/casa6.jpeg";
import casa7 from "../assets/villa/casa-amor/casa7.jpeg";

import mang1 from "../assets/villa/moonglow/mang1.JPEG";
import mang2 from "../assets/villa/moonglow/mang2.JPEG";
import mang3 from "../assets/villa/moonglow/mang3.jpg";
import mang4 from "../assets/villa/moonglow/mang4.jpg";
import mang5 from "../assets/villa/moonglow/mang5.jpg";
import mang6 from "../assets/villa/moonglow/mang6.jpg";
import mang7 from "../assets/villa/moonglow/mang7.jpg";
import mang8 from "../assets/villa/moonglow/mang8.jpg";
import mang9 from "../assets/villa/moonglow/mang9.jpg";
import mang10 from "../assets/villa/moonglow/mang10.jpg";
import mang11 from "../assets/villa/moonglow/mang11.jpg";
import mang12 from "../assets/villa/moonglow/mang12.jpg";
import mang13 from "../assets/villa/moonglow/mang13.jpg";
import mang14 from "../assets/villa/moonglow/mang14.jpg";
import mang15 from "../assets/villa/moonglow/mang15.jpg";
import mang16 from "../assets/villa/moonglow/mang16.jpg";
import mang17 from "../assets/villa/moonglow/mang17.jpg";
import mang18 from "../assets/villa/moonglow/mang18.jpg";
import mang19 from "../assets/villa/moonglow/mang19.jpg";
import mang20 from "../assets/villa/moonglow/mang20.jpg";
import mang21 from "../assets/villa/moonglow/mang21.jpg";
import mang22 from "../assets/villa/moonglow/mang22.jpg";
import mang23 from "../assets/villa/moonglow/mang23.jpg";
import mang24 from "../assets/villa/moonglow/mang24.jpg";
import mang25 from "../assets/villa/moonglow/mang25.jpg";
import mang26 from "../assets/villa/moonglow/mang26.jpg";

// winddiva
import wind1 from "../assets/villa/wind/wind1.jpg";
import wind2 from "../assets/villa/wind/wind2.jpg";
import wind3 from "../assets/villa/wind/wind3.jpg";
import wind4 from "../assets/villa/wind/wind4.jpg";
import wind5 from "../assets/villa/wind/wind5.jpg";
import wind6 from "../assets/villa/wind/wind6.jpg";
import wind7 from "../assets/villa/wind/wind7.jpg";

// baytree
import bay1 from "../assets/villa/baytree/bay1.jpg";
import bay2 from "../assets/villa/baytree/bay2.jpg";
import bay3 from "../assets/villa/baytree/bay3.jpg";
import bay4 from "../assets/villa/baytree/bay4.jpg";
import bay5 from "../assets/villa/baytree/bay5.jpg";
import bay6 from "../assets/villa/baytree/bay6.jpg";
import bay7 from "../assets/villa/baytree/bay7.jpg";
import bay8 from "../assets/villa/baytree/bay8.jpg";
import bay9 from "../assets/villa/baytree/bay9.jpg";
import bay10 from "../assets/villa/baytree/bay10.jpg";
import bay11 from "../assets/villa/baytree/bay11.jpg";
import bay12 from "../assets/villa/baytree/bay12.jpg";
import bay13 from "../assets/villa/baytree/bay13.jpg";
import bay14 from "../assets/villa/baytree/bay14.jpg";
import bay15 from "../assets/villa/baytree/bay15.jpg";
import bay16 from "../assets/villa/baytree/bay16.jpg";
import bay17 from "../assets/villa/baytree/bay17.jpg";
import bay18 from "../assets/villa/baytree/bay18.jpg";
import bay19 from "../assets/villa/baytree/bay19.jpg";
import bay20 from "../assets/villa/baytree/bay20.jpg";
import bay21 from "../assets/villa/baytree/bay21.jpg";
import bay22 from "../assets/villa/baytree/bay22.jpg";
import bay23 from "../assets/villa/baytree/bay23.jpg";

// bnanana
import banana1 from "../assets/villa/bananaStreet/banana1.jpg";
import banana2 from "../assets/villa/bananaStreet/banana2.jpg";
import banana3 from "../assets/villa/bananaStreet/banana3.jpg";
import banana4 from "../assets/villa/bananaStreet/banana4.jpg";
import banana5 from "../assets/villa/bananaStreet/banana5.jpg";
import banana6 from "../assets/villa/bananaStreet/banana6.jpg";
import banana7 from "../assets/villa/bananaStreet/banana7.jpg";
import banana8 from "../assets/villa/bananaStreet/banana8.jpg";
import banana9 from "../assets/villa/bananaStreet/banana9.jpg";
import banana10 from "../assets/villa/bananaStreet/banana10.jpg";

// friisbay
import friis1 from "../assets/villa/friisbay/friis.webp";
import friis2 from "../assets/villa/friisbay/friis1.webp";
import friis3 from "../assets/villa/friisbay/friis4.webp";
import friis4 from "../assets/villa/friisbay/friis5.webp";
import friis5 from "../assets/villa/friisbay/friis6.webp";
import friis6 from "../assets/villa/friisbay/friis7.webp";
import friis7 from "../assets/villa/friisbay/friis8.webp";
import friis8 from "../assets/villa/friisbay/friis9.webp";
import friis9 from "../assets/villa/friisbay/friis10.webp";
import friis10 from "../assets/villa/friisbay/friis11.webp";
import friis11 from "../assets/villa/friisbay/friis12.webp";
import friis12 from "../assets/villa/friisbay/friss3.webp";

// Concordia
import con1 from "../assets/villa/concordia/con1.jpg";
import con2 from "../assets/villa/concordia/con2.jpeg";
import con3 from "../assets/villa/concordia/con3.jpeg";
import con4 from "../assets/villa/concordia/con4.jpeg";
import con5 from "../assets/villa/concordia/con5.jpeg";
import con6 from "../assets/villa/concordia/con6.jpeg";
import con7 from "../assets/villa/concordia/con7.jpeg";
import con8 from "../assets/villa/concordia/con8.jpeg";

// Coral
import carol1 from "../assets/villa/coral/coral1.jpeg";
import carol2 from "../assets/villa/coral/coral2.jpeg";
import carol3 from "../assets/villa/coral/coral3.jpeg";
import carol4 from "../assets/villa/coral/coral4.jpeg";
import carol5 from "../assets/villa/coral/coral5.jpeg";
import carol6 from "../assets/villa/coral/coral6.jpeg";
import carol7 from "../assets/villa/coral/coral7.jpeg";
import carol8 from "../assets/villa/coral/coral8.jpeg";
import carol9 from "../assets/villa/coral/coral9.jpeg";
import carol10 from "../assets/villa/coral/coral10.jpeg";
import carol11 from "../assets/villa/coral/coral11.jpeg";

// fishbay
import fish1 from "../assets/villa/fishbay/fish1.jpg";
import fish2 from "../assets/villa/fishbay/fish2.jpg";
import fish3 from "../assets/villa/fishbay/fish3.jpg";
import fish4 from "../assets/villa/fishbay/fish4.jpeg";
import fish5 from "../assets/villa/fishbay/fish5.jpg";
import fish6 from "../assets/villa/fishbay/fish6.jpeg";
import fish7 from "../assets/villa/fishbay/fish7.jpeg";
import fish8 from "../assets/villa/fishbay/fish8.jpeg";

//freemans
import free1 from "../assets/villa/freemans/free1.jpg";
import free2 from "../assets/villa/freemans/free2.jpg";
import free3 from "../assets/villa/freemans/free3.jpeg";
import free4 from "../assets/villa/freemans/free4.jpeg";
import free5 from "../assets/villa/freemans/free5.jpeg";
import free6 from "../assets/villa/freemans/free6.jpeg";
import free7 from "../assets/villa/freemans/free7.jpeg";
import free8 from "../assets/villa/freemans/free8.jpeg";
import free9 from "../assets/villa/freemans/free9.jpeg";
import free10 from "../assets/villa/freemans/free10.jpeg";
import free11 from "../assets/villa/freemans/free11.jpeg";
import free12 from "../assets/villa/freemans/free12.jpeg";
import free13 from "../assets/villa/freemans/free13.jpeg";

// Grunwald
import gru1 from "../assets/villa/grunwald/gru1.jpg";
import gru2 from "../assets/villa/grunwald/gru2.jpg";
import gru3 from "../assets/villa/grunwald/gru3.jpg";
import gru4 from "../assets/villa/grunwald/gru4.jpg";
import gru5 from "../assets/villa/grunwald/gru6.jpg";
import gru6 from "../assets/villa/grunwald/gru5.jpg";
import gru7 from "../assets/villa/grunwald/gru7.jpg";
import gru8 from "../assets/villa/grunwald/gru8.jpg";
import gru9 from "../assets/villa/grunwald/gru9.jpg";

// bonnY
import bonny1 from "../assets/villa/bonny/bonny1.webp";
import bonny2 from "../assets/villa/bonny/bonny2.webp";
import bonny3 from "../assets/villa/bonny/bonny3.webp";
import bonny4 from "../assets/villa/bonny/bonny4.webp";
import bonny5 from "../assets/villa/bonny/bonny5.webp";
import bonny6 from "../assets/villa/bonny/bonny6.webp";
import bonny7 from "../assets/villa/bonny/bonny7.webp";
import bonny8 from "../assets/villa/bonny/bonny8.webp";
import bonny9 from "../assets/villa/bonny/bonny9.webp";
import bonny10 from "../assets/villa/bonny/bonny10.webp";
import bonny11 from "../assets/villa/bonny/bonny12.webp";
import bonny12 from "../assets/villa/bonny/bonny11.webp";
import bonny13 from "../assets/villa/bonny/bonny14.webp";

// emmaus1
import emm1 from "../assets/villa/emmaus17e/emm1.webp";
import emm2 from "../assets/villa/emmaus17e/emm2.webp";

import emm3 from "../assets/villa/emmaus17e/emm3.webp";
import emm4 from "../assets/villa/emmaus17e/emm4.webp";
import emm5 from "../assets/villa/emmaus17e/emm5.webp";
import emm6 from "../assets/villa/emmaus17e/emm6.webp";
import emm7 from "../assets/villa/emmaus17e/emm7.webp";
import emm8 from "../assets/villa/emmaus17e/emm8.webp";
import emm9 from "../assets/villa/emmaus17e/emm9.webp";
import emm10 from "../assets/villa/emmaus17e/emm10.webp";
import emm11 from "../assets/villa/emmaus17e/emm11.webp";
import emm12 from "../assets/villa/emmaus17e/emm12.webp";

import emm14 from "../assets/villa/emmaus17e/emm14.webp";
import emm15 from "../assets/villa/emmaus17e/emm15.webp";
import emm16 from "../assets/villa/emmaus17e/emm16.webp";
import emm18 from "../assets/villa/emmaus17e/emm18.webp";

// emmaus2
import em1 from "../assets/villa/emmaus17d/em1.webp";
import em2 from "../assets/villa/emmaus17d/em2.webp";
import em3 from "../assets/villa/emmaus17d/em3.webp";
import em4 from "../assets/villa/emmaus17d/em4.webp";
import em5 from "../assets/villa/emmaus17d/em5.webp";
import em6 from "../assets/villa/emmaus17d/em6.webp";
import em7 from "../assets/villa/emmaus17d/em7.webp";
import em8 from "../assets/villa/emmaus17d/em8.webp";
import em9 from "../assets/villa/emmaus17d/em9.webp";
import em10 from "../assets/villa/emmaus17d/em10.webp";
import em11 from "../assets/villa/emmaus17d/em11.webp";
import em12 from "../assets/villa/emmaus17d/em12.webp";

const propertyData = {
  // Combo properties with internal tabs
  combo: {
    title: "Still Water & Ripple Combo Package",
    category: "combo",
    price: "$2,499,995.00",
    images: [
      comboStillwater1,
      comboRipple1,
      comboStillwater2,
      comboRipple2,
      comboStillwater3,
      // comboRipple3,
      comboStillwater4,
      comboStillwater5,
    ],
    description:
      "Exclusive combo package featuring both Still Water Villa and Ripple Home. This unique opportunity includes a 3-bedroom pool villa with Chocolate Hole views and a 4-bedroom masonry home with studio cottage and bi-directional water views.",
    fullDescription:
      "This exclusive combo package represents a rare opportunity to own two exceptional properties in St. John. The Still Water Villa is a stunning 3-bedroom, 2-bath masonry pool villa that has undergone over $700,000 in comprehensive remodeling, featuring elevated Chocolate Hole views, a brand-new solar system with Tesla Powerwalls, and luxury interior upgrades. The Ripple Home is a unique masonry home with an additional studio cottage featuring bi-directional water views, beautiful gardens, and gated entry. This property includes 21 solar panels with net metering, 2 Tesla power walls, approximately 31,000 gallon cistern plus cottage with 6,750 gallon cistern, grey water system, and internal vacuum system. Together, these properties offer the perfect blend of luxury, sustainability, and island living - ideal for investors, large families, or those seeking multiple income streams.",
    features: {
      beds: 7,
      baths: 5,
      pool: true,
      type: "Combo Package",
      sqft: "5,600",
      yearBuilt: "2018-2020",
      lotSize: "1.7 acres",
    },
    amenities: [
      "Two Complete Properties",
      "Infinity Pool (Still Water)",
      "Solar Systems with Tesla Powerwalls",
      "Elevated Chocolate Hole Views",
      "Bi-directional Water Views (Ripple)",
      "Studio Cottage (Ripple)",
      "Luxury Interior Upgrades",
      "Open-Concept Designs",
      "Outdoor Living Spaces",
      "Gourmet Kitchens",
      "Master Suites with Ocean Views",
      "Beautiful Gardens",
      "Gated Entry",
      "Advanced Water Systems",
      "Net Metering Solar",
      "Grey Water Systems",
    ],
    location: "Chocolate Hole & Coral Bay, St. John",
    status: "For Sale",
    showPackageDetails: true,
    propertyDetails: [
      {
        stillwater: {
          title: "Still Water Villa",
          price: "$2,499,995.00",
          images: [
            stillwater1,
            stillwater2,
            stillwater3,
            stillwater4,
            stillwater5,
          ],
          description:
            "3-bedroom, 2-bath masonry pool villa with over $700,000 in remodeling. Features elevated Chocolate Hole views, brand-new solar system, Tesla Powerwalls, and luxury interior upgrades.",
          fullDescription:
            "Still Water is a stunning 3-bedroom, 2-bath masonry pool villa that has undergone over $700,000 in comprehensive remodeling. This exceptional property offers elevated Chocolate Hole views that will take your breath away. The home features a brand-new solar system with Tesla Powerwalls for sustainable energy, along with luxury interior upgrades throughout. The open-concept design seamlessly connects indoor and outdoor living spaces, perfect for island lifestyle. The infinity pool overlooks the turquoise waters, creating a private oasis for relaxation and entertainment.",
          features: {
            beds: 3,
            baths: 2,
            pool: true,
            type: "Villa",
            sqft: "2,400",
            yearBuilt: "2018",
            lotSize: "0.5 acres",
          },
          amenities: [
            "Infinity Pool",
            "Solar System with Tesla Powerwalls",
            "Elevated Chocolate Hole Views",
            "Luxury Interior Upgrades",
            "Open-Concept Design",
            "Outdoor Living Space",
            "Gourmet Kitchen",
            "Master Suite with Ocean View",
          ],
          location: "Chocolate Hole, St. John",
          status: "Part of Combo Package",
          showPackageDetails: false,
        },
        ripple: {
          title: "Ripple Home",
          price: "$2,499,995.00",
          images: [
            ripple1,
            ripple4,
            ripple5,
            ripple6,
            ripple7,
            ripple8,
            ripple9,
            ripple10,
            ripple11,
            ripple12,
            ripple13,
            ripple14,
            ripple15,
            ripple16,
          ],
          description:
            "Unique masonry home with studio cottage featuring bi-directional water views, beautiful gardens, and gated entry. Includes 21 solar panels, 2 Tesla power walls, and advanced water systems.",
          fullDescription:
            "Ripple is a unique masonry home featuring an additional studio cottage with bi-directional water views, beautiful gardens, and gated entry. This exceptional property has an inverted house design with 3 bedrooms on the ground floor and the great room upstairs to maximize the amazing panoramic water views. The home features 21 solar panels with net metering, 2 Tesla power walls, approximately 31,000 gallon cistern plus cottage with 6,750 gallon cistern, grey water system, and internal vacuum system. The property offers the perfect blend of luxury, sustainability, and island living.",
          features: {
            beds: 4,
            baths: 3,
            pool: false,
            type: "Home",
            sqft: "3,200",
            yearBuilt: "2020",
            lotSize: "1.2 acres",
          },
          amenities: [
            "Bi-directional Water Views",
            "Studio Cottage",
            "21 Solar Panels with Net Metering",
            "2 Tesla Power Walls",
            "38,000 Gallon Cistern",
            "Grey Water System",
            "Internal Vacuum System",
            "Beautiful Gardens",
            "Gated Entry",
          ],
          location: "Coral Bay, St. John",
          status: "Part of Combo Package",
          showPackageDetails: false,
        },
      },
    ],
  },
  // Individual combo properties (for internal tabs) - These are accessed via the combo package tabs
  // Single property (standalone, no tabs)
  doubleVision: {
    title: "Double Vision",
    category: "cottage",
    price: "$1,695,000",
    images: [dv1, db2, db3, db4, db5, db6, db7, db8, db9],
    fullDescription: `Double Vision is an unique masonry home with an additional studio cottage with bi- directional water views, beautiful gardens and gated entry / fenced in property. Double Vision has an inverted house design with the 3 bedrooms on the ground floor and the great room upstairs to maximize the amazing panoramic water views to the south east and north west. The upper level has a covered wrap around porch. The lower bedroom area has a large covered porch facing Coral Harbor. An additional studio masonry cottage on the property is private with its own gate and offers the ability to have a caretaker or long / short term tenant. The great room in the main house is spacious with vaulted ceilings & well laid out kitchen with custom mahogany cabinetry & quartz counter tops. Must see to appreciate ! Property has 21 solar panels, net metering & 2 power walls.\nMain house has approx 31,000 gallon cistern & the cottage 6750\nThe cottage has it's own pump systems but there is plumbing conduit between the two houses to transfer water\nGrey water system for the garden\nApple room to add a pool\nCottage has AC\nEasy to add AC to main house, two bedrooms have conduit for that\nMain house has an internally installed vacuum system ! Great feature.`,
    features: {
      beds: 4,
      baths: 3,
      pool: true,
      type: "Active",
      sqft: "3,308",
    },
    amenities: [
      "Open-Concept Designs",
      "Outdoor Living Spaces",
      "Gourmet Kitchens",
      "Master Suites with Ocean Views",
      "Beautiful Gardens",
      "Gated Entry",
      "Advanced Water Systems",
      "Net Metering Solar",
      "Grey Water Systems",
    ],
    location: "6B-22 St. Quaco & Zimmerman, St John, VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  casaAmor: {
    title: "Casa Amor Villa",
    price: "$1,395,000",
    category: "Villa",
    images: [casa1, casa2, casa3, casa4, casa5, casa6, casa7],
    fullDescription: `Casa Amor Villa is a beautifully appointed home w)dramatic ocean views including the BVI's, Coral Harbor, East End of St John  & surrounding hillside.A custom designed 2 bedroom / 2 bath villa w) newly installed solar, a pool and good road access with a gated private driveway that offers a 3 car parking area . Currently a successful short term rental with ocean views from every room, outdoor stone shower, travertine floors, solid wood cabinets, teak interior doors & outdoor built in BBQ with sink and prep area. The upper level is accessed off of the car park area. The great Room, kitchen, primary suite w) ensuite bath are located just off the BBQ  / outside dining area and covered sitting area.`,
    features: {
      beds: 2,
      baths: 2,
      pool: true,
      type: "Active",
      // sqft: "3,308",
    },
    amenities: [
      "Open-Concept Designs",
      "Outdoor Living Spaces",
      "Gourmet Kitchens",
      "Master Suites with Ocean Views",
      "Beautiful Gardens",
      "Gated Entry",
      "Advanced Water Systems",
      "Net Metering Solar",
      "Grey Water Systems",
    ],
    location: "1-HB-2 ESTATE CAROLINA, Coral Bay, St John, 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  moonglowCottage: {
    title: "Moonglow Cottage",
    category: "cottage",
    price: "$1,295,000",
    images: [
      mang1,
      mang2,
      mang3,
      mang4,
      mang4,
      mang5,
      mang6,
      mang7,
      mang9,
      mang8,
      mang10,
      mang11,
      mang12,
      mang13,
      mang14,
      mang15,
      mang16,
      mang17,
      mang18,
      mang19,
      mang20,
      mang21,
      mang22,
      mang23,
      mang24,
      mang25,
      mang26,
    ],
    fullDescription: `Moonglow Cottage is an octagonal Deltec home with spectacular views of Coral Bay, East End , Haulover ,Hurricane Hole and the British Virgin Islands beyond. Vistas abound from every part of this spacious Caribbean home... there are gentle breezes and an ocean view from every room! The screened outdoor dining veranda is only steps away from a well-appointed gourmet kitchen with owner-created ceramic tiles complementing the stainless steel and granite and custom  cypress cabinetry. An air conditioned bedroom with a king size four-poster bed awaits after star gazing in the spa. Every attention to detail was made from floor (nonslip tiles) to ceiling (custom cypress ceiling). Down a flight of stairs takes you to a beautiful 1 bedroom / 1 bath apartment with the same gorgeous views.`,
    features: {
      beds: 1,
      baths: 1,
      pool: false,
      type: "Active",
      // sqft: "3,308",
    },
    amenities: [
      "Outdoor Dining Varanda",
      "Custom Cypress Cabinetry",
      "Custom Cypress Ceiling",
      "Gourmet Kitchen",
      "Hot Tub",
    ],
    location: "Coral Bay, St. John, US Virgin Islands",
    status: "For Sale",
    showPackageDetails: false,
  },
  windDiva: {
    title: "Wind Diva",
    category: "cottage",
    price: "$749,000",
    images: [wind1, wind2, wind3, wind4, wind5, wind6, wind7],
    fullDescription: `Wind Diva is a great Caribbean Cottage close to Coral Bay with Coral Harbor & Hurricane Hole water views. Wrap around deck with covered porch. Upstairs enjoys an open floor plan with kitchen, dining, living room with primary bedroom / bath and laundry room. Beautiful stone walls and pathways for the entrance and down to the lower level where there is a room with a queen bed platform and a desk that could be finished into another bedroom.Off the paved driveway is a small deck with one bedroom / one bath. Ample flat parking area. This cottage is a must see to appreciate! Meticulously maintained`,
    features: {
      beds: 3,
      baths: 2,
      pool: false,
      type: "Active",
      sqft: "950",
    },
    amenities: [
      "Cistern: Masonry",
      "Roof: Galvanized",
      "Cistern Capacity +/- (gal.): 13054",
      "Appliances: Dryer, Refrigerator, Stove, Washer",
      "View: East/sunrise, Harbor, Mountain, Valley",
      "Furnished: Yes",
    ],
    location: "1-37A Carolina, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },

  bayTree: {
    title: "Bay Tree Cottage",
    category: "cottage",
    price: "$638,000",
    images: [
      bay1,
      bay2,
      bay3,
      bay5,
      bay6,
      bay7,
      bay4,
      bay8,
      bay9,
      bay10,
      bay11,
      bay12,
      bay13,
      bay14,
      bay15,
      bay16,
      bay17,
      bay18,
      bay19,
      bay20,
      bay21,
      bay22,
      bay23,
    ],
    fullDescription: `Bay Tree Cottages is a secluded, private end of the road property surrounded by lush large bay rum trees and the natural beauty of Bordeaux Mountain. The main house has a large upstairs kitchen, dining, living area with laundry and the downstairs has one large bedroom with ample closets and ensuite bathroom. Both levels have covered porches. The smaller cottage has kitchen, dining and living area as well with a sleeping loft, shower and separate bathroom with composting toilet. At the entry is a small shop / garage. This gardeners dream property has a lot of potential. Property has certificate of occupancy and permanent power. Buyers to verify cistern size and square foot of buildings.`,
    features: {
      beds: 2,
      baths: 2,
      pool: false,
      type: "Active",
      sqft: "1,820 ",
    },
    amenities: [
      // "Cistern: Masonry",
      // "Roof: Galvanized",
      // "Cistern Capacity +/- (gal.): 13054",
      // "Appliances: Dryer, Refrigerator, Stove, Washer",
      // "View: East/sunrise, Harbor, Mountain, Valley",
      // "Furnished: Yes",
    ],
    location: "10-49 Carolina, St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  bananaSweet: {
    title: "Banana Sweet",
    category: "house",
    price: "$930,000",
    images: [
      banana1,
      banana2,
      banana3,
      banana4,
      banana5,
      banana6,
      banana7,
      banana8,
      banana9,
      banana10,
    ],
    fullDescription: `Well maintained home in Coral Bay. Upper level is a 2 bedroom / 1 bath kitchen dining living room and deck. The lower level is a spacious studio  short term rental with kitchen, dining & living area. Beautifully landscaped with fruit trees, 2 tesla power walls & solar net metering. `,
    features: {
      beds: 2,
      baths: 1,
      pool: false,
      type: "Active",
      // sqft: "1,820 ",
    },
    amenities: [
      // "Cistern: Masonry",
      // "Roof: Galvanized",
      // "Cistern Capacity +/- (gal.): 13054",
      // "Appliances: Dryer, Refrigerator, Stove, Washer",
      // "View: East/sunrise, Harbor, Mountain, Valley",
      // "Furnished: Yes",
    ],
    location: "1-29 Rem Carolina, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  concordia: {
    title: "Concordia",
    category: "house",
    price: "$1,150,000",
    images: [con1, con2, con3, con4, con5, con6, con7, con8],
    fullDescription: `Unparalleled Views & Endless Potential! Perched on over half an acre across two parcels, this solid masonry and native stone 2-bed, 2-bath home offers privacy, easy paved access, and breathtaking views. Owners buried power lines for unobstructed sunrises, moonrises, and stargazing—visible from every room. The upper level features a great room, kitchen, full bath (outdoor shower), and custom mahogany Murphy bed. The mid-level has two bedrooms, a full bath (outdoor shower), and can convert into a separate apartment. Freshly resealed cisterns March 2025. Enjoy plentiful flat parking, single car garage and storage, plus room to add bedrooms, a pool, or a second home.`,
    features: {
      beds: 2,
      baths: 2,
      pool: false,
      type: "Active",
      // sqft: "1,820 ",
    },
    amenities: [
      // "Cistern: Masonry",
      // "Roof: Galvanized",
      // "Cistern Capacity +/- (gal.): 13054",
      // "Appliances: Dryer, Refrigerator, Stove, Washer",
      // "View: East/sunrise, Harbor, Mountain, Valley",
      // "Furnished: Yes",
    ],
    location: "2-7 & 2-4 Concordia, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  friisbay: {
    title: "Friis Bay",
    category: "house",
    price: "$1,495,000",
    images: [
      friis1,
      friis2,
      friis3,
      friis4,
      friis5,
      friis6,
      friis7,
      friis8,
      friis9,
      friis10,
      friis11,
      friis12,
    ],
    fullDescription: `Nestled along the turquoise shores of Friis Bay, this charming 2bed/2bath beach house is a rare find — and on the market for the very first time. Lovingly maintained, the home blends island charm with quality construction, featuring concrete and native stone, copper gutters, custom louvered windows, and granite countertops. Step onto your seaside deck and enjoy the soothing sound of waves, refreshing sea breezes, and snorkeling just footsteps away. Set on a flat, easy access parcel, the property also includes a parcel directly across the road — ideal for a second house, expanded compound, or preserved green space. Affectionately known as ''the blue-fence next to iconic Miss Lucy's,'' this well-loved island retreat offers a unique opportunity to own a piece of St. John's soul.`,
    features: {
      beds: 2,
      baths: 2,
      pool: false,
      type: "Active",
      // sqft: "1,820 ",
    },
    amenities: [
      // "Cistern: Masonry",
      // "Roof: Galvanized",
      // "Cistern Capacity +/- (gal.): 13054",
      // "Appliances: Dryer, Refrigerator, Stove, Washer",
      // "View: East/sunrise, Harbor, Mountain, Valley",
      // "Furnished: Yes",
    ],
    location: "13BB-10 13BB-7 Hard Labor, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  coralRays: {
    title: "Coral Rays",
    category: "Villa",

    price: "$1,825,000",
    images: [
      carol1,
      carol2,
      carol3,
      carol4,
      carol5,
      carol6,
      carol7,
      carol8,
      carol9,
      carol10,
      carol11,
    ],
    fullDescription: `Coral Rays is a beautiful + beloved 4 bedroom, 4 bathroom villa overlooking Coral Bay, BVI and beyond, with all the amenities and house systems any homeowner can appreciate, including new AC in all rooms, solar array, two waters systems servicing main house and pod independently yet serves as back up for each, waste water treatment, new low maintenance railing, new decking and more. This successful short term rental has two access points: at upper level main house with large great room and grill deck; at middle level with pool, hot tub and 2 bedrooms; and a lower level pod with 2 bedroom en-suites that are accessed by exterior staircase. The layout was designed for relaxation and fun amidst a very lush tropical landscape and has been enjoyed by the Ray family and their guests for 18 year`,
    features: {
      beds: 4,
      baths: 4,
      pool: true,
      type: "Active",
      // sqft: "1,820 ",
    },
    amenities: [
      // "Cistern: Masonry",
      // "Roof: Galvanized",
      // "Cistern Capacity +/- (gal.): 13054",
      // "Appliances: Dryer, Refrigerator, Stove, Washer",
      // "View: East/sunrise, Harbor, Mountain, Valley",
      // "Furnished: Yes",
    ],
    location: "10-30C-4 Carolina, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  fishbay: {
    title: "Fish Bay",
    category: "house",
    price: "$1,950,000",
    images: [fish1, fish2, fish3, fish4, fish5, fish6, fish7, fish8],
    fullDescription: `
“Brizan" is a charming, single level 3BR/3BA Carribean home bordering the National Park and nestled on 2/3 acre overlooking Reef Bay and the Caribbean Sea. The main House consists of the kitchen, living, dining and laundry areas along with the master bedroom and bathroom. This island home includes 2 private stand-alone suites on either side of the main house. All 3 structures, the pool & hot tub, share a single level 100' wide IPE ( Brazilian hardwood) deck & is fully enclosed for complete privacy.Enjoy the breezes, the sound of the surf, spectacular views & starry skies from every room. Brizan is solar/battery powered, offers 32K gallons of cistern capacity & boasts 1 year of short term history with 5 star reviews`,
    features: {
      beds: 3,
      baths: 3,
      pool: true,
      type: "Active",
      sqft: "3,772 ",
    },
    amenities: [
      "Has private pool: Yes",
      "Pool features: Pool",
      "View description: Panoramic, South Shore, St. Croix",
      "Water view: South Shore,St. Croix",
      "View: East/sunrise, Harbor, Mountain, Valley",
      "Features: Professional Landscaping",
    ],
    location: "116 Fish Bay, Reef Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  freemans: {
    title: "Freemans Ground",
    category: "house",
    price: "$2,495,000",
    images: [
      free1,
      free2,
      free3,
      free4,
      free5,
      free6,
      free7,
      free8,
      free9,
      free10,
      free11,
      free12,
      free13,
    ],
    fullDescription: `
Looking for a great family home where everyone has their own space? Perhaps you're looking for an investment property? Joy Life & Castaway Cottage have all of this and more. And even better, owner financing is available! This listing includes 3 parcels, totaling 2.6 acres, and includes a large one bedroom apartment, a generously-sized studio apartment, an ultra-private standalone cottage & a caretaker's suite. The top level of the main house can easily be converted into an outdoor living space w/ some of the best views on island. There is ample room to add a pool too! This professionally-landscaped property has solar, battery backup, net metering & a Kubota backup generator. Expansive views from Coral Bay Harbor to the East End, BVI & beyond! It is truly a sight to see.`,
    features: {
      beds: 4,
      baths: 4,
      pool: false,
      type: "Active",
      sqft: "3,772 ",
    },
    amenities: [
      "Included: Dishwasher, Dryer, Freezer,Refrigerator, Stove, Washer",
      "View description: British Virgin Islands, East/sunrise, Harbor, Panoramic",
      "Has water view: Yes",
      "Water view: British Virgin Islands,Harbor",
    ],
    location: "11 Freemans Ground, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  grunwald: {
    title: "Grunwald cottage",
    category: "cottage",
    price: "$590,000",
    images: [gru1, gru2, gru3, gru4, gru5, gru6, gru7, gru8, gru9],
    fullDescription: `Price reduction! This sweet island cottage, just a few minutes walk to Gifft Hill school, is nestled at end of road in the valley of Gift Hill. This Charming Caribean style home, with partial wrap around decking and lush gardens, is your perfect starter home. Enjoy the fruit trees and ample space for vegetable garden and more. This home is in immaculate condition, featuring new kitchen counters and cabinets, new flooring and a lovely living room with vaulted ceiling and large sliding doors to the outdoor covered decking. The bedroom has a new AC unit with large windows overlooking the lush exterior.The second bedroom, currently used as an art room/office could also be the perfect guest bedroom with private deck outside.  
`,
    features: {
      beds: 2,
      baths: 1,
      pool: false,
      type: "Active",
      // sqft: "3,772 ",
    },
    amenities: [
      "Features: Some Landscaping",
      "Home type: SingleFamily",
      "Property subtype: Single Family Residence",
      "Foundation: Masonry Footings",
    ],
    location: "9-17-G #22 Glucksberg, Cruz Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  bonnyAbode: {
    title: "Bonny's Abode",
    category: "cottage",
    price: "$646,000",
    images: [
      bonny1,
      bonny2,
      bonny3,
      bonny4,
      bonny5,
      bonny6,
      bonny7,
      bonny8,
      bonny9,
      bonny10,
      bonny11,
      bonny12,
      bonny13,
    ],
    fullDescription: `Bonny's Abode is a fun, eclectic, cozy cottage made w) love with beautiful panoramic views of Hurricane Hole, the entrance to Coral Harbor, Fortsberg, East End and the BVI beyond. Plenty of room to build another house at the top of the parcel with even higher panoramic views! The main area is where the kitchen, counter top bar and living area are, just outside is a covered porch leading to a deck, bedroom, bathroom, upper deck and primary bedroom. Beautiful rock formations and fruit trees like mango, genip, lime grow on the property. Downstairs studio apartment allows for additional guests or rental. The upper portion of property is accessed from Andy's Way & offers ample room to build another house on the property.`,
    features: {
      beds: 2,
      baths: 1,
      pool: false,
      type: "Active",
      // sqft: "3,772 ",
    },
    amenities: [
      "View description: British Virgin Islands, Down Island, East/sunrise, Harbor, Panoramic",
      "Water view: British Virgin Islands,Down Island,Harbor",
      "Zoning: R-2Residential",
      "Features: Natural Landscaping",
    ],
    location: "28-17 Calabash Boom, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  emmaus17e: {
    title: "17E-1 + Emmaus",
    category: "house",

    price: "$2,500,000",
    images: [
      emm1,
      emm2,
      emm3,
      emm4,
      emm5,
      emm6,
      emm7,
      emm8,
      emm9,
      emm10,
      emm11,
      emm12,
      emm14,
      emm15,
      emm16,
      emm18,
    ],
    fullDescription: `Stunning location with beautiful vistas of Hurricane Hole, Hurricane national Monument, Round Bay and the East End of St John. This property must be seen to appreciate the natural beauty of this location. This multi property listing offers many scenarios & possibilities for a new owner. The 2 bedroom / 1.5 bath house currently has 14 solar panels & battery backup for off the grid living. This is a unique and rare offering in a pristine area ringed with historic stone walls.`,
    features: {
      beds: 2,
      baths: 1.5,
      pool: false,
      type: "Active",
      // sqft: "3,772 ",
    },
    amenities: [
      "Appliances: Refrigerator, Stove, Washer",
      "Furnished: Yes",
      "View: Caribbean, East/sunrise, Harbor, Mountain, Panoramic",
    ],
    location: "17E-1 + Emmaus, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
  emmaus17d: {
    title: "17D-3 Emmaus",
    category: "house",

    price: "$585,000",
    images: [em1, em2, em3, em4, em5, em6, em7, em8, em9, em10, em11, em12],
    fullDescription: `Tropical off-grid paradise up Johnny Horn Trail! Coral Bay Eco Retreat Cottage. 2BR/2BA concept. If you have an adventurous heart and enjoy the tranquility of nature, and 4WD, welcome home! Zero footprint, solar power. Stunning view of the Sea, Hurricane Hole, Coral Bay Harbor, and BVI to Virgin Gorda. Spectacular sunrises, sunsets, and moonscapes. Located on peaceful, private, romantic half acre, adjacent to the VI National Park. Hiking lovers heaven. Loft Queen Bedroom. Open air second bed. Large open deck nestled among the trees. Screened main living area. Open air Caribbean style kitchen. Full bath adjacent to bedroom. Half bath on main floor and outdoor garden shower. Short term rental is the past.`,
    features: {
      beds: 2,
      baths: 1.5,
      pool: false,
      type: "Active",
      // sqft: "3,772 ",
    },
    amenities: [
      "Appliances: Refrigerator, Stove",
      "Furnished: Yes",
      "View: British Virgin Islands, Caribbean, Down Island, Harbor, Panoramic",
    ],
    location: "17D-3 Emmaus, Coral Bay St John, US VI 00830",
    status: "For Sale",
    showPackageDetails: false,
  },
};

export { propertyData };
*/

// ============================================================================
// End of legacy hardcoded data
// ============================================================================
