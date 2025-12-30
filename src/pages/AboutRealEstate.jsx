import React from "react";
import AboutSection from "../components/home/Sections/AboutSection";
import AboutStJohnTeam from "./../components/aboutstjohnteam.jsx/AboutStJohnTeam";

const AboutRealEstate = () => {
  return (
    <div className="App relative scroll-smooth">
      <AboutStJohnTeam />
      <AboutSection />
      <div className="bg-[#ede4de]">
        <div className="pt-10 pb-16 max-w-7xl mx-auto text-gray-800 leading-relaxed  bg-[#ede4de] space-y-4">
          <p>
            Our 340 Real Estate St John brokers and sales agents are willing to
            show and sell all properties listed on the MLS, ranging from
            Commercial Properties, Residential Homes, Land & Condos within any
            price range available!
          </p>
          <p>
            The team offers accredited buyers representatives for the interested
            buyers. We have a user friendly, complete searchable online database
            of all the properties for sale on St John Board of Realtors MLS as
            well as a historical Database with 5000+ Real Estate Sales History
            to browse by Property or search sales history by area or time frame
            that includes every single listing and sale including (single family
            homes) since 2009!
          </p>
          <p>
            If you think that St. John might be for you, either temporarily — a
            week or a lifetime; give us a call today and allow our more than 70
            years of collective experience to help make your purchase possible
            in paradise!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutRealEstate;
