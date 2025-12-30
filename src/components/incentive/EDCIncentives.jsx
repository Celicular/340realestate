import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-4 bg-tropical-100 hover:bg-tropical-200 text-left text-gray-800 font-medium text-lg"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <div
        className={`px-6 py-4 text-gray-700 text-[0.975rem] leading-relaxed bg-white transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const EDCIncentives = () => {
  const navigate = useNavigate();
  const handleContactClick = () => navigate("/contact");

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            U.S. Virgin Islands Economic & Tax Incentives
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
            Explore a variety of exclusive programs designed to drive growth,
            attract investment, and maximize your business potential in the
            USVI.
          </p>
        </div>

        <div className="space-y-5">
          <Accordion title="Economic Development Commission (EDC)">
            <p className="mb-2">
              The Economic Development Commission (EDC) offers sanctioned tax
              incentives to USVI-based companies:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>90% reduction on personal & corporate income tax</li>
              <li>
                100% exemption on excise, business property, and gross receipts
                tax
              </li>
              <li>Reduction of customs duty from 6% to 1%</li>
            </ul>
            <p className="font-semibold">Requirements:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Hire 10+ full-time VI residents (5 for service businesses)
              </li>
              <li>Minimum $100K investment (excluding inventory)</li>
              <li>Comply with IRS Code Sections 934 & 937</li>
              <li>Follow all federal, local, and environmental regulations</li>
              <li>Provide beach access easement if operating near shoreline</li>
            </ul>
          </Accordion>

          <Accordion title="STARS Program (Arts, Music & Film Incentives)">
            <ul className="list-disc pl-5">
              <li>Up to 17% transferable tax credit</li>
              <li>Up to 29% cash rebate</li>
              <li>Minimum spend: $250,000</li>
              <li>20%+ local resident hires including interns</li>
              <li>Community involvement: e.g., speaking engagements</li>
              <li>Proper credits: “Made in the USVI” acknowledgement</li>
            </ul>
          </Accordion>

          <Accordion title="South Shore Trade Zone (SSTZ)">
            <p>
              Leverage strategic port and airport access on St. Croix.
              Businesses enjoy 100% exemptions on customs, excise, gross
              receipts, and property tax within this industrial development
              zone.
            </p>
          </Accordion>

          <Accordion title="Hotel Development Program">
            <p>
              Use hotel/casino tax revenue to repay project financing. 80% of
              hires must be USVI residents, with additional management roles
              filled locally by year 3. Requires all licenses and permits.
            </p>
          </Accordion>

          <Accordion title="Enterprise Zone Incentives">
            <p>
              Designed to revitalize historic towns (e.g., Christiansted,
              Frederiksted, Savanne, Up Street). Includes regulatory relief and
              tax benefits for investment and redevelopment.
            </p>
          </Accordion>

          <Accordion title="Tax Increment Financing (TIF)">
            <p>
              TIF lets developers finance public infrastructure (roads,
              drainage, utilities, etc.) using projected future tax revenue.
              Enables large-scale development without upfront public costs.
            </p>
          </Accordion>

          <Accordion title="1031 Exchange">
            <p>
              Defer capital gains tax by reinvesting in “like-kind” property.
              Must follow IRS rules: 45-day ID period, 180-day closing period,
              and use of a Qualified Intermediary.
            </p>
          </Accordion>

          <Accordion title="Capital Gains Tax Break Zones">
            <p>
              Approved USVI zones allow 10–15% federal capital gains tax
              reduction and 100% exemption on appreciated gains after 7 years.
              Federal support aims to accelerate economic development.
            </p>
          </Accordion>

          <Accordion title="Jones Act Exemption">
            <p>
              The USVI is exempt from the Jones Act. Businesses may use
              foreign-flag vessels for domestic shipping routes—greatly lowering
              logistics costs and increasing flexibility.
            </p>
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleContactClick}
            className="inline-block px-8 py-3 bg-tropical-600 hover:bg-tropical-700 text-white text-lg font-semibold rounded-lg shadow-lg transition"
          >
            Contact Us to Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default EDCIncentives;
