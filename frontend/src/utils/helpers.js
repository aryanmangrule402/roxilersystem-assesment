// src/utils/helpers.js
export const calculateAverageRating = (ratingsArray) => {
  if (!ratingsArray || ratingsArray.length === 0) {
    return 0;
  }
  const total = ratingsArray.reduce((acc, rating) => acc + rating.rating, 0);
  return (total / ratingsArray.length).toFixed(1); // One decimal place
};