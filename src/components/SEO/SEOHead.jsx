import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  canonicalUrl,
  type = 'website',
  price,
  currency = 'USD',
  availability = 'instock',
  condition = 'new',
  author = '340 Real Estate St. John',
  publishedTime,
  modifiedTime,
  jsonLd,
  structuredData
}) => {
  // Construct full title
  const fullTitle = title 
    ? `${title} | 340 Real Estate St. John`
    : '340 Real Estate St. John - Luxury Real Estate & Vacation Rentals in USVI';

  // Default description
  const defaultDescription = 'Discover luxury real estate and vacation rentals in St. John, USVI. Premium villas, condos, and properties in paradise. Expert real estate services in the Virgin Islands.';
  
  // Default keywords
  const defaultKeywords = 'St John real estate, USVI property, Virgin Islands rentals, luxury villas, vacation rentals, Caribbean real estate, St John property sales, USVI homes, tropical properties, island living';

  // Get current URL
  const currentUrl = canonicalUrl || url || (typeof window !== 'undefined' ? window.location.href : 'https://340realestate.com');
  
  // Default social image
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://340realestate.com';
  const defaultImage = `${baseUrl}/images/hero1.jpeg`;
  const socialImage = image || defaultImage;

  // Create meta tags array to avoid fragments
  const metaTags = [
    // Basic Meta Tags
    <title key="title">{fullTitle}</title>,
    <meta key="description" name="description" content={description || defaultDescription} />,
    <meta key="keywords" name="keywords" content={keywords || defaultKeywords} />,
    <meta key="author" name="author" content={author} />,
    <meta key="robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />,
    <link key="canonical" rel="canonical" href={currentUrl} />,
    
    // Open Graph Tags
    <meta key="og:title" property="og:title" content={fullTitle} />,
    <meta key="og:description" property="og:description" content={description || defaultDescription} />,
    <meta key="og:type" property="og:type" content={type} />,
    <meta key="og:url" property="og:url" content={currentUrl} />,
    <meta key="og:image" property="og:image" content={socialImage} />,
    <meta key="og:image:width" property="og:image:width" content="1200" />,
    <meta key="og:image:height" property="og:image:height" content="1200" />,
    <meta key="og:image:alt" property="og:image:alt" content={title || '340 Real Estate St. John Property'} />,
    <meta key="og:site_name" property="og:site_name" content="340 Real Estate St. John" />,
    <meta key="og:locale" property="og:locale" content="en_US" />,
    
    // Twitter Card Tags
    <meta key="twitter:card" name="twitter:card" content="summary_large_image" />,
    <meta key="twitter:title" name="twitter:title" content={fullTitle} />,
    <meta key="twitter:description" name="twitter:description" content={description || defaultDescription} />,
    <meta key="twitter:image" name="twitter:image" content={socialImage} />,
    <meta key="twitter:image:alt" name="twitter:image:alt" content={title || '340 Real Estate St. John Property'} />,
    
    // Geographic tags for St. John, USVI
    <meta key="geo.region" name="geo.region" content="VI" />,
    <meta key="geo.placename" name="geo.placename" content="St. John, Virgin Islands" />,
    <meta key="geo.position" name="geo.position" content="18.3358;-64.8963" />,
    <meta key="ICBM" name="ICBM" content="18.3358, -64.8963" />,
    
    // Additional SEO tags
    <meta key="theme-color" name="theme-color" content="#0891b2" />,
    <meta key="msapplication-TileColor" name="msapplication-TileColor" content="#0891b2" />
  ];

  // Add conditional meta tags
  if (type === 'article' && publishedTime) {
    metaTags.push(<meta key="article:published_time" property="article:published_time" content={publishedTime} />);
  }
  
  if (type === 'article' && modifiedTime) {
    metaTags.push(<meta key="article:modified_time" property="article:modified_time" content={modifiedTime} />);
  }
  
  if (type === 'article') {
    metaTags.push(<meta key="article:section" property="article:section" content="Real Estate" />);
  }

  if (price) {
    metaTags.push(<meta key="product:price:amount" property="product:price:amount" content={price} />);
    metaTags.push(<meta key="product:price:currency" property="product:price:currency" content={currency} />);
    metaTags.push(<meta key="product:availability" property="product:availability" content={availability} />);
    metaTags.push(<meta key="product:condition" property="product:condition" content={condition} />);
  }

  // Add structured data script if provided
  if (jsonLd || structuredData) {
    try {
      const structuredDataString = JSON.stringify(jsonLd || structuredData, null, 2);
      metaTags.push(
        <script 
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataString }}
        />
      );
    } catch (error) {
      console.warn('Failed to serialize structured data:', error);
    }
  }

  return <Helmet>{metaTags}</Helmet>;
};

export default SEOHead;