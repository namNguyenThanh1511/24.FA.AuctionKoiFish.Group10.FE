import React from "react";
import "./Card.css";

const Card = ({
  image,
  title,
  id,
  breeder,
  length,
  sex,
  age,
  stars,
  price,
  status,
  likes,
  variety,
}) => {
  return (
    <div className="card-container">
      <div className="card-header">
        <img src={image} alt="koi fish" className="card-image" />
        <div className="card-likes">
          <span>{likes}</span>
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-id">{id}</p> {/* Hiển thị id ở đây */}
        <p className="card-status">{status}</p>
        <div className="card-rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`star ${index < stars ? "filled" : ""}`}
            >
              ★
            </span>
          ))}
        </div>
        <div className="card-price">${price}</div>
        <div className="card-info">
          <p>
            <strong>Breeder: </strong>
            {breeder}
          </p>
          <p>
            <strong>Length: </strong>
            {length}cm
          </p>
          <p>
            <strong>Sex: </strong>
            {sex}
          </p>
          <p>
            <strong>Age: </strong>
            {age}
          </p>
          <p>
            <strong>Variety: </strong>
            {variety}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
