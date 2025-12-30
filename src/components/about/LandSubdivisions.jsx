import React from "react";
import { motion } from "framer-motion";

const subdivisions = [
  {
    name: "ADRIAN, BEVERHOUDTSBERG and BELLEVUE",
    description:
      "Somewhat ‘flat’ land five minutes drive to town, predominantly valley views referred to as the “country”",
  },
  {
    name: "ANNABERG",
    description: "North Shore land near Francis and Maho bays",
  },
  {
    name: "BETHANY",
    description:
      "High above Cruz Bay and Great Cruz Bay with views from South to West",
  },
  {
    name: "BORDEAUX HEIGHTS",
    description: "On top of Bordeaux Mountain with views East to Virgin Gorda",
  },
  {
    name: "CALABASH BOOM",
    description:
      "In Coral Bay past Shipwreck Restaurant with views East to the British Virgins",
  },
  {
    name: "CAROLINA",
    description:
      "One thousand acres+/- including Bordeaux mountain and sweeping around the hills above Coral Bay to the North and East.",
  },
  {
    name: "CATHERINEBERG",
    description:
      "Above Trunk Bay with views from West through North to East. Access from Either Rt 10 or Rt 20",
  },
  {
    name: "CHOCOLATE HOLE",
    description:
      "Established area on South side, close to Cruz Bay with views from East through South to West",
  },
  {
    name: "CONCORDIA",
    description:
      "South of Coral Bay near Salt Pond Bay with predominantly South views",
  },
  {
    name: "CONTANT",
    description:
      "Close to Cruz Bay, hillside on either side of Enighed Pond with views South to West",
  },
  {
    name: "DITLEFF POINT",
    description:
      "Just before Fish Bay on south shore, mostly waterfront parcels with views from East, West and South / Caribbean Sea to Pillsbury Sound.",
  },
  {
    name: "DREEKETS BAY",
    description: "East End land with views North to Tortola",
  },
  {
    name: "EMMAUS and EDEN",
    description:
      "Coral Bay just across from fire station and past church, with views South, some East",
  },
  {
    name: "ENIGHED",
    description:
      "Close to Cruz Bay, between Bethany and Pastory, with mostly West views",
  },
  {
    name: "FISH BAY & SKYTOP",
    description: "South side, past Chocolate Hole with views South to West",
  },
  {
    name: "GIFT & REGENBACK, GLUCKSBERG & SAN SOUCI and GUINEA GUT",
    description: "Gift Hill land with mostly Westerly views",
  },
  {
    name: "GREAT CRUZ BAY",
    description:
      "Oldest and very established neighborhood surrounding Westin Resort, with mostly West views towards St Thomas. All parcels start with a 300- number.",
  },
  {
    name: "HAULOVER & HANSEN BAY",
    description: "East End land with views in all directions",
  },
  {
    name: "MANDAHL",
    description:
      "South of Coral Bay and past Concordia this land has mostly South views",
  },
  {
    name: "MIDLAND",
    description: "Land located out by Maho Bay",
  },
  {
    name: "PASTORY",
    description: "Just outside Cruz Bay with mostly West views",
  },
  {
    name: "PETER BAY",
    description:
      "North Shore land with views of National Park bays and Tortola",
  },
  {
    name: "RENDEZVOUS and DITLEFF, POINT RENDEZVOUS, BOATMAN POINT, KLEIN BAY",
    description:
      "Turn of Rt 104 and the dead end sign by Rendezvous. with bay and Caribbean Sea views mostly South.",
  },
];

const LandSubdivisions = () => {
  return (
    <section className="bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-[#3c6a72] mb-12"
        >
          Land Subdivisions in St. John
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {subdivisions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-[#3c6a72] mb-2">
                {item.name}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full aspect-[16/9] pt-16 overflow-hidden shadow-lg">
        <iframe
          title="St John Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15633.609793942323!2d-64.74938705000001!3d18.33196315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c051194c169c7d3%3A0x394785963b4c3f1a!2sSt%20John%2C%20U.S.%20Virgin%20Islands!5e0!3m2!1sen!2sin!4v1720958118190!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
        ></iframe>
      </div>
    </section>
  );
};

export default LandSubdivisions;
