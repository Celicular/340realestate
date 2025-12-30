import React from "react";
import { motion } from "framer-motion";
import privacyHero from "../assets/contacthero.jpg";

const PrivacyPolicy = () => {
  return (
    <section className="bg-[#ede4de] min-h-screen">
      {/* Header Image with Title */}
      <div className="relative h-[65vh] md:h-[65vh]">
        <img
          src={privacyHero}
          alt="Privacy Policy Header"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-white text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-white text-lg font-medium max-w-2xl mx-auto">
              Your Privacy Matters – Understand How 340 Real Estate Co Collects and
              Uses Your Information
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto py-16 px-6 text-[#3c6a72]"
      >
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Who We Are</h2>
          <p>
            Our website address is https://340realestateco.com/. This privacy
            policy explains how your Personally Identifiable Information (PII) is
            collected and used.
          </p>

          <h2 className="text-2xl font-bold">What Data We Collect and Why</h2>
          <p>
            We may collect your name, email address, or other details when you
            register, place an order, or contact us—especially via email.
          </p>

          <h2 className="text-2xl font-bold">How We Use Your Information</h2>
          <p>
            We use your information to respond to inquiries, provide services,
            follow up on conversations, and improve your experience.
          </p>

          <h2 className="text-2xl font-bold">Data Protection</h2>
          <p>
            We use regular Malware Scanning, SSL encryption, and secure networks.
            Sensitive data is processed via third-party gateways and not stored on
            our servers.
          </p>

          <h2 className="text-2xl font-bold">Cookies</h2>
          <p>
            We do not use cookies for tracking purposes. You can manage cookie
            settings via your browser.
          </p>

          <h2 className="text-2xl font-bold">Third-Party Disclosure</h2>
          <p>
            We do not sell or trade your information. Trusted third parties may
            assist in operating our website under strict confidentiality.
          </p>

          <h2 className="text-2xl font-bold">Third-Party Links</h2>
          <p>
            Our website may link to third-party services. These have separate
            privacy policies and we are not responsible for their content.
          </p>

          <h2 className="text-2xl font-bold">Google & Advertising</h2>
          <p>
            We use Google AdSense. Google uses DART cookies to serve ads based on
            your visits. You may opt out through Google's Ad Settings.
          </p>

          <h2 className="text-2xl font-bold">California Privacy Rights (CalOPPA)</h2>
          <p>
            We comply with CalOPPA: you can visit anonymously and review this
            policy from our homepage. You’ll be notified of changes on this page.
          </p>

          <h2 className="text-2xl font-bold">Do Not Track Signals</h2>
          <p>
            We honor Do Not Track (DNT) settings and do not use tracking when DNT
            is enabled.
          </p>

          <h2 className="text-2xl font-bold">Children’s Privacy (COPPA)</h2>
          <p>
            We do not knowingly market to children under 13 years of age.
          </p>

          <h2 className="text-2xl font-bold">Fair Information Practices</h2>
          <p>
            If a data breach occurs, we’ll notify users within 7 business days via
            email and on-site notification.
          </p>

          <h2 className="text-2xl font-bold">CAN-SPAM Compliance</h2>
          <p>
            We only send emails with user consent and offer easy opt-out options.
            You can unsubscribe at any time by emailing us.
          </p>

          <h2 className="text-2xl font-bold">Contacting Us</h2>
          <p>
            If you have questions about this privacy policy:
            <br />
            <strong>Website:</strong> https://340realestateco.com/
            <br />
            <strong>Address:</strong> PO Box 766, ST JOHN VI 00831
            <br />
            <strong>Email:</strong> 340realestateco@gmail.com
          </p>

          <p className="text-sm text-[#5a4d42]">Last Updated: July 11, 2018</p>
        </div>
      </motion.div>
    </section>
  );
};

export default PrivacyPolicy;
