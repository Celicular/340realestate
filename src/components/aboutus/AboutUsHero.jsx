import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Users,
  MapPin,
  Zap,
  Home,
  Shield,
  Heart,
  TrendingUp,
} from "lucide-react";
import abouthero from "../../assets/teamabout.jpg";

const AboutUsHero = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Passion for Paradise",
      description:
        "We don't just work here, we live here. Our deep love for St. John drives everything we do.",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Integrity First",
      description:
        "Honest, transparent dealings are the foundation of every transaction we handle.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Community Focused",
      description:
        "We understand St. John's neighborhoods like no one else. We are locals serving locals.",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Expert Excellence",
      description:
        "Market insights, local knowledge, and cutting-edge tools combine for superior results.",
    },
  ];

  const teamHighlights = [
    {
      title: "Local Knowledge Unmatched",
      description:
        "Every street, every neighborhood, every hidden gem—we know St. John intimately. Our team has lived here for decades and understands the unique character of each area.",
      icon: <MapPin className="w-8 h-8" />,
    },
    {
      title: "Personalized Service",
      description:
        "We take time to understand your dreams, your timeline, and your unique needs. You're not a transaction—you're a neighbor.",
      icon: <Heart className="w-8 h-8" />,
    },
    {
      title: "Market Expertise",
      description:
        "We combine insider knowledge with cutting-edge market data to ensure you get the best deals and maximum returns.",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      title: "Seamless Transactions",
      description:
        "From property search to closing, we guide you through every step with transparency and professionalism.",
      icon: <Award className="w-8 h-8" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={abouthero}
          alt="St. John Island Aerial View"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-4xl"
          >
            Your Local Experts in <br />
            <span className="bg-gradient-to-r from-tropical-400 to-caribbean-400 bg-clip-text text-transparent">
              St. John Real Estate
            </span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-tropical-400 to-sand-400 rounded-full mb-6"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white text-xl md:text-2xl max-w-2xl font-light"
          >
            Discover your paradise with 340 Real Estate—where local expertise
            meets Caribbean excellence
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ===== MAIN STORY SECTION ===== */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 text-gray-800"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-tropical-500 to-sand-400 rounded-full mb-8" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg leading-relaxed"
            >
              <p className="text-gray-700">
                Welcome to{" "}
                <span className="font-bold text-tropical-600">
                  340 Real Estate
                </span>
                , where local expertise meets Caribbean excellence. Our name
                tells our story—"340" is our area code, a proud symbol of our
                deep roots and unwavering commitment to this island community.
                We're not just real estate agents; we're locals who live, work,
                and love St. John, USVI.
              </p>

              <p className="text-gray-700">
                For over 15 years, we've been helping people just like you find
                their slice of paradise. Whether you're searching for a
                luxurious oceanfront villa with breathtaking vistas, a charming
                cottage nestled in the lush hills, a condo for your investment
                portfolio, or the perfect land to build your dream home, we have
                the expertise and dedication to make it happen.
              </p>

              <p className="text-gray-700">
                Our success isn't measured in transactions—it's measured in
                relationships. We believe that buying or selling property in St.
                John is about more than just numbers on a contract. It's about
                helping you find a home, an investment, or a legacy for your
                family. That's why we take the time to understand your vision,
                your timeline, and your unique needs.
              </p>

              <p className="text-gray-700">
                With 500+ properties sold, 1,000+ satisfied clients, and a
                combined experience of over 50 years in the St. John real estate
                market, we bring unparalleled local knowledge to every single
                transaction. We know every neighborhood, every microclimate,
                every school district, and every hidden gem on this island.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CORE VALUES SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-tropical-500 to-sand-400 rounded-full mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every client
              interaction
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                <div className="text-tropical-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-tropical-50 to-caribbean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 340 Real Estate?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-tropical-500 to-sand-400 rounded-full mx-auto mb-8" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-tropical-100"
              >
                <div className="text-tropical-600 mb-4">{highlight.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ST. JOHN FACTS SECTION ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About St. John, USVI
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-tropical-500 to-sand-400 rounded-full mb-8" />

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Size & Geography
                    </h3>
                    <p className="text-gray-600">
                      20 square miles of pristine Caribbean beauty—7 miles long,
                      3 miles wide. Our highest point is Bordeaux Mountain at
                      1,277 feet above sea level.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Community
                    </h3>
                    <p className="text-gray-600">
                      A tight-knit community of about 4,200 full-time residents
                      who value sustainability, natural beauty, and island
                      living.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      National Park Heritage
                    </h3>
                    <p className="text-gray-600">
                      Two-thirds of the island is protected within the U.S.
                      Virgin Islands National Park, preserving its natural
                      splendor for generations.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Lifestyle
                    </h3>
                    <p className="text-gray-600">
                      Year-round tropical climate with average temperatures in
                      the 80s. Water activities, hiking, beachcombing, and
                      community events define life here.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Real Estate Market
                    </h3>
                    <p className="text-gray-600">
                      A dynamic market ranging from luxury villas to charming
                      cottages, investment properties to pristine land—all in
                      high demand globally.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-tropical-600 flex-shrink-0 mt-1">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      U.S. Territory Benefits
                    </h3>
                    <p className="text-gray-600">
                      U.S. citizenship, U.S. currency, and Act 60 tax incentives
                      for businesses and investors make it uniquely attractive.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-tropical-600 to-tropical-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Paradise?
            </h2>
            <p className="text-xl text-tropical-100 mb-8 max-w-2xl mx-auto">
              Let our local expertise guide you home. Whether you're buying,
              selling, or exploring, 340 Real Estate is here to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate("/properties")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-tropical-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg cursor-pointer"
              >
                Browse Properties
              </motion.button>
              <motion.button
                onClick={() => navigate("/contact")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-tropical-700 text-white font-bold rounded-lg border-2 border-white hover:bg-tropical-800 transition-colors text-lg cursor-pointer"
              >
                Contact Us Today
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsHero;
