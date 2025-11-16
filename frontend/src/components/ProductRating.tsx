import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useAuthStore } from '../store/authStore';
import { toast } from '../lib/toast';
import api from '../lib/api';

interface Rating {
  id: number;
  user_id: number;
  user_name: string;
  rating: number;
  review: string;
  created_at: string;
}

interface ProductRatingProps {
  productId: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
  const { user } = useAuthStore();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [productId]);

  const fetchRatings = async () => {
    try {
      const response = await api.get(`/ratings/product/${productId}`);
      const ratingsData = response.data;
      setRatings(ratingsData);
      setTotalRatings(ratingsData.length);
      
      if (ratingsData.length > 0) {
        const avg = ratingsData.reduce((sum: number, r: Rating) => sum + r.rating, 0) / ratingsData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      // Check if user has already rated
      if (user) {
        const userHasRated = ratingsData.some((r: Rating) => r.user_id === user.id);
        setHasUserRated(userHasRated);
        
        if (userHasRated) {
          const existingRating = ratingsData.find((r: Rating) => r.user_id === user.id);
          if (existingRating) {
            setUserRating(existingRating.rating);
            setUserReview(existingRating.review || '');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSubmitRating = async () => {
    if (!user) {
      toast.error('Please login to rate this product');
      return;
    }

    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/ratings', {
        product_id: productId,
        rating: userRating,
        review: userReview,
      });

      toast.success('Your rating has been submitted');

      // Refresh ratings
      fetchRatings();
      setUserReview('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? (hoveredRating || userRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center my-2">{renderStars(averageRating)}</div>
              <div className="text-sm text-gray-600">{totalRatings} ratings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Rating Form */}
      {user && !hasUserRated && (
        <Card>
          <CardHeader>
            <CardTitle>Rate this Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              {renderStars(userRating, true)}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Share your experience with this product..."
              />
            </div>
            <Button onClick={handleSubmitRating} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ratings List */}
      {ratings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings.map((rating, index) => (
                <div key={rating.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{rating.user_name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {renderStars(rating.rating)}
                    {rating.review && (
                      <p className="text-gray-700 mt-2">{rating.review}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductRating;
