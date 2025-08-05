import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { useAuthStore } from '@/store/authStore';
import { Rating } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductRatingProps {
  productId: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    average_rating: 0,
    total_ratings: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchRatings();
    fetchStats();
    if (isAuthenticated) {
      fetchUserRating();
    }
  }, [productId, isAuthenticated]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings/user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserRating(data);
        setNewRating(data.rating);
        setNewReview(data.review || '');
      } else if (response.status !== 404) {
        console.error('Error fetching user rating');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const submitRating = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to rate this product');
      return;
    }

    if (newRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rating: newRating,
          review: newReview.trim() || undefined
        }),
      });

      if (response.ok) {
        toast.success(userRating ? 'Rating updated successfully' : 'Rating added successfully');
        await fetchRatings();
        await fetchStats();
        await fetchUserRating();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async () => {
    if (!userRating) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Rating deleted successfully');
        setUserRating(null);
        setNewRating(0);
        setNewReview('');
        await fetchRatings();
        await fetchStats();
      } else {
        toast.error('Failed to delete rating');
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Failed to delete rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.average_rating.toFixed(1)}</div>
              <StarRating rating={stats.average_rating} />
              <div className="text-sm text-gray-600 mt-1">
                {stats.total_ratings} review{stats.total_ratings !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-6">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: stats.total_ratings > 0 
                          ? `${(stats.distribution[star as keyof typeof stats.distribution] / stats.total_ratings) * 100}%` 
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="text-sm w-8 text-gray-600">
                    {stats.distribution[star as keyof typeof stats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Rating */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>
              {userRating ? 'Update Your Rating' : 'Rate This Product'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <StarRating
                rating={newRating}
                readonly={false}
                onRatingChange={setNewRating}
                size="lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Review (Optional)
              </label>
              <Textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReview.length}/1000 characters
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={submitRating}
                disabled={loading || newRating === 0}
              >
                {loading ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
              </Button>
              
              {userRating && (
                <Button
                  variant="outline"
                  onClick={deleteRating}
                  disabled={loading}
                >
                  Delete Rating
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{rating.user_name}</span>
                      <StarRating rating={rating.rating} size="sm" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(rating.created_at)}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-700">{rating.review}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRating;
