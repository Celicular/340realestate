import React from 'react';

/**
 * SEO-optimized image component with lazy loading and proper alt tags
 */
const SEOImage = ({
  src,
  alt,
  title,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  srcSet,
  priority = false,
  ...props
}) => {
  // Generate srcSet for responsive images if not provided
  const generateSrcSet = (imageSrc) => {
    if (srcSet) return srcSet;
    
    const baseSrc = imageSrc.split('.')[0];
    const extension = imageSrc.split('.').pop();
    
    return [
      `${baseSrc}_480w.${extension} 480w`,
      `${baseSrc}_768w.${extension} 768w`,
      `${baseSrc}_1024w.${extension} 1024w`,
      `${baseSrc}_1200w.${extension} 1200w`
    ].join(', ');
  };

  // Generate sizes attribute for responsive images
  const generateSizes = () => {
    if (sizes) return sizes;
    
    return '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px';
  };

  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : loading}
      srcSet={generateSrcSet(src)}
      sizes={generateSizes()}
      {...props}
    />
  );
};

/**
 * Utility function to optimize images for SEO
 */
export const optimizeImageForSEO = (imageData, context = '') => {
  const { src, title, description } = imageData;
  
  // Generate SEO-friendly alt text
  const generateAltText = () => {
    if (imageData.alt) return imageData.alt;
    
    let alt = '';
    if (title) alt += title;
    if (description) alt += ` - ${description}`;
    if (context) alt += ` in ${context}`;
    
    return alt || 'Image';
  };

  // Generate title attribute
  const generateTitle = () => {
    return title || imageData.title || generateAltText();
  };

  return {
    src,
    alt: generateAltText(),
    title: generateTitle(),
    loading: imageData.priority ? 'eager' : 'lazy'
  };
};

/**
 * Gallery component with SEO optimization
 */
export const SEOGallery = ({ images = [], title, description, className = '' }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": title,
    "description": description,
    "image": images.map(img => ({
      "@type": "ImageObject",
      "url": img.src,
      "caption": img.alt || img.caption,
      "width": img.width,
      "height": img.height
    }))
  };

  return (
    <div className={className}>
      {/* Structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Gallery title */}
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => {
          const optimizedImage = optimizeImageForSEO(image, title);
          
          return (
            <figure key={index} className="relative">
              <SEOImage
                {...optimizedImage}
                className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                priority={index < 3} // First 3 images are priority
              />
              {image.caption && (
                <figcaption className="mt-2 text-sm text-gray-600 text-center">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Hero image component with SEO optimization
 */
export const SEOHeroImage = ({ 
  src, 
  alt, 
  title, 
  overlay = true, 
  className = '',
  children 
}) => {
  return (
    <div className={`relative ${className}`}>
      <SEOImage
        src={src}
        alt={alt}
        title={title}
        className="w-full h-full object-cover"
        priority={true}
        loading="eager"
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Property image component with real estate specific SEO
 */
export const PropertyImage = ({ 
  property, 
  image, 
  index = 0, 
  className = '' 
}) => {
  const alt = `${property.title || 'Property'} ${property.location ? `in ${property.location}` : ''} - Image ${index + 1}`;
  const title = `${property.title || 'Luxury Property'} - ${property.type || 'Real Estate'} in St. John, USVI`;

  return (
    <SEOImage
      src={image.src || image}
      alt={alt}
      title={title}
      className={className}
      priority={index === 0}
    />
  );
};

export default SEOImage;