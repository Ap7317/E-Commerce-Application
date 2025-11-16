import React from 'react';

interface StarRatingProps {
	rating: number;
	max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			{Array.from({ length: max }).map((_, i) => (
				<span key={i} style={{ color: i < rating ? '#facc15' : '#e5e7eb', fontSize: '1.2em' }}>
					★
				</span>
			))}
		</div>
	);
};

export default StarRating;
