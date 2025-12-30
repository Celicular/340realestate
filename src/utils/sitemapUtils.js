// Dynamic sitemap generator for 340 Real Estate website

/**
 * Generate XML sitemap with dynamic content from Firebase
 */
export const generateSitemap = async (properties = [], rentals = [], blogs = []) => {
  const baseUrl = 'https://340realestate.com';
  const now = new Date().toISOString();
  
  // Static pages with priority and change frequency
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly', lastmod: now },
    { url: '/properties', priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: '/about', priority: '0.8', changefreq: 'monthly', lastmod: now },
    { url: '/contact', priority: '0.8', changefreq: 'monthly', lastmod: now },
    { url: '/blog', priority: '0.7', changefreq: 'weekly', lastmod: now },
  ];

  // Generate property pages
  const propertyPages = properties.map(property => ({
    url: `/property/${property.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: property.updatedAt || property.createdAt || now
  }));

  // Generate rental pages
  const rentalPages = rentals.map(rental => ({
    url: `/rental/${rental.id}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: rental.updatedAt || rental.createdAt || now
  }));

  // Generate blog pages
  const blogPages = blogs.map(blog => ({
    url: `/blog/${blog.id}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: blog.updatedAt || blog.createdAt || now
  }));

  // Combine all pages
  const allPages = [...staticPages, ...propertyPages, ...rentalPages, ...blogPages];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

/**
 * Generate robots.txt content with sitemap reference
 */
export const generateRobotsTxt = (sitemapUrl = 'https://340realestate.com/sitemap.xml') => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${sitemapUrl}

# Crawl delay for politeness
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /*.json$
Disallow: /debug

# Allow important assets
Allow: /static/
Allow: /images/
Allow: /assets/
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.webp$
Allow: /*.svg$

# Host directive
Host: 340realestate.com`;
};

/**
 * Server-side sitemap generation function (for API routes)
 */
export const createSitemapAPI = async (req, res, properties, rentals, blogs) => {
  try {
    const sitemap = await generateSitemap(properties, rentals, blogs);
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

/**
 * Generate image sitemap for better image SEO
 */
export const generateImageSitemap = (images = []) => {
  const baseUrl = 'https://340realestate.com';
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(img => `  <url>
    <loc>${baseUrl}${img.pageUrl}</loc>
    <image:image>
      <image:loc>${img.imageUrl}</image:loc>
      <image:caption>${img.caption || ''}</image:caption>
      <image:title>${img.title || ''}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

const sitemapUtils = {
  generateSitemap,
  generateRobotsTxt,
  createSitemapAPI,
  generateBreadcrumbSchema,
  generateImageSitemap
};

export default sitemapUtils;