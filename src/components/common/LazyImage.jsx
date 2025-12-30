import React, { useState, useRef, useEffect } from 'react';

/**
 * Enhanced lazy loading image component with intersection observer
 */
const LazyImage = ({
  src,
  alt,
  title,
  width,
  height,
  className = '',
  placeholder = 'blur',
  priority = false,
  sizes,
  srcSet,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  // Handle image load
  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) onLoad(event);
  };

  // Handle image error
  const handleError = (event) => {
    setHasError(true);
    if (onError) onError(event);
  };

  // Generate blur placeholder
  const getPlaceholder = () => {
    if (placeholder === 'blur') {
      return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGxwf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7m8tXkgmmitrK0gjSCJFOSqqNlHQAU1IUJ8o3w';
    }
    return placeholder;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (imageSrc) => {
    if (srcSet) return srcSet;
    
    if (!imageSrc) return '';
    
    try {
      const url = new URL(imageSrc, window.location.origin);
      const basePath = url.pathname.split('.')[0];
      const extension = url.pathname.split('.').pop();
      
      return [
        `${url.origin}${basePath}_480w.${extension} 480w`,
        `${url.origin}${basePath}_768w.${extension} 768w`,
        `${url.origin}${basePath}_1024w.${extension} 1024w`,
        `${url.origin}${basePath}_1200w.${extension} 1200w`
      ].join(', ');
    } catch {
      return '';
    }
  };

  // Generate sizes attribute
  const generateSizes = () => {
    if (sizes) return sizes;
    return '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px';
  };

  const imageClasses = `
    ${className}
    ${!isLoaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300 ease-in-out
  `.trim();

  return (
    <div 
      ref={imgRef}
      className="relative overflow-hidden"
      style={{ width, height, ...style }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: placeholder === 'blur' ? `url("${getPlaceholder()}")` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {placeholder !== 'blur' && (
            <div className="text-gray-400 text-sm">Loading...</div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {(isInView || priority) && !hasError && (
        <img
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          className={imageClasses}
          loading={priority ? 'eager' : 'lazy'}
          srcSet={generateSrcSet(src)}
          sizes={generateSizes()}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

/**
 * Simple lazy image component for basic use cases
 */
export const SimpleLazyImage = ({ src, alt, className = '', priority = false, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
};

/**
 * Background image component with lazy loading
 */
export const LazyBackgroundImage = ({ 
  src, 
  alt, 
  className = '', 
  children, 
  priority = false,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const divRef = useRef(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src]);

  return (
    <div
      ref={divRef}
      className={`${className} ${!isLoaded ? 'bg-gray-200 animate-pulse' : ''}`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      role="img"
      aria-label={alt}
      {...props}
    >
      {children}
    </div>
  );
};

export default LazyImage;