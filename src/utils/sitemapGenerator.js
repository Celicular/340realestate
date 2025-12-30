// Sitemap generator for 340 Real Estate
import { getRentalProperties } from '../firebase/firestore';

export const generateSitemap = async () => {
  const baseUrl = 'https://340realestate.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/properties', priority: '0.9', changefreq: 'daily' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/attractions', priority: '0.6', changefreq: 'monthly' },
    { url: '/testimonials', priority: '0.6', changefreq: 'monthly' },
    { url: '/incentive', priority: '0.5', changefreq: 'monthly' },
    { url: '/land-properties', priority: '0.7', changefreq: 'weekly' },
    { url: '/sales-history', priority: '0.6', changefreq: 'weekly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-use', priority: '0.3', changefreq: 'yearly' }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Add static pages
  staticPages.forEach(page => {
    sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  try {
    // Add dynamic rental property pages
    const rentalsResult = await getRentalProperties({ status: 'approved' });
    if (rentalsResult.success) {
      rentalsResult.data.forEach(rental => {
        const slug = rental.propertyInfo?.slug;
        if (slug) {
          sitemapXml += `
  <url>
    <loc>${baseUrl}/rental/${slug}</loc>
    <lastmod>${rental.updatedAt ? new Date(rental.updatedAt.seconds * 1000).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
          
          // Add images for the rental
          if (rental.media?.imageLinks && rental.media.imageLinks.length > 0) {
            rental.media.imageLinks.forEach(imageUrl => {
              if (imageUrl && imageUrl.trim() !== '') {
                sitemapXml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:caption>${rental.propertyInfo?.name || 'Luxury Rental in St. John'}</image:caption>
      <image:title>${rental.propertyInfo?.name || 'Vacation Rental'}</image:title>
    </image:image>`;
              }
            });
          }
          
          sitemapXml += `
  </url>`;
        }
      });
    }
  } catch (error) {
    console.error('Error generating sitemap for rentals:', error);
  }

  sitemapXml += `
</urlset>`;

  return sitemapXml;
};

export const generateRobotsTxt = () => {
  const baseUrl = 'https://340realestate.com';
  
  return `User-agent: *
Allow: /

# Block access to admin and private areas
Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/
Disallow: /debug/

# Allow important pages
Allow: /properties
Allow: /rental/
Allow: /blog/
Allow: /contact
Allow: /about

# Crawl delay
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;
};

// Function to download sitemap (for development)
export const downloadSitemap = async () => {
  try {
    const sitemap = await generateSitemap();
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

// Function to download robots.txt (for development)
export const downloadRobotsTxt = () => {
  try {
    const robots = generateRobotsTxt();
    const blob = new Blob([robots], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
  }
};