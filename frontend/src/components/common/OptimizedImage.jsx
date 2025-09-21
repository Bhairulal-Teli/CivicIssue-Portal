import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Image+Not+Available',
  showLoading = true,
  onClick = null 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 image-container">
          <ImageIcon size={24} className="text-gray-400" />
        </div>
      )}
      
      {/* Main image */}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${onClick ? 'cursor-pointer' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        loading="lazy" // Native lazy loading
      />
      
      {/* Error state indicator */}
      {hasError && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
          ⚠️ Image Error
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;