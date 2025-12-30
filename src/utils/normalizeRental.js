// ===============================
// UNIVERSAL FIRESTORE RENTAL NORMALIZER
// ===============================

export const generateSlugFromRental = (r) => {
  if (!r) return "";

  // Preferred slug
  if (r.propertyInfo?.slug) return r.propertyInfo.slug;

  const name = r.propertyInfo?.name || r.name || r.title || "";

  if (!name) return r.id;

  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const normalizeRental = (r) => {
  if (!r) return null;

  // ---------- PROPERTY INFO ----------
  const rawInfo =
    r.propertyInfo ||
    r.property?.propertyInfo || {
      name: r.name,
      type: r.type,
      address: r.address,
      pricePerNight: r.pricePerNight,
      description: r.description,
    };

  // ---------- ACCOMMODATION ----------
  const rawAcc =
    r.accommodation || {
      bedrooms: r.bedrooms,
      bathrooms: r.bathrooms,
      maxGuests: r.maxGuests || r.maxOccupancy,
    };

  // ---------- IMAGES ----------
  const rawImages =
    r.media?.imageList ||
    r.media?.imageLinks ||
    r.imageList ||
    r.imageLinks ||
    r.images ||
    [];

  // ---------- POLICIES ----------
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
      id: r.id || "",
      name: rawInfo.name || "",
      type: rawInfo.type || "",
      pricePerNight: rawInfo.pricePerNight || "",
      address: rawInfo.address || "",
      description: rawInfo.description || "",
      slug: generateSlugFromRental(r),
    },

    accommodation: {
      bedrooms: rawAcc?.bedrooms || 0,
      bathrooms: rawAcc?.bathrooms || 0,
      maxGuests: rawAcc?.maxGuests || rawAcc?.maxOccupancy || 0,
    },

    media: {
      imageList: Array.isArray(rawImages) ? rawImages : [],
    },

    image:
      Array.isArray(rawImages) && rawImages.length > 0
        ? rawImages[0]
        : r.image || "",

    rates: {
      baseRate: r.rates?.baseRate || "",
      seasonalRate: r.rates?.seasonalRate || "",
    },

    policies: {
      cancellationPolicy: rawPolicies?.cancellationPolicy || "",
      smoking: rawPolicies?.smoking ?? false,
      pets: rawPolicies?.pets ?? false,
      party: rawPolicies?.party ?? false,
      children: rawPolicies?.children ?? true,
      checkedInTime: rawPolicies?.checkedInTime || "",
      checkedOutTime: rawPolicies?.checkedOutTime || "",
    },

    details: {
      squareFeet: r.details?.squareFeet || "",
      yearBuilt: r.details?.yearBuilt || "",
      lotSize: r.details?.lotSize || "",
    },

    submittedAt: r.submittedAt || null,
    reviewedAt: r.reviewedAt || null,
    updatedAt: r.updatedAt || null,
  };
};
