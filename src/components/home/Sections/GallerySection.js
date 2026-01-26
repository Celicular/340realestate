import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import image1 from "../../../assets/gallery/attraction1.jpg";
import image2 from "../../../assets/gallery/attraction2.jpg";
import image3 from "../../../assets/gallery/attraction3.jpg";

import image14 from "../../../assets/gallery/mls1.jpg";
import image9 from "../../../assets/gallery/mls2.jpg";
import image10 from "../../../assets/gallery/mls3.jpg";
import image11 from "../../../assets/gallery/mls4.jpg";
import image12 from "../../../assets/gallery/mls5.jpg";

import image13 from "../../../assets/gallery/saleshistory1.jpeg";
import image15 from "../../../assets/gallery/saleshistory2.jpeg";
import image16 from "../../../assets/gallery/saleshistory3.jpg";
import image17 from "../../../assets/gallery/saleshistory4.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const imagesPerPage = 8;

  const galleryImages = [
    {
      id: 1,
      src: image1,
      alt: "Desert Villa view",
      category: "Villa",
    },
    {
      id: 2,
      src: image2,
      alt: "Desert Villa Terrace",
      category: "Terrace",
    },
    {
      id: 3,
      src: image3,
      alt: "Desert Villa Mountain View",
      category: "Mountain ",
    },
    {
      id: 9,
      src: image9,
    },
    {
      id: 10,
      src: image10,
    },
    {
      id: 11,
      src: image11,
    },
    {
      id: 12,
      src: image12,
    },
    {
      id: 13,
      src: image13,
    },
    {
      id: 14,
      src: image14,
    },
    {
      id: 15,
      src: image15,
    },
    {
      id: 16,
      src: image16,
    },
    {
      id: 17,
      src: image17,
    },
  ];

  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);

  const paginatedImages = galleryImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage,
  );

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex =
      currentImageIndex === 0
        ? galleryImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#3c6a72] mb-4">
            Gallery
          </h2>
          <p className="text-lg text-gray-600">
            Discover the beauty of St. John through our curated collection
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {paginatedImages.map((image, index) => {
            const globalIndex = (currentPage - 1) * imagesPerPage + index;
            return (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => openModal(image, globalIndex)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 text-white rounded-full bg-[#3c6a72] hover:bg-[#2f8594] disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-6 py-2 text-white rounded-full bg-[#3c6a72] hover:bg-[#2f8594] disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative max-w-4xl max-h-full mx-4">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white  hover:text-gray-300 transition-colors duration-300 z-10"
              >
                <X size={32} />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 z-10"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 z-10"
              >
                <ChevronRight size={32} />
              </button>

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-semibold">{selectedImage.alt}</p>
                <p className="text-sm opacity-90">{selectedImage.category}</p>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 text-white text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
