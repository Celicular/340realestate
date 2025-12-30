// SEO utility functions for generating structured data and meta information

export const generatePropertyJsonLd = (property) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.propertyInfo?.name || property.name || "Luxury Property in St. John",
    "description": property.propertyInfo?.description || property.description || "Beautiful property in St. John, USVI",
    "image": property.media?.imageLinks || property.images?.gallery || [baseUrl + "/images/hero1.jpeg"],
    "brand": {
      "@type": "Organization",
      "name": "340 Real Estate St. John",
      "url": baseUrl
    },
    "offers": {
      "@type": "Offer",
      "price": property.propertyInfo?.pricePerNight || property.pricing?.nightly || "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "url": `${baseUrl}${window.location.pathname}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "St. John",
      "addressRegion": "VI",
      "addressCountry": "US",
      "streetAddress": property.propertyInfo?.address || property.location?.address || property.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.3358",
      "longitude": "-64.8963"
    }
  };
};

export const generateRentalJsonLd = (rental) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": rental.propertyInfo?.name || "Luxury Rental in St. John",
    "description": rental.propertyInfo?.description || rental.description || "Beautiful vacation rental in St. John, USVI",
    "image": rental.media?.imageLinks || [baseUrl + "/images/hero1.jpeg"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "St. John",
      "addressRegion": "VI", 
      "addressCountry": "US",
      "streetAddress": rental.propertyInfo?.address || rental.location?.address || rental.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.3358",
      "longitude": "-64.8963"
    },
    "telephone": "+1-340-555-0123",
    "url": `${baseUrl}${window.location.pathname}`,
    "priceRange": "$$-$$$",
    "amenityFeature": rental.amenities ? (
      Array.isArray(rental.amenities) 
        ? rental.amenities.map(amenity => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity,
            "value": true
          }))
        : Object.entries(rental.amenities)
            .filter(([key, value]) => value === true)
            .map(([key]) => ({
              "@type": "LocationFeatureSpecification", 
              "name": key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
              "value": true
            }))
    ) : [],
    "checkinTime": rental.details?.checkInTime || "15:00",
    "checkoutTime": rental.details?.checkOutTime || "11:00",
    "petsAllowed": rental.details?.petFriendly || rental.pets || false,
    "smokingAllowed": rental.details?.smokingAllowed || rental.smoking || false
  };
};

export const generateBlogJsonLd = (blog) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.description,
    "image": blog.image || baseUrl + "/images/hero1.jpeg",
    "author": {
      "@type": "Person",
      "name": blog.author || "340 Real Estate Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "340 Real Estate St. John",
      "logo": {
        "@type": "ImageObject",
        "url": baseUrl + "/logo.png"
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt || blog.publishedAt || blog.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}${window.location.pathname}`
    }
  };
};

export const generateOrganizationJsonLd = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "340 Real Estate St. John",
    "description": "Premier real estate agency specializing in luxury properties and vacation rentals in St. John, USVI",
    "url": baseUrl,
    "logo": baseUrl + "/logo.png",
    "image": baseUrl + "/images/hero1.jpeg",
    "telephone": "+1-340-555-0123",
    "email": "info@340realestate.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "St. John",
      "addressRegion": "VI",
      "addressCountry": "US",
      "streetAddress": "Cruz Bay, St. John"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.3358",
      "longitude": "-64.8963"
    },
    "areaServed": {
      "@type": "State",
      "name": "U.S. Virgin Islands"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "18.3358",
        "longitude": "-64.8963"
      },
      "geoRadius": "50"
    },
    "sameAs": [
      "https://www.facebook.com/340realestate",
      "https://www.instagram.com/340realestate", 
      "https://www.linkedin.com/company/340realestate"
    ]
  };
};

export const generateWebsiteJsonLd = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "340 Real Estate St. John",
    "description": "Luxury real estate and vacation rentals in St. John, USVI",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": baseUrl + "/properties?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "340 Real Estate St. John",
      "logo": baseUrl + "/logo.png"
    }
  };
};

export const generateBreadcrumbJsonLd = (breadcrumbs) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": baseUrl + breadcrumb.path
    }))
  };
};

// SEO utility functions
export const generateSEOTitle = (pageTitle, location = '', propertyType = '') => {
  const parts = [pageTitle, location, propertyType, '340 Real Estate St. John'].filter(Boolean);
  return parts.join(' | ');
};

export const generateSEODescription = (property, type = 'rental') => {
  const propertyName = property?.propertyInfo?.name || property?.name || 'luxury property';
  const bedrooms = property?.accommodation?.bedrooms || property?.details?.bedrooms || '';
  const guests = property?.accommodation?.maxGuests || property?.details?.maxOccupancy || '';
  const location = 'St. John, USVI';
  
  if (type === 'rental') {
    return `Book ${propertyName} - ${bedrooms ? bedrooms + ' bedroom ' : ''}luxury vacation rental in ${location}. ${guests ? 'Sleeps ' + guests + '. ' : ''}Premium amenities, stunning views. Book direct for best rates.`;
  } else if (type === 'sale') {
    return `${propertyName} for sale in ${location}. ${bedrooms ? bedrooms + ' bedroom ' : ''}luxury real estate with premium features. Contact 340 Real Estate for viewing.`;
  }
  
  return `Discover ${propertyName} in ${location}. Luxury real estate and vacation rentals by 340 Real Estate St. John.`;
};

export const generateKeywords = (property, type = 'rental', additionalKeywords = []) => {
  const baseKeywords = [
    'St John real estate',
    'USVI property',
    'Virgin Islands',
    '340 Real Estate',
    'Caribbean real estate',
    'tropical property',
    'island living'
  ];
  
  const rentalKeywords = [
    'vacation rental',
    'luxury villa',
    'beach house',
    'holiday rental',
    'short term rental',
    'vacation home'
  ];
  
  const saleKeywords = [
    'property for sale',
    'luxury home',
    'real estate listing',
    'house for sale',
    'villa for sale',
    'investment property'
  ];
  
  const propertySpecific = [];
  
  if (property?.accommodation?.bedrooms || property?.details?.bedrooms) {
    const bedrooms = property.accommodation?.bedrooms || property.details?.bedrooms;
    propertySpecific.push(`${bedrooms} bedroom`);
  }
  
  if (property?.propertyInfo?.type) {
    propertySpecific.push(property.propertyInfo.type.toLowerCase());
  }
  
  const typeKeywords = type === 'rental' ? rentalKeywords : saleKeywords;
  
  return [...baseKeywords, ...typeKeywords, ...propertySpecific, ...additionalKeywords].join(', ');
};