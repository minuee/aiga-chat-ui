import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface FloatStarRatingProps {
  rating: number;
}

const FloatStarRating = ({ rating }: FloatStarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} color="#FFCE05" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} color="#FFCE05" />);
    } else {
      stars.push(<FaStar key={i} color={"#DFE3EA"} />);
    }
  }

  return <div style={{ display: 'flex', gap: '2px', flexDirection:'row' }}>{stars}</div>;
};

export default FloatStarRating;
