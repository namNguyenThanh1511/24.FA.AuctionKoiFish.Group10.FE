import React from "react";
import "./Card.css";

const Card = ({
  image,
  title, // Nhận title từ props
  name, // Nhận name từ props
  breeder,
  length,
  sex,
  age,
  countdown,
  price,
  likes,
  variety,
  auctionStatus,
  auctionType,
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
        {/* Hiển thị title ở đầu */}
        <h3 className="card-title">{title}</h3>
        {/* Hiển thị countdown ở trên giá */}
        <div className="card-countdown">{countdown}</div>
        <div className="card-price">${price}</div> {/* Giá tiền */}
        {/* Hiển thị name ở dưới giá */}
        <h4 className="card-name">{name}</h4> {/* Hiển thị name */}
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
        {/* Hiển thị auctionStatus và auctionType */}
        <div className="card-status-type">
          <p className="card-status">
            <strong>Status: </strong>
            {auctionStatus}
          </p>
          <p className="card-type">
            <strong>Type: </strong>
            {auctionType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
