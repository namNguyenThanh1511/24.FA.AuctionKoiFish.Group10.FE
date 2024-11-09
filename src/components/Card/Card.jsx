import React from "react";
import "./Card.css";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons"; // Import biểu tượng mũi tên

const Card = ({
  image,
  title,
  name,
  breeder,
  size,
  weight,
  sex,
  age,
  countdown,
  price,
  variety,
  auctionStatus,
  auctionType,
  onViewClick,
}) => {
  return (
    <div className="card-container">
      <div className="card-header">
        <img src={image} alt="koi fish" className="card-image" />
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <h4 className="card-name">{name}</h4>
          <div className="card-details">
            <p>
              <strong>Breeder: </strong>
              {breeder}
            </p>
            <p>
              <strong>Variety: </strong>
              {variety}
            </p>
            <p>
              <strong>Age: </strong>
              {age}
            </p>
            <p>
              <strong>Sex: </strong>
              {sex}
            </p>
            <p>
              <strong>Size: </strong>
              {size} cm
            </p>
            <p>
              <strong>Weight: </strong>
              {weight} cm
            </p>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <h4>Time left</h4>
        <div className="card-countdown">{countdown}</div>
        {/* Định dạng VNĐ cho giá */}
        <div className="card-price">{price.toLocaleString("vi-VN")}₫</div>

        <div className="card-status-type">
          <p className={`card-status ${auctionStatus.toLowerCase()}`}>
            <strong>Status: </strong>
            <span>{auctionStatus}</span>
          </p>

          <p className={`card-type ${auctionType.toLowerCase()}`}>
            <strong>Type: </strong>
            {auctionType}
          </p>
        </div>
        <Button
          className="view-button"
          onClick={onViewClick}
          icon={<ArrowRightOutlined />} // Giữ biểu tượng mũi tên
        />
      </div>
    </div>
  );
};

export default Card;
