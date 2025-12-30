import React from "react";
import TestimonialHero from "./../components/testimonials/TestimonialHero";
import ReviewsSection from "./../components/testimonials/ReviewsSection";

const Testimonial = () => {
  return (
    <div className="App relative scroll-smooth">
      <TestimonialHero />
      <ReviewsSection />
    </div>
  );
};

export default Testimonial;
