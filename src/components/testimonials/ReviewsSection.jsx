import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addReview, subscribeToReviews } from "../../firebase/firestore";
import { LayoutGrid, List } from "lucide-react";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-indigo-600 mb-2">
        {review.title}
      </h3>

      <div className="flex items-center mb-3">
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
            className="ml-1 inline-flex items-center text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </p>

      <p className="text-sm font-medium text-gray-500">— {review.name}</p>
    </motion.div>
  );
};

// ⭐ MAIN COMPONENT (REWRITTEN)
const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [viewType, setViewType] = useState("grid");

  const [form, setForm] = useState({
    title: "",
    body: "",
    name: "",
    rating: 0,
  });

  // Subscribe to live Firestore reviews
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToReviews((data) => {
      setReviews(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rating) {
      setError("Please provide a rating.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await addReview(form);
      if (result.success) {
        setForm({ title: "", body: "", name: "", rating: 0 });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center mb-12 text-[#3c6a72]"
        >
          What Our Clients Say
        </motion.h2>

        {/* Grid/List Buttons */}
      <div className="flex justify-end mb-6 gap-3">
        {[
          { type: "grid", icon: <LayoutGrid className="w-5 h-5" /> },
          { type: "list", icon: <List className="w-5 h-5" /> },
        ].map(({ type, icon }) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={`
              p-3 rounded-lg border transition
              ${viewType === type
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300"
              }
            `}
          >
            {icon}
          </button>
        ))}
      </div>


        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Reviews List */}
        {!loading && reviews.length > 0 && (
          <motion.div
            className={`w-full mx-auto ${
              viewType === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-6"
            }`}
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.15 }}
          >
            {reviews.map((review, i) => (
              <ReviewCard review={review} key={review.id || i} />
            ))}
          </motion.div>
        )}

        {/* No Reviews */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500 py-20 text-lg">
            No reviews yet. Be the first to share your experience!
          </p>
        )}

        {/* Review Form */}
        <div className="mt-20 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Write a Review</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Review Title"
              className="w-full border rounded-md px-4 py-2"
              required
            />

            <textarea
              name="body"
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Share your experience..."
              className="w-full border rounded-md px-4 py-2"
              required
            />

            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="w-full border rounded-md px-4 py-2"
              required
            />

            <RatingInput
              rating={form.rating}
              setRating={(r) => setForm((prev) => ({ ...prev, rating: r }))}
            />

            <div className="flex items-start gap-2">
              <input type="checkbox" required />
              <p className="text-sm text-gray-600">
                I confirm this review is based on my real experience.
              </p>
            </div>

            {error && <p className="text-red-600">❌ {error}</p>}
            {submitted && <p className="text-green-600">✅ Review submitted!</p>}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-md text-white ${
                submitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
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
