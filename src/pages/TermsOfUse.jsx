import React from "react";
import { motion } from "framer-motion";
import termuse from "../assets/contacthero.jpg";

const TermsOfUse = () => {
  return (
    <section className="bg-[#ede4de] min-h-screen">
      {/* Header Image with Title */}
      <div className="relative h-[65vh] md:h-[65vh]">
        <img
          src={termuse}
          alt="Terms of Use Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl font-bold mb-2">Terms of Use</h1>
            <p className="text-white text-lg font-medium max-w-2xl mx-auto">
              Understand the Rules and Regulations Before Accessing 340 Real
              Estate Co Website
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto py-16 px-6 "
      >
        <div className="space-y-8">
          <h2 className="text-2xl text-[#3c6a72] font-bold">
            Acceptance of Terms
          </h2>
          <p>
            The following rules and regulations apply to all visitors and users
            of this website. By accessing the 340 Real Estate Co website, you
            acknowledge acceptance of these terms and conditions.
          </p>

          <h2 className="text-2xl text-[#3c6a72] font-bold">
            General Disclaimer
          </h2>
          <p className="uppercase text-sm text-[#5a4d42]">
            All information provided on this website is offered "as is" without
            warranties of any kind, expressed or implied. We do not warrant
            uninterrupted access or error-free content.
          </p>
          <p>
            There may be delays, omissions, interruptions, or inaccuracies in
            the information available through our website. We disclaim all
            warranties, including merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>
          <p>
            Under no circumstances shall 340 Real Estate Co be liable for
            indirect, special, incidental, or consequential damages, including
            lost profits or data, even if advised of the possibility.
          </p>

          <h2 className="text-2xl  text-[#3c6a72] font-bold">
            Accuracy of Information
          </h2>
          <p>
            Although we strive to provide accurate information, we make no
            guarantees regarding completeness, reliability, or timeliness. You
            access and use the information on this website at your own risk.
          </p>

          <h2 className="text-2xl text-[#3c6a72] font-bold">
            Links to Other Sites
          </h2>
          <p>
            For your convenience, we may provide links to third-party websites.
            We do not control or endorse the content of these external sites and
            are not responsible for their materials or practices.
          </p>

          <h2 className="text-2xl text-[#3c6a72] font-bold">
            Electronic Commerce
          </h2>
          <p>
            We offer the ability to purchase goods and services online. While we
            implement reasonable security precautions, we are not liable for
            data interception or misuse. You are responsible for the accuracy
            and legitimacy of the information you provide.
          </p>

          <h2 className="text-2xl text-[#3c6a72] font-bold">
            Limit on Liability
          </h2>
          <p>
            340 Real Estate Co and its representatives are not liable for
            incidental or consequential damages arising from the use or
            inability to use this site. Any claim is limited to the amount paid
            by you, if any, for using our services.
          </p>

          <h2 className="text-2xl  text-[#3c6a72] font-bold">Governing Law</h2>
          <p>
            By using this website, you agree to be governed by the terms set
            forth herein and applicable local laws.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default TermsOfUse;
