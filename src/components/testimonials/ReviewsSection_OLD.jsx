import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addReview, subscribeToReviews, getReviews } from "../../firebase/firestore";

// ⭐ Star Rating Input Component
const RatingInput = ({ rating, setRating }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.svg
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        key={star}
        onClick={() => setRating(star)}
        xmlns="http://www.w3.org/2000/svg"
        fill={star <= rating ? "#FBBF24" : "none"}
        viewBox="0 0 24 24"
        stroke="#FBBF24"
        strokeWidth={2}
        className="w-6 h-6 cursor-pointer transition"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.548 4.755a1 1 0 00.95.69h5.007c.969 0 1.371 1.24.588 1.81l-4.055 2.947a1 1 0 00-.364 1.118l1.548 4.755c.3.921-.755 1.688-1.538 1.118L12 17.347l-4.055 2.947c-.783.57-1.838-.197-1.538-1.118l1.548-4.755a1 1 0 00-.364-1.118L3.536 10.182c-.783-.57-.38-1.81.588-1.81h5.007a1 1 0 00.95-.69l1.548-4.755z"
        />
      </motion.svg>
    ))}
  </div>
);

// 📦 useShowMore Hook
const useShowMore = (text, limit = 250) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > limit;
  const toggle = () => setExpanded((prev) => !prev);
  const displayed = isLong && !expanded ? text.slice(0, limit) + "..." : text;
  return { displayed, expanded, toggle, isLong };
};

// 🧱 Review Card Component
const ReviewCard = ({ review }) => {
  const { displayed, expanded, toggle, isLong } = useShowMore(review.body);

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-1 text-indigo-600">
        {review.title}
      </h3>
      <div className="flex items-center mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i <= review.rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.548 4.755h5.007c.969 0 1.371 1.24.588 1.81l-4.055 2.947 1.548 4.755c.3.921-.755 1.688-1.538 1.118L12 17.347l-4.055 2.947-1.548-4.755-4.055-2.947c-.783-.57-.38-1.81.588-1.81h5.007L9.049 2.927z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 text-sm whitespace-pre-line mb-2">
        {displayed}
        {isLong && (
          <button
            onClick={toggle}
            className="ml-1 inline-flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 px-2 py-0.5 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </p>
      <p className="text-sm font-medium text-gray-500">— {review.name}</p>
    </motion.div>
  );
};

// 📦 Sample initial reviews
const initialReviews = [
  {
    title: "House under contract in 8 Days",
    body: `This was the second time we listed property with Tammy and there was never any question that we would list our home with her. Tammy is there to meet any challenges that might pop up when selling your home. Once we were under contract we had an issue surface. Rather than having to solve it ourselves Tammy was there to help. Without Tammy our sale could have fallen thru.

Buying or selling on St John, Tammy is the realtor you need!`,
    name: "Karen Radtke and David Carlson",
    rating: 5,
  },
  {
    title: "We have known Tammy Donnelly since spring of 2012",
    body: `After many years of visiting St. John, we decided in 2012 to purchase a property there. We did as much research online as possible. We emailed one of the realty websites with some questions, and Tammy responded. She helped us come up with a list of criteria that were important to us.

In June 2012, we rented a house on St. John and spent a lovely week there with our family. During that week, Tammy took us to look at a number of properties that met our criteria and which we had vetted online to the extent possible. Often there are challenges with a property that aren’t evident until you actually see it; in our case, none of the condos we visited were a great fit for our needs. After spending two days showing us various properties, Tammy urged us to look at a condo that did not meet all of our criteria, but she felt we would like it anyway. One visit and we knew this was the condo we should buy. Tammy skillfully guided us through negotiations with the owner, through the extensive paperwork involved with purchasing a home, and helped us set up property insurance and utilities.

Furnishing our unfurnished condo would have been difficult and painful without having an agent on-island. Tammy’s help was invaluable to us. We shipped furniture from our hometown, near Indianapolis, to our new condo on St. John. Tammy received our furniture from the shipping company, arranged for it to be delivered to our condo, and oversaw the process of assembling the pieces and placing them correctly in the various rooms. All we had to do was pay for it. When we arrived on St. John for our first stay as new owners of our condo, it was clean, fresh and ready to be lived in.

When we are off-island, Tammy manages our property: she has it cleaned regularly and puts up and takes down hurricane shutters when appropriate. We let her know in advance when we or other guests will visit, and she makes sure everything is ready to go.

Through the process of buying and furnishing the property, Tammy has become a good friend. She has our complete trust, and we hope to continue working with her for many years. We wholeheartedly and enthusiastically recommend Tammy Donnelly as a realtor and property manager`,
    name: "Eric Adolph and Teresa Beam, Noblesville, IN",
    rating: 5,
  },
  {
    title: "What a privilege it is to know and work alongside Tammy.",
    body: `We first met Tammy as our real estate agent in 2012. Tammy was amazingly efficient, always prompt, very well organized and never tired of chasing our whims here and there!

We are fortunate to have a continued relationship with Tammy as our On Island Coordinator for our villa rental. Tammy is always reliable and we have full confidence that any and all situations are being handled in a timely and appropriate manner.

When we converse with other islanders about our villa and the management of it we are inevitably asked about our On Island Coordinator. When we mention Tammy’s name there is nothing but high praise from each and every person.

We have come to understand and appreciate why Tammy has earned this praise. We cannot say enough good things about Tammy as person, a professional, and now, a friend!`,
    name: "Cindy and Bill Humphrey, St Joseph, Missouri",
    rating: 5,
  },
  {
    title:
      "St John, in the USVI, is a place where most people can only imagine living.",
    body: `My family and I have had the wonderful opportunity to visit there many times over the last 15 years or so, and never thought we would be able to have a home there. Tammy Donnelly helped make it happen. Tammy, who grew up in the Virgin Islands, was extremely informative, providing us with everything we needed to know to move forward with the purchase of an island home. She made herself available to show us the properties we had interest in, to answer questions, and to provide us with names, documents and instructions on all the steps involved. She made the distance between the island and the states seem nonexistant as we proceeded with the purchase and closing from our New York state home.

Tammys’ assistance did not end with the closing. Tammy continued her support, when ever asked, with professionalism and timelyness. Since we are not quite ready to retire and leave our home in the states, Tammy has helped us prepare our island home for short term rentals. Tammy has been instrumental in adding all finishing touches to our villa, and has introduced it to her website. We enjoy the positive comments from our satisfied guests on not only the villa, but Tammys’ timely, informative and friendly service.

The 340 Real Estate Company is, in our opinion, one of the best sites we have seen. It is straight forward, informative, and friendly, much like Tammy herself. It is one of the few sites that allows you to put in your own criteria to search properties, and show you its actual location on the island. I urge anyone who is thinking about making the move to St John to go to www.340realestateco.com and contact Tammy Donnelly. She made it happen for us, and she can make it happen for you.`,
    name: "Michelle and Ron",
    rating: 5,
  },
  {
    title: "Sometimes with everyone’s busy schedules...",
    body: `Sometimes with everyone’s busy schedules we forget to take time to tell you how much we appreciated the wonderful job you do as our villa property manager. We couldn’t ask for a nicer person to work with, you are so well organized, trust worthy, patient and always helpful to us as well as guests. Thank you so much for all you do to make our villa seem like home`,
    name: "Brenda and Steve",
    rating: 5,
  },
  {
    title: "It’s no coincidence...",
    body: `It’s no coincidence that everyone who works with Tammy has similar, positive experiences. She is awesome!

We have been frequent visitors to St John over the past 15 years, and have known Tammy as a friend for much of that time. When we decided to purchase, Tammy went out of her way to show us properties. We saw quite a range, and in each case Tammy listened, and remained objective and steady during our engagement. Despite our friendship, she seamlessly maintained professionalism and ethical standards throughout our process.

Tammy brings a unique perspective as a realtor on St. John because in addition to home sales, she also provides villa rental and property maintenance services. She can see through the marketing and provide rare insight into what it takes to maintain a home on the island. She is rooted, and actively engaged in the community. Tammy has been a past president of the St John real estate council.

We cannot say enough wonderful things about Tammy, and our experience working with her to purchase a home on St John. You will be confident that your needs are exceeded, and well satisfied with your experience! She’s the BEST!`,
    name: "Nick, Jodi, and family",
    rating: 5,
  },
  {
    title: "Singing Tammy’s Praises………",
    body: `Tammy Donnelly is not only an exceptional real estate professional but a new friend and neighbor! I hope this testimonial is one way to express our extreme gratitude…

Our family decided in July 2017 to move to St. John. Of course we had no idea what mother nature had in store that would significantly test these plans. Not only did our younger daughter endure hurricanes Irma & Maria with many of our island friends, but we survived hurricane Harvey in Houston as we attempted to sell our family home of 20 years. When I finally arrived on island, late September as commercial flights were once again allowed to land in St. Thomas, I was fortunate to have a place to stay. Our daughter’s apartment in Pastory was no longer livable so a dear friend offered us her cottage in Fish Bay for a few weeks. Post hurricanes the island looked so very different so we decided to just take it all in and not to be deterred. We volunteered to help friends clean homes and businesses and take it one day at a time. By early October (within a few weeks) on our morning walks we happened upon a house that met all our lot/house criteria… “we would like to see the ocean, hear the waves and feel the breeze”.

Working with Tammy Donnelly and Jennifer Doran, of 340 Real Estate, next steps were to make an offer and ultimately arrive at the final price. The seller’s agent was not very cooperative so we relied heavily on these two power women to help us through the process (very different from the stateside process). Tammy also has great connections to lenders if a mortgage is required. We were lender approved and in contract by end of October.

The story does not end here. We still did not have electricity in Estate Fish Bay and yet we closed on the house December 5th!

Finally and most appreciated, Tammy and Jenny made sure we had a place to stay on island for 7 weeks until we could move in… Ladies my family and I are forever in your debt. So delighted to call you friend, neighbor and agent/broker.`,
    name: "A.",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `TAMMY is a very good real estate agent who knows the area and laws to get the job completed. I would refer her in an instant and use her again if I needed her services. Highly recommended!`,
    name: "Denise Barbier",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy was so helpful while we were buying our villa on St John. We had been thinking about buying for years, but after working with Tammy, we felt so better prepared for the ownership. It has been over 6 months since our purchase and we could not be happier!`,
    name: " Lynn Hood",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy is very professional and knowledgeable about the market on St John! She kept me informed on all new properties coming on the market so we were able to get the first offer in on our new Villa! This is the third time I have used Tammy for my Realestate needs on St John! If you are looking for someone with the best knowledge of the market on St John and outstanding personal follow up choose Tammy!`,
    name: "mchamberlain550",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `There is no one on island that has more knowledge of the "ins and outs" of real estate in the USVI. Numerous transactions with Tammy, of which they are all unique, and she masterfully handled everything. Once she has an understanding of your wants she is excellent at vetting properties and providing info. She also has a very calm demeanor and takes on any task with that approach and it certainly keeps you sane. Honest, trustworthy and an absolute pleasure to work with.`,
    name: " Donald McNaught",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy did an outstanding job. Her experience and knowledge of the area made the sale of our home and transition to new owners seamless. She is responsive and guided us through the entire process.`,
    name: " lcsummerhouse",
    rating: 5,
  },
  //   {
  //     title: "",
  //     body: ``,
  //     name: "",
  //     rating: 5,
  //   },
];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    name: "",
    rating: 0,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Subscribe to real-time reviews from Firestore
  useEffect(() => {
    console.log('Setting up Firebase reviews listener...');
    setLoading(true);
    
    const unsubscribe = subscribeToReviews((reviewsData) => {
      console.log('Received Firebase reviews:', reviewsData);
      setReviews(reviewsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate rating
    if (form.rating === 0) {
      setError("Please provide a rating.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    console.log('📤 Submitting review:', form);

    try {
      const result = await addReview(form);
      console.log('✅ Review submission result:', result);
      
      if (result.success) {
        // Reset form
        setForm({ title: "", body: "", name: "", rating: 0 });
        setSubmitted(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
        
        console.log('🎉 Review submitted successfully! ID:', result.id);
      } else {
        setError(result.error || "Failed to submit review. Please try again.");
        console.error('❌ Review submission failed:', result.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("❌ Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-12 text-[#3c6a72]"
        >
          What Our Clients Say
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-y-6 w-full mx-auto px-2 sm:px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
          >
            {reviews.map((review, idx) => (
              <ReviewCard key={review.id || `review-${idx}`} review={review} />
            ))}
          </motion.div>
        )}

        {/* Form */}
        <div className="mt-20 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Write a Review
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
                placeholder="e.g. Amazing Experience"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Your Review</label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
                placeholder="Share your experience..."
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rating</label>
              <RatingInput
                rating={form.rating}
                setRating={(val) =>
                  setForm((prev) => ({ ...prev, rating: val }))
                }
              />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <p className="text-sm text-gray-600">
                This review is based on my own experience and is my genuine
                opinion.
              </p>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 font-medium"
              >
                ❌ {error}
              </motion.p>
            )}
            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600 font-medium"
              >
                ✅ Your review has been submitted and will appear live!
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
