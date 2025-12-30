import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '../../utils/sitemapUtils';

const Breadcrumb = ({ customBreadcrumbs = [] }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from URL path if no custom ones provided
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs.length > 0) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', url: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable name
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle specific routes
      switch (segment) {
        case 'properties':
          name = 'Properties';
          break;
        case 'about':
          name = 'About St. John';
          break;
        case 'contact':
          name = 'Contact Us';
          break;
        case 'blog':
          name = 'Blog';
          break;
        case 'rental':
          name = 'Rental Details';
          break;
        case 'property':
          name = 'Property Details';
          break;
        default:
          // For dynamic segments (IDs), try to decode
          if (segment.length > 10) {
            name = 'Details';
          }
      }

      breadcrumbs.push({
        name,
        url: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  // Generate structured data for SEO
  const structuredData = generateBreadcrumbSchema(
    breadcrumbs.map(crumb => ({
      name: crumb.name,
      url: `https://340realestate.com${crumb.url}`
    }))
  );

  return (
    <>
      {/* Inject structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                )}
                
                {crumb.isActive || index === breadcrumbs.length - 1 ? (
                  <span className="text-slate-600 font-medium flex items-center">
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.url}
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumb;