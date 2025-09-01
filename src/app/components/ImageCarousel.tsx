'use client';

import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  descriptions?: string[]; // Array of descriptions for each image
}

export default function ImageCarousel({ images, alt, descriptions = [] }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="relative">
        {/* Main Image Container */}
        <div className="relative w-full h-80 md:h-96 lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              className={`border-4 border-black absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Image Counter Overlay */}
          <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-full text-base font-medium shadow-lg">
            {currentImageIndex + 1} of {images.length}
          </div>
        </div>

        {/* Description Block */}
        {descriptions && descriptions.length > 0 && descriptions[currentImageIndex] && (
          <div className="mt-4 p-4 bg-white border-2 border-black rounded-lg shadow-lg">
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {descriptions[currentImageIndex]}
            </p>
          </div>
        )}

        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors duration-200 shadow-lg"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors duration-200 shadow-lg"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Navigation Dots */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
