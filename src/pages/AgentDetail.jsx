import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { getAgentById, getAgentImages } from "../data/agentsDataFirebase";
import teamhero from "../assets/teamcrop.jpg";

// BLINK-FREE Lazy Image Component
const LazyImage = ({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;

    img
      .decode()
      .then(() => {
        setCurrentSrc(src);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback in case decode fails (rare)
        setCurrentSrc(src);
        setIsLoading(false);
      });
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Solid placeholder (prevents white flash) */}
      <div
        className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Shimmer effect while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      )}

      {/* Real image - only renders when fully decoded */}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isLoading ? 0 : 1 }}
          loading="lazy"
        />
      )}
    </div> 
  );
};

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const foundAgent = await getAgentById(id);

        if (foundAgent) {
          setAgent(foundAgent);
          const agentImages = getAgentImages(foundAgent);
          setImages(agentImages);
        } else {
          setAgent(null);
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching agent:", err);
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAgent();
  }, [id]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-[60vh] md:h-[75vh] bg-gray-300 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="h-8 w-24 bg-gray-300 rounded mb-8 animate-pulse" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-gray-300 rounded-3xl animate-pulse" />
            <div className="space-y-8">
              <div className="h-12 bg-gray-300 rounded w-3/4 animate-pulse" />
              <div className="h-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agent Not Found
  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Agent Not Found</h2>
          <button
            onClick={() => navigate("/agents")}
            className="px-8 py-3 bg-tropical-600 text-white rounded-lg hover:bg-tropical-700 transition"
          >
            View All Agents
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero - ZERO BLINK */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] overflow-hidden bg-gray-900">
        {/* Instant blurred background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-70"
          style={{ backgroundImage: `url(${teamhero})` }}
        />

        {/* Hero image with smooth fade-in */}
        <img
          src={teamhero}
          alt="Team hero"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1200 ${
            heroLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHeroLoaded(true)}
          loading="eager"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold font-serif drop-shadow-2xl">
              {agent.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-2 sm:mt-3 opacity-95 drop-shadow-lg">
              {agent.title}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-tropical-600 hover:text-tropical-700 font-semibold mb-6 sm:mb-8 md:mb-10 transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Main Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl group">
                <LazyImage
                  src={images?.[0] || "/placeholder.jpg"}
                  alt={agent.name}
                  className="aspect-[4/5] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 bg-tropical-600 text-white p-4 sm:p-6 rounded-tr-2xl sm:rounded-tr-3xl shadow-lg">
                  <p className="text-xs sm:text-sm font-bold tracking-wider">LICENSED AGENT</p>
                  <p className="text-xs opacity-90">St. John, USVI</p>
                </div>
              </div>
            </motion.div>

            {/* Info Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6 sm:space-y-8 md:space-y-10"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {agent.name}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-tropical-600 mt-2 font-medium">
                  {agent.title}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">
                  <MapPin size={18} className="text-tropical-600 flex-shrink-0" />
                  <span>{agent.location || "St. John, USVI"}</span>
                </div>
              </div>

              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  About {agent.name.split(" ")[0]}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                  {agent.fullBio || agent.bio || "No biography available."}
                </p>
              </div>

              {agent.specialties && agent.specialties.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {agent.specialties.map((s, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-tropical-100 text-tropical-800 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Card */}
              <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-900">Contact Directly</h3>
                <div className="space-y-3 sm:space-y-4">
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-tropical-50 to-blue-50 rounded-xl sm:rounded-2xl hover:from-tropical-100 hover:to-blue-100 transition-all group"
                    >
                      <div className="p-2 sm:p-3 bg-tropical-600 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Mail className="text-white" size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{agent.email}</p>
                      </div>
                    </a>
                  )}
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all group"
                    >
                      <div className="p-2 sm:p-3 bg-emerald-600 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Phone className="text-white" size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">Call or Text</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{agent.phone}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Photo Gallery */}
          {images && images.length > 1 && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 sm:mt-16 md:mt-24"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-900">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {images.slice(1).map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
                  >
                    <LazyImage
                      src={img}
                      alt={`${agent.name} - Gallery ${i + 1}`}
                      className="aspect-square"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Global Shimmer CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite;
        }
      `}</style>
    </>
  );
};

export default AgentDetail;