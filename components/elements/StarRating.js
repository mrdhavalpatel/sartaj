// StarRating.js
import React, { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

const StarRating = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleStarClick = (newRating) => {
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <div style={{ display: "flex", fontSize: "24px", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          onClick={() => handleStarClick(index)}
          style={{
            marginRight: "5px",
            color: index <= rating ? "#ffc107" : "black",
          }}
        >
          {index <= rating ? <BsStarFill /> : <BsStar />}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
