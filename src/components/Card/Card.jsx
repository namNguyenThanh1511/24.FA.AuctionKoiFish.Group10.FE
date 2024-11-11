import React from "react";
import "./Card.css";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const statusMapping = {
  ONGOING: "On Going",
  COMPLETED: "Completed",
  DRAWN: "Drawn",
  COMPLETED_WITH_BUYNOW: "Completed with Buy Now",
  NO_WINNER: "No Winner",
  UPCOMING: "Up Coming",
};

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
  auctionSessionId,
}) => {
  return (
    <div className="card-container">
      <div className="card-header">
        <img src={image} alt="koi fish" className="card-image" />
        <div className="card-info">
          <h3 className="card-title">{title} </h3>
          <h5>{"#"} {auctionSessionId}</h5>
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
              {weight} kg
            </p>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <h4>Time left</h4>
        <div className="card-countdown">
          {auctionStatus === "COMPLETED_WITH_BUYNOW" ||
          auctionStatus === "Ended"
            ? "Auction Ended"
            : countdown}
        </div>
        <div className="card-price">{price.toLocaleString("vi-VN")}₫</div>

        {/* Hiển thị trạng thái từ object mapping */}
        <div className="card-status-type">
          <p className={`card-status ${auctionStatus.toLowerCase()}`}>
            <strong>Status: </strong>
            <span>{statusMapping[auctionStatus] || auctionStatus}</span>
          </p>
          <p className={`card-type ${auctionType.toLowerCase()}`}>
            <strong>Type: </strong>
            {auctionType}
          </p>
        </div>
        <Button
          className="view-button"
          onClick={onViewClick}
          icon={<ArrowRightOutlined />}
        />
      </div>
    </div>
  );
};

export default Card;
