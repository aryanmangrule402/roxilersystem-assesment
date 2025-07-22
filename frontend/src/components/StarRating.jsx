// src/components/StarRating.jsx
import React from 'react';
import '../index.css';

const StarRating = ({ rating, maxRating = 5, onRatingChange, editable = false }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= rating ? 'filled' : ''}`}
        onClick={() => editable && onRatingChange(i)}
        style={{ cursor: editable ? 'pointer' : 'default' }}
      >
        &#9733; {/* Unicode star character */}
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;