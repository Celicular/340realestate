import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRentalProperties } from "../../../firebase/firestore";

/* ----------------------------------
   SLUG UTILITY (SAFE)
---------------------------------- */
const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const RentalsSection = () => {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ----------------------------------
     FETCH DATA
  ---------------------------------- */
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const res = await getRentalProperties({ status: "approved" });

        if (res?.success && Array.isArray(res.data)) {
          setRentals(res.data);
        }
      } catch (err) {
        console.error("Error fetching rentals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  /* ----------------------------------
     NORMALIZE (OLD DATA SAFE)
  ---------------------------------- */
  const normalizeRental = (r) => {
    if (!r) return null;

    const info = r.propertyInfo || r.property?.propertyInfo || {};
    const acc = r.accommodation || {};

    const images =
      r.media?.imageList ||
      r.media?.imageLinks ||
      r.imageList ||
      r.imageLinks ||
      r.images ||
      [];

    const name = info.name || "Rental Property";

    return {
      id: r.id,
      name,
      slug: info.slug || makeSlug(name) || r.id,
      location: info.address || "Location not specified",
      description:
        info.description?.split("\n")[0] || "Beautiful rental property",
      price: info.pricePerNight
        ? `$${info.pricePerNight}`
        : "Price on request",
      rating: 4.5,
      image: images[0] || "/placeholder-image.jpg",
      guests: acc.maxGuests || acc.maxOccupancy || 0,
      bedrooms: acc.bedrooms || 0,
      bathrooms: acc.bathrooms || 0,
      amenities: r.amenities || [],
    };
  };

  const villas = rentals.map(normalizeRental).filter(Boolean);

  /* ----------------------------------
     OLD SLIDER CONTROLS (UNCHANGED)
  ---------------------------------- */
  const nextSlide = () =>
    setCurrentIndex((i) => (i === villas.length - 1 ? 0 : i + 1));

  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? villas.length - 1 : i - 1));

  const handleViewDetails = (slug) => {
    if (!slug) return;
    navigate(`/rental/${slug}`);
  };

  /* ----------------------------------
     LOADING
  ---------------------------------- */
  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="animate-spin h-14 w-14 border-b-2 border-tropical-600 rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading rentals...</p>
      </section>
    );
  }

  if (!villas.length) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">No rental properties available.</p>
      </section>
    );
  }

  /* ----------------------------------
     OLD SLIDER UI (SAME)
  ---------------------------------- */
  return (
    <section id="rentals" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold">Villa Rentals</h2>
          <p className="text-gray-600 mt-2">
            Hand-picked selection of quality places
          </p>
        </div>

        <div className="relative">

          {/* PREV */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <ChevronLeft size={26} />
          </button>

          {/* NEXT */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <ChevronRight size={26} />
          </button>

          {/* SLIDER */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {villas.map((villa) => (
                <div key={villa.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* IMAGE */}
                    <div className="relative">
                      <img
                        src={villa.image}
                        alt={villa.name}
                        className="w-full h-64 sm:h-80 lg:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow">
                        <Star size={16} className="text-yellow-500" fill="currentColor" />
                        <span className="font-bold">{villa.rating}</span>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-serif font-bold mb-2">
                          {villa.name}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-1" />
                          {villa.location}
                        </div>

                        <p className="text-gray-600 mb-6 line-clamp-3">
                          {villa.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <Stat label="Guests" value={villa.guests} />
                          <Stat label="Bedrooms" value={villa.bedrooms} />
                          <Stat label="Bathrooms" value={villa.bathrooms} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-6">
                        <div className="text-3xl font-bold text-tropical-600">
                          {villa.price}
                          <span className="text-sm text-gray-500 ml-1">
                            / week
                          </span>
                        </div>

                        <button
                          onClick={() => handleViewDetails(villa.slug)}
                          className="px-6 py-3 bg-tropical-600 text-white rounded-lg hover:scale-105 transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOTS */}
          <div className="flex justify-center mt-6 gap-2">
            {villas.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all ${
                  i === currentIndex
                    ? "w-8 h-3 bg-tropical-600"
                    : "w-3 h-3 bg-gray-300"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

/* ----------------------------------
   MINI STAT
---------------------------------- */
const Stat = ({ label, value }) => (
  <div className="text-center">
    <div className="text-xl font-bold text-tropical-600">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default RentalsSection;
