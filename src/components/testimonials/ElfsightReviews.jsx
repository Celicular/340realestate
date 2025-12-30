import React, { useEffect } from 'react';

const ElfsightReviews = () => {
  useEffect(() => {
    // Wait for the Elfsight script to load and initialize
    const timer = setTimeout(() => {
      // Check if the widget element exists and has content
      const widgetElement = document.querySelector('.elfsight-app-fff42de8-2d55-49e6-af3a-a5756f1fe2ce');
      if (widgetElement && !widgetElement.innerHTML.trim()) {
        console.log('Elfsight widget not loaded, retrying...');
        // Force a reload of the widget
        widgetElement.setAttribute('data-elfsight-app-lazy', '');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="elfsight-reviews-widget max-w-6xl mx-auto px-4">
      <div 
        className="elfsight-app-fff42de8-2d55-49e6-af3a-a5756f1fe2ce" 
        data-elfsight-app-lazy
        style={{
          minHeight: '400px',
          width: '100%'
        }}
      />
    </div>
  );
};

export default ElfsightReviews;
