export const makeSlug = (item) => {
  if (!item) return "";

  // ✅ 1. Highest priority: stored slug
  const storedSlug =
    item?.property?.propertyInfo?.slug ||
    item?.propertyInfo?.slug ||
    item?.slug;

  if (storedSlug) {
    return storedSlug.toString().trim();
  }

  // ✅ 2. Fallback: name/title
  const name =
    item?.property?.propertyInfo?.name ||
    item?.propertyInfo?.name ||
    item?.title ||
    item?.name ||
    `property-${item.id || ""}`;

  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
