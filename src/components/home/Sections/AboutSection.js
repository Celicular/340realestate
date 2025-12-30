import React from "react";
import team from "../../../assets/team.jpeg";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-[#ede4de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Team Photo */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-tropical-400 to-caribbean-400 rounded-2xl opacity-20 blur-xl"></div>
              <img
                src={team}
                alt="340 Real Estate Team"
                className="relative rounded-2xl shadow-2xl w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl text-gray-900">
                Discover Your Slice of Paradise with 340 Real Estate St. John
              </h2>
              <p className="text-lg font-medium text-tropical-600">
                Residential Homes, Land & Condos for Every Budget!
              </p>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Have you ever found yourself daydreaming about staying forever
                  after the most relaxing vacation of your life—sunbathing on a
                  tropical beach or taking a once-in-a-lifetime sabbatical in a
                  remote island paradise? That dream of owning a piece of "the
                  rock" may be closer than you think.
                </p>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Why St. John?
                  </h3>
                  <p>
                    St. John is a gem rich in history, culture, and natural
                    beauty. Home to the renowned Virgin Islands National
                    Park—established in 1956 through the efforts of Laurance
                    Rockefeller—the park now encompasses 7,200 acres of land and
                    an additional 5,600 acres of underwater beauty. This
                    accounts for roughly 80% of the island remaining pristine
                    and undeveloped, including world-famous white-sand beaches.
                  </p>
                  <p>
                    This small but captivating island draws visitors from all
                    over the world. Whether you're into hiking, snorkeling,
                    diving, surfing, or just soaking up the Caribbean sun, St.
                    John offers something for everyone.
                  </p>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-tropical-600">
                    7,200
                  </div>
                  <div className="text-sm text-gray-600">Acres of Land</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-tropical-600">
                    5,600
                  </div>
                  <div className="text-sm text-gray-600">Underwater Acres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-tropical-600">
                    80%
                  </div>
                  <div className="text-sm text-gray-600">Protected Land</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
