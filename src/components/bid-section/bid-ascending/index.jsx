import React, { useState } from "react";
import { Button, Input } from "antd";
import "./index.css";

const BidForm = ({
  currentPrice,
  bidIncrement,
  buyNowPrice,
  handleBid,
  handleBuyNow,
}) => {
  const [bidValue, setBidValue] = useState(currentPrice);

  const increaseBid = () => {
    setBidValue((prevValue) => prevValue + bidIncrement);
  };

  const decreaseBid = () => {
    setBidValue((prevValue) =>
      prevValue - bidIncrement >= currentPrice
        ? prevValue - bidIncrement
        : currentPrice
    );
  };

  const placeBid = () => {
    handleBid(bidValue);
  };

  return (
    <div className="bid-form-container"> {/* Thêm class bid-form */}
      <div className="bid-section">
        <div className="group-button">
          <Input.Group compact>
            <Button type="primary" onClick={decreaseBid}>
              -
            </Button>
            <Input
              type="text"
              className="bid-input"
              value={bidValue.toLocaleString("vi-VN")}
              readOnly
              style={{ width: "100px", textAlign: "center" }}
            />
            <Button type="primary" onClick={increaseBid}>
              +
            </Button>
          </Input.Group>
        </div>
        <Button
          className="button-bid"
          type="primary"
          onClick={placeBid}
          style={{ marginLeft: "10px" }}
        >
          Bid
        </Button>
      </div>
      <div className="buy-now-section">
        <div className="buy-now-price-box">
          <span className="buy-now-price">
            {buyNowPrice.toLocaleString("en-US")}₫
          </span>
        </div>
        <Button
          className="button-buy-now"
          type="primary"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
  
};

export default BidForm;
