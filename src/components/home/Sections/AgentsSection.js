import React, { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAgentsData, fallbackAgentsData } from "../../../data/agentsDataFirebase";

const AgentsSection = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const agentsData = await fetchAgentsData();
        setAgents(agentsData);
      } catch (error) {
        console.error('Error loading agents:', error);
        setAgents(fallbackAgentsData);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
  };

  if (loading) {
    return (
      <section id="agents" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tropical-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading our team...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agents" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3c6a72] mb-4">
            Meet Our Family
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our experienced team of real estate professionals dedicated to
            helping you find your perfect piece of paradise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agent/${agent.id}`)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center cursor-pointer"
            >
              {/* Agent Photo */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-tropical-100">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-tropical-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Agent Info */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {agent.name}
              </h3>
              <p className="text-tropical-600 font-medium mb-3">
                {agent.title}
              </p>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {agent.bio}
              </p>

              {/* Contact Buttons */}
              <div
                className="flex justify-center space-x-3"
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={`mailto:${agent.email}`}
                  className="w-10 h-10 bg-tropical-100 hover:bg-tropical-200 rounded-full flex items-center justify-center transition-colors duration-300 group"
                  aria-label={`Email ${agent.name}`}
                >
                  <Mail
                    size={18}
                    className="text-tropical-600 group-hover:text-tropical-700"
                  />
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="w-10 h-10 bg-tropical-100 hover:bg-tropical-200 rounded-full flex items-center justify-center transition-colors duration-300 group"
                  aria-label={`Call ${agent.name}`}
                >
                  <Phone
                    size={18}
                    className="text-tropical-600 group-hover:text-tropical-700"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#3c6a72] to-[#3d8b99] rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-serif font-bold mb-4">
              Ready to Work with Our Team?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Let us help you find your dream property in St. John
            </p>
            <button
              onClick={handleContactClick}
              className="px-8 py-4 bg-white text-tropical-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;