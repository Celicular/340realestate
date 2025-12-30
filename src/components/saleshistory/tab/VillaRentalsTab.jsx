import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVillas } from "../../../redux/slices/villaSlice";
import { Link } from "react-router-dom";

const VillaRentalsTab = () => {
  const dispatch = useDispatch();
  const { villas, loading, error } = useSelector((state) => state.villa);

  useEffect(() => {
    if (villas.length === 0 && !loading && !error) {
      dispatch(fetchVillas());
    }
  }, [dispatch, villas.length, loading, error]);

  if (loading) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-700">
          Villa Rentals
        </h2>
        <div className="text-center">Loading villas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-700">
          Villa Rentals
        </h2>
        <div className="text-center text-red-500">Error loading villas: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 text-green-700">
        Villa Rentals
      </h2>

      {villas.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No villa rentals available at the moment.</p>
          <p className="mt-2">Please check back later for our premium villa collection.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa, index) => (
            <motion.div
              key={villa.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              {villa.media?.imageLinks && villa.media.imageLinks.length > 0 ? (
                <img
                  src={villa.media.imageLinks[0]}
                  alt={villa.propertyInfo?.name || 'Villa'}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {villa.propertyInfo?.name || 'Unnamed Villa'}
                </h3>
                
                {villa.propertyInfo?.address && (
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <MapPin size={16} />
                    {villa.propertyInfo.address}
                  </p>
                )}
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {villa.description || 'Luxury villa rental in St. John with premium amenities and stunning views.'}
                </p>
                
                {villa.accommodation && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {villa.accommodation.bedrooms && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        {villa.accommodation.bedrooms} Bedrooms
                      </span>
                    )}
                    {villa.accommodation.bathrooms && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        {villa.accommodation.bathrooms} Baths
                      </span>
                    )}
                    {villa.accommodation.maxGuests && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        {villa.accommodation.maxGuests} Guests
                      </span>
                    )}
                    {villa.amenities && villa.amenities.length > 0 && (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        {villa.amenities.length} Amenities
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  {villa.pricing?.pricePerNight && (
                    <div className="text-lg font-bold text-blue-600">
                      ${villa.pricing.pricePerNight}/week
                    </div>
                  )}
                  
                  <Link
                    to={`/villa-rentals/${villa.propertyInfo?.slug || villa.id}`}
                    className="inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    More Information
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VillaRentalsTab;
