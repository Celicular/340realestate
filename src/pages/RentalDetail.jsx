// =============================
// PART 1 — IMPORTS & STATES & FETCH & SLIDER LOGIC
// =============================
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { MapPin, CheckCircle } from "lucide-react";
import { IoHomeOutline, IoBed } from "react-icons/io5";
import { BiMaleFemale } from "react-icons/bi";

import { makeSlug } from "../utils/slugify";
import { getRentalProperties, addBookingRequest } from "../firebase/firestore";

import SEOHead from "../components/SEO/SEOHead";
import {
  generateRentalJsonLd,
  generateSEOTitle,
  generateSEODescription,
  generateKeywords,
} from "../utils/seoUtils";



const RentalDetail = () => {
  const { slug } = useParams();

  // MAIN RENTAL STATES
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // IMAGE SLIDER STATES
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const images = rental?.media?.imageList || [];

  // BOOKING FORM STATE
  const [bookingData, setBookingData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    message: "",
  });

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  // 👉 MUST BE HERE (NOT inside an if block)
  const thumbContainerRef = useRef(null);

  // ============================
  // NORMALIZE FIRESTORE DATA
  // ============================
  const normalizeRental = (r) => {
    if (!r) return null;

    const rawInfo =
      r.propertyInfo ||
      r.property?.propertyInfo || {
        name: r.name,
        type: r.type,
        status: r.status,
        pricePerNight: r.pricePerNight,
        address: r.address,
        description: r.description,
      };

    const rawAcc =
      r.accommodation || {
        bedrooms: r.bedrooms,
        bathrooms: r.bathrooms,
        maxOccupancy: r.maxGuests || r.maxOccupancy,
      };

    const rawImages =
      r.media?.imageList ||
      r.media?.imageLinks ||
      r.imageList ||
      r.imageLinks ||
      r.images ||
      [];

    const rawPolicies =
      r.policies ||
      r.policy ||
      r.rules || {
        smoking: r.smoking,
        pets: r.pets,
        party: r.party,
        children: r.children,
      };

    return {
      id: r.id || "",
      title: rawInfo.name || "",
      type: rawInfo.type || "",
      status: r.status || rawInfo.status || "available",

      propertyInfo: {
        id: r.id,
        name: rawInfo.name || "",
        type: rawInfo.type || "",
        pricePerNight: rawInfo.pricePerNight || "",
        address: rawInfo.address || "",
        description: rawInfo.description || "",
        slug:
          rawInfo.slug ||
          rawInfo.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
          r.id,
      },

      description: rawInfo.description || "",

      amenities: r.amenities || [],

      accommodation: {
        bedrooms: rawAcc?.bedrooms || 0,
        bathrooms: rawAcc?.bathrooms || 0,
        maxGuests: rawAcc?.maxOccupancy || 0,
      },

      media: {
        imageList: Array.isArray(rawImages) ? rawImages : [],
      },

      image: Array.isArray(rawImages) && rawImages.length ? rawImages[0] : "",
      policies: {
        smoking: rawPolicies.smoking ?? false,
        pets: rawPolicies.pets ?? false,
        party: rawPolicies.party ?? false,
        children: rawPolicies.children ?? true,
        cancellationPolicy: rawPolicies.cancellationPolicy || "",
        damagePolicy: rawPolicies.damagePolicy || "",
        checkedInTime: rawPolicies.checkedInTime || "",
        checkedOutTime: rawPolicies.checkedOutTime || "",
      },
    };
  };

  // ============================
  // FETCH RENTAL BY SLUG / ID
  // ============================
  useEffect(() => {
    const fetchRental = async () => {
      const result = await getRentalProperties({ status: "approved" });

      if (result.success) {
        const found = result.data.find((r) => {
          const slugFromName = makeSlug(r);
          const savedSlug = r.propertyInfo?.slug;
          return r.id === slug || savedSlug === slug || slugFromName === slug;
        });

        const normalized = normalizeRental(found);
        setRental(normalized);

        const imgs =
          normalized?.media?.imageList?.filter((img) => img && typeof img === "string") || [];

        if (imgs.length > 0) setSelectedImage(imgs[0]);
      }

      setIsLoading(false);
    };

    fetchRental();
  }, [slug]);


  useEffect(() => {
  const container = thumbContainerRef.current;
  if (!container) return;

  const activeThumb = container.querySelector(`[data-idx="${currentIndex}"]`);
  if (!activeThumb) return;

  const targetScrollLeft =
    activeThumb.offsetLeft -
    container.clientWidth / 2 +
    activeThumb.clientWidth / 2;

  container.scrollTo({
    left: targetScrollLeft,
    behavior: "smooth",
  });
}, [currentIndex]);



  // ============================
  // FADE SLIDER — AUTOPLAY
  // ============================
  useEffect(() => {
    if (!rental || !rental.media.imageList) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, rental]);

  // NEXT SLIDE
const nextSlide = () => {
  if (!rental) return;
  const imgs = rental.media.imageList;

  setCurrentIndex((prev) => {
    const newIndex = prev === imgs.length - 1 ? 0 : prev + 1;
    setSelectedImage(imgs[newIndex]);
    return newIndex;
  });
};

  // PREVIOUS SLIDE
const prevSlide = () => {
  if (!rental) return;
  const imgs = rental.media.imageList;

  setCurrentIndex((prev) => {
    const newIndex = prev === 0 ? imgs.length - 1 : prev - 1;
    setSelectedImage(imgs[newIndex]);
    return newIndex;
  });
};

const goToSlide = (index) => {
  setCurrentIndex(index);
  setSelectedImage(rental.media.imageList[index]);
};


  // KEYBOARD CONTROL
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex]);





  // ============================
// EXTRACTED VARIABLES
// ============================
if (!isLoading && rental) {
  var info = rental.propertyInfo; // Make info available for JSX
}

// ============================
// BOOKING INPUT HANDLER
// ============================
const handleBookingInputChange = (e) => {
  const { name, value } = e.target;
  setBookingData((prev) => ({ ...prev, [name]: value }));
};

// ============================
// CALCULATE DURATION
// ============================
const calculateStayDuration = () => {
  if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;

  const start = new Date(bookingData.checkInDate);
  const end = new Date(bookingData.checkOutDate);

  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

// ============================
// CALCULATE PRICING SUMMARY
// ============================
const calculatePricing = () => {
  const nights = calculateStayDuration();
  const nightlyRate = Number(info.pricePerNight || 100);

  const base = nights * nightlyRate;
  const cleaning = 200;
  const serviceFee = Math.round(base * 0.05);
  const taxes = Math.round((base + cleaning + serviceFee) * 0.125);

  return {
    nights,
    base,
    cleaning,
    serviceFee,
    taxes,
    total: base + cleaning + serviceFee + taxes,
  };
};

// ============================
// SUBMIT BOOKING
// ============================
const handleBookingSubmit = async (e) => {
  e.preventDefault();
  setBookingLoading(true);
  setBookingError("");

  try {
    const nights = calculateStayDuration();
    if (nights <= 0) throw new Error("Please select valid dates.");
    if (!bookingData.guestName || !bookingData.email || !bookingData.phone) {
      throw new Error("Please complete all fields.");
    }

    const pricing = calculatePricing();

    const payload = {
      guest: { ...bookingData },
      booking: {
        checkIn: new Date(bookingData.checkInDate),
        checkOut: new Date(bookingData.checkOutDate),
        guests: bookingData.guests,
        nights,
      },
      pricing,
      property: {
        id: rental.id,
        name: info.name,
        slug,
      },
      createdAt: new Date(),
      status: "pending",
    };

    await addBookingRequest(rental.id, payload);

    alert("Booking request submitted!");

    setBookingData({
      guestName: "",
      email: "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      guests: 1,
      message: "",
    });
  } catch (err) {
    setBookingError(err.message);
  }

  setBookingLoading(false);
};

if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

if (!rental) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Rental Not Found
    </div>
  );
}



return (
  <>
 {!rental ? (
      <div className="min-h-screen flex items-center justify-center">
        Rental Not Found
      </div>
    ) : (

  <div className="relative w-full h-[90vh] overflow-hidden select-none"> 

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-20"></div>

  {/* FADE SLIDES */}
  {rental.media.imageList.map((img, i) => (
    <img
      key={i}
      src={img}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
        i === currentIndex ? "opacity-100" : "opacity-0"
      }`}
      draggable="false"
    />
  ))}

  {/* LEFT ARROW */}
  <button
    onClick={prevSlide}
    className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-xl"
  >
    ❮
  </button>

  {/* RIGHT ARROW */}
  <button
    onClick={nextSlide}
    className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full shadow-xl"
  >
    ❯
  </button>

{/* TEXT DETAILS ON SLIDER */}
<div className="absolute z-40 left-10 bottom-32 text-white drop-shadow-2xl">
  <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
    {rental?.propertyInfo?.name || ""}
  </h1>

  <div className="flex gap-3 flex-wrap">
    <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
      🏡 {rental?.propertyInfo?.type || ""}
    </div>

    <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
      👥 {rental?.accommodation?.maxGuests || 0} Guests
    </div>

    <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
      🛏 {rental?.accommodation?.bedrooms || 0} Bedrooms
    </div>
  </div>
</div>

<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex justify-center w-[90%] max-w-[900px] mx-auto overflow-hidden">
 <div
  ref={thumbContainerRef}
  className="
    flex gap-3 
    bg-black/40 px-4 py-2 rounded-xl backdrop-blur-lg 
    w-full
    overflow-x-hidden
    overflow-y-hidden
    whitespace-nowrap
    scrollbar-none
    items-center
  "
>

    {rental.media.imageList.map((thumb, idx) => (
      <img
        key={idx}
        data-idx={idx}
        src={thumb}
        onClick={() => goToSlide(idx)}
        className={`w-20 h-14 object-cover rounded-lg cursor-pointer transition border-2 ${
          idx === currentIndex
            ? "border-white scale-110 shadow-xl"
            : "border-transparent opacity-60 hover:opacity-100"
        }`}
      />
    ))}
  </div>
</div>




  </div>
 )}




{/* ================= PROPERTY DETAILS ================= */}
<div className="mt-12 max-w-7xl mx-auto px-6 lg:flex gap-12">

  {/* LEFT SIDE CONTENT */}
  <div className="flex-1">

    {/* TITLE */}
    <h1 className="text-3xl font-bold">{rental.propertyInfo.name || ""}</h1>

    {/* ADDRESS */}
      <MapPin size={16} className="mr-2" />
      <p className="flex items-center text-gray-500 italic mt-2">
       {rental.propertyInfo.address || ""}
      </p>

    {/* BASIC INFO GRID */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

      <div className="border p-4 rounded-xl shadow-sm">
        <IoHomeOutline className="text-indigo-600 text-xl" />
        <p className="text-xs text-gray-500">Type</p>
        <p className="font-bold">{rental.propertyInfo.type || ""}</p>
      </div>

      <div className="border p-4 rounded-xl shadow-sm">
        <BiMaleFemale className="text-indigo-600 text-xl" />
        <p className="text-xs text-gray-500">Guests</p>
        <p className="font-bold">{rental.accommodation.maxGuests || 1}</p>
      </div>

      <div className="border p-4 rounded-xl shadow-sm">
        <IoBed className="text-indigo-600 text-xl" />
        <p className="text-xs text-gray-500">Bedrooms</p>
        <p className="font-bold">{rental.accommodation.bedrooms || 0}</p>
      </div>

      <div className="border p-4 rounded-xl shadow-sm">
        <IoHomeOutline className="text-indigo-600 text-xl" />
        <p className="text-xs text-gray-500">Bathrooms</p>
        <p className="font-bold">{rental.accommodation.bathrooms || 0}</p>
      </div>
    </div>

    {/* ================= DESCRIPTION ================= */}
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-3">Description</h2>
      <div className="bg-white p-5 border rounded-xl shadow-sm leading-relaxed text-gray-700 whitespace-pre-line">
        {rental.propertyInfo.description} 
      </div>
    </div>

    {/* ================= AMENITIES ================= */}
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Amenities</h2>

      <div className="bg-white p-5 border rounded-xl shadow-sm">
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          {rental.amenities.map((amenity, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-green-600" />
              {amenity}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* ================= TERMS & RULES ================= */}
    <div className="mt-12 mb-12 bg-white p-6 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Terms & Rules</h2>

      <ul className="space-y-3 text-gray-700 text-sm">

        <li>
          <strong>Smoking:</strong>{" "}
          {rental.policies.smoking ? "Allowed" : "Not Allowed"}
        </li>

        <li>
          <strong>Pets:</strong>{" "}
          {rental.policies.pets ? "Allowed" : "Not Allowed"}
        </li>

        <li>
          <strong>Parties:</strong>{" "}
          {rental.policies.party ? "Allowed" : "Not Allowed"}
        </li>

        <li>
          <strong>Children:</strong>{" "}
          {rental.policies.children ? "Allowed" : "Not Allowed"}
        </li>

        {rental.policies.cancellationPolicy && (
          <li>
            <strong>Cancellation:</strong>{" "}
            {rental.policies.cancellationPolicy}
          </li>
        )}

        {rental.policies.damagePolicy && (
          <li>
            <strong>Damage Policy:</strong>{" "}
            {rental.policies.damagePolicy}
          </li>
        )}

        {rental.policies.checkedInTime && (
          <li>
            <strong>Check-In Time:</strong>{" "}
            {rental.policies.checkedInTime }
           </li>  
        )}

        {rental.policies.checkedOutTime && (
          <li>
            <strong>Check-Out Time:</strong>{" "}
            {rental.policies.checkedOutTime}
          </li>
        )}
      </ul>
    </div>

  </div>

{/* ================= RIGHT PANEL — BOOKING FORM ================= */}
<div className="lg:w-[400px] mt-12 lg:mt-0">

  <div className="sticky top-28 p-6 border bg-white rounded-2xl shadow-xl">

    {/* PRICE HEADER */}
    <h2 className="text-2xl font-bold text-green-600">
      ${rental?.propertyInfo?.pricePerNight || 0} / Week
    </h2>

    <p className="text-gray-500 text-sm mt-1">
      Dynamic pricing based on season and duration
    </p>

    <hr className="my-4" />

    {/* ERROR MESSAGE */}
    {bookingError && (
      <p className="bg-red-50 p-3 border border-red-200 text-red-600 rounded">
        {bookingError}
      </p>
    )}

    {/* BOOKING FORM */}
    <form onSubmit={handleBookingSubmit} className="space-y-6">

      {/* ================= GUEST INFORMATION ================= */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          👤 Guest Information
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            name="guestName"
            value={bookingData.guestName}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Full Name *"
            required
          />

          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Email Address *"
            required
          />

          <input
            type="tel"
            name="phone"
            value={bookingData.phone}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Phone Number *"
            required
          />
        </div>
      </div>

      <hr />

      {/* ================= BOOKING DETAILS ================= */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">
          📅 Booking Details
        </h3>

        <div className="space-y-3">
          <input
            type="date"
            name="checkInDate"
            value={bookingData.checkInDate}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="date"
            name="checkOutDate"
            value={bookingData.checkOutDate}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <select
            name="guests"
            value={bookingData.guests}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
          >
            {[...Array(rental.accommodation.maxGuests || 1)].map((_, i) => (
              <option key={i}>{i + 1} Guest</option>
            ))}
          </select>

          <textarea
            name="message"
            value={bookingData.message}
            onChange={handleBookingInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Message for Host (optional)"
            rows={3}
          ></textarea>
        </div>
      </div>

      {/* ================= PRICE BREAKDOWN (LIVE) ================= */}
      {calculateStayDuration() > 0 && (() => {
        const p = calculatePricing();
        return (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold mb-2">Pricing Summary</h4>

            <div className="flex justify-between text-sm">
              <span>Nights:</span> <span>{p.nights}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Base Price:</span> <span>${p.base}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Cleaning Fee:</span> <span>${p.cleaning}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Service Fee:</span> <span>${p.serviceFee}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Taxes:</span> <span>${p.taxes}</span>
              </div>

            <div className="flex justify-between font-bold border-t pt-2 mt-2 text-indigo-700">
              <span>Total:</span> <span>${p.total}</span>
            </div>
          </div>
        );
      })()}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={bookingLoading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        {bookingLoading ? "Submitting..." : "Submit Booking Request"}
      </button>

      {/* NOTE */}
      <p className="text-center text-xs text-gray-400 mt-2">
        • No booking fees • 50% deposit required to secure reservation •<br />
        Balance due 60 days prior to arrival
      </p>
    </form>
  </div>
</div>
</div>
</>
 );
};

export default RentalDetail;
