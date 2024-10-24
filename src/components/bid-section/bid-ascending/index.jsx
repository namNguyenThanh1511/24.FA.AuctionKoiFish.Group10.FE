import React, { useState } from "react";
import { Button, Input } from "antd";
import "./index.css";

const BidForm = ({ currentPrice, bidIncrement, buyNowPrice, handleBid, handleBuyNow }) => {
  const [bidValue, setBidValue] = useState(currentPrice);

  const increaseBid = () => {
    setBidValue((prevValue) => prevValue + bidIncrement);
  };

  const decreaseBid = () => {
    setBidValue((prevValue) => 
      prevValue - bidIncrement >= currentPrice ? prevValue - bidIncrement : currentPrice
    );
  };

  const placeBid = () => {
    handleBid(bidValue);
  };

  return (
    <div className="bid-form-container">
      <div className="bid-section">
        <Input
          type="text"
          className="bid-input"
          value={bidValue.toLocaleString("en-US")}
          readOnly
        />
        <Button type="primary" onClick={increaseBid}>+</Button>
        <Button type="primary" onClick={decreaseBid}>-</Button>
        <Button type="primary" onClick={placeBid}>Bid</Button>
      </div>
      <div className="buy-now-section">
        <span>Buy Now Price: {buyNowPrice.toLocaleString("en-US")}₫</span>
        <Button type="primary" onClick={handleBuyNow}>Buy Now</Button>
      </div>
    </div>
  );
};

export default BidForm;
