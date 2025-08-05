import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  readonly = true,
  onRatingChange
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isHalfFilled = starRating - 0.5 <= rating && starRating > rating;

          return (
            <button
              key={index}
              type="button"
              className={`
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}
                ${!readonly ? 'focus:outline-none' : ''}
              `}
              onClick={() => handleStarClick(starRating)}
              disabled={readonly}
            >
              <Star
                className={`
                  ${sizeClasses[size]}
                  ${isFilled ? 'fill-yellow-400 text-yellow-400' : 
                    isHalfFilled ? 'fill-yellow-200 text-yellow-400' : 
                    'fill-none text-gray-300'}
                  ${!readonly ? 'hover:text-yellow-400' : ''}
                `}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-2">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
