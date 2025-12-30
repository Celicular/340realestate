import React from "react";
import sign from "../../../assets/sign.png";

const AnniversarySection = () => {
  return (
    <section className="relative h-full py-20 px-6 sm:px-10 lg:px-20 text-white overflow-hidden">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://340realestatestjohn.com/wp-content/uploads/2025/04/home-page-slider.mov"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* 🔲 Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 📄 Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
          Celebrating 25 Years of Real Estate Excellence on St. John
        </h2>

        {/* Subheading */}
        <p className="uppercase text-sm sm:text-base font-semibold text-gray-200 mb-10 tracking-widest">
          Your Trusted Partner in Paradise – Since 1999
        </p>

        {/* Paragraphs */}
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-left text-white/90">
          <p>
            This year marks 25 years since I started my real estate journey on
            the beautiful island of St. John. What began as a passion for
            helping people find their piece of paradise has grown into a trusted
            name in island real estate.
          </p>
          <p>
            From vacation homes and investment properties to first-time buyers
            and dream homes, it’s been an incredible ride—one filled with
            relationships, stories, and a deep love for this vibrant community.
          </p>
          <p>
            I’m filled with gratitude for every client, colleague, and friend
            who’s been part of this journey. Whether you’re buying, selling, or
            simply exploring what St. John has to offer, I’m here to help you
            every step of the way.
          </p>
          <p>
            Thank you for being part of this journey. Here’s to 25 years of
            service — and many more to come!
          </p>

          {/* CTA */}
          <p className="font-semibold mt-4 uppercase text-white">
            Let’s make the next chapter even more memorable—together.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-10">
          <img
            src={sign}
            alt="Jimmy Donnelly Signature"
            className="mx-auto w-64 h-auto drop-shadow-[0_0_4px_white]"
            loading="lazy"
          />
          <p className="text-white/80 mt-2">
            Broker/Owner/ABR® – 340 Real Estate Co.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnniversarySection;
