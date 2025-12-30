import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Eric Adolph and Teresa Beam",
    location: "Noblesville, IN",
    content: `We have known Tammy Donnelly since spring of 2012. After many years of visiting St. John, we decided in 2012 to purchase a property there. We did as much research online as possible. We emailed one of the realty websites with some questions, and Tammy responded...

She skillfully guided us through negotiations, paperwork, utilities, and even furnishing our condo while we were stateside. We arrived to a fully set up home, clean and ready. We trust her completely and highly recommend her as a realtor and property manager.`,
  },
  {
    name: "Cindy and Bill Humphrey",
    location: "St Joseph, Missouri",
    content: `Tammy is amazingly efficient, prompt, organized, and tireless. She’s our villa rental coordinator and handles all situations professionally. Her reputation on the island is exceptional. Tammy is reliable, trustworthy, and has become not just a colleague, but a friend.`,
  },
  {
    name: "Michelle and Ron",
    location: "New York",
    content: `Tammy Donnelly made our dream of owning a home in St. John a reality. She provided all necessary documents, details, and was always available despite the distance. Even after the sale, she helped us prep for short-term rentals. Her website is top-notch — just like her.`,
  },
  {
    name: "Brenda and Steve",
    content: `We can’t thank you enough for the incredible job you do managing our villa. You're well-organized, trustworthy, and always helpful — for us and our guests. Thanks for making our villa feel like home!`,
  },
  {
    name: "Nick, Jodi, and family",
    date: "10/15",
    content: `Tammy is simply awesome! A true professional and a friend. Her unique insight as a realtor and property manager gives her unmatched perspective. She's deeply connected to the St. John community and helps you make confident, informed decisions.`,
  },
  {
    name: "A.",
    title: "Singing Tammy’s Praises",
    content: `We moved to St. John in 2017 through hurricanes, relocations, and lots of uncertainty. Tammy and Jenny supported us through everything — finding a home, negotiating, lending, and even arranging housing until we could move in. They are power women, and we are forever grateful.`,
  },
];

const TestimonialsTab = () => {
  return (
    <section className="px-4 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#2b4a9a] mb-10">
        Testimonials
      </h1>

      <div className="grid gap-8 sm:grid-cols-2">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-lg transition"
          >
            <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line text-base">
              “{t.content}”
            </p>
            <div className="text-sm text-gray-600 italic">
              — {t.name}
              {t.location && `, ${t.location}`}
              {t.date && ` (${t.date})`}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsTab;
