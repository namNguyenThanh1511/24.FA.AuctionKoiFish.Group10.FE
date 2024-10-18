import React from "react";
import "./Card.css";
import { Button } from "antd"; // Nhập Button từ Ant Design

const Card = ({
  image,
  title,
  name,
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
  onViewClick, // Thêm prop cho nút View
  auctionSessionId, // Thêm prop auctionSessionId nếu cần
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
        <div className="card-countdown">{countdown}</div>
        <div className="card-price">${price}</div>
        <h4 className="card-name">{name}</h4>
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
        <Button className="view-button" onClick={onViewClick}>
          View
        </Button>
      </div>
    </div>
  );
};

export default Card;
