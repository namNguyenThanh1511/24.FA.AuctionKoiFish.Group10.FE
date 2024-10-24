import React, { useState } from "react";
import { Button, Input } from "antd";
import "./index.css";

const BidForm = ({ currentPrice, bidIncrement, handleBid }) => {
  const [bidValue, setBidValue] = useState(currentPrice);

  const increaseBid = () => {
    setBidValue((prevValue) => prevValue + bidIncrement); // Tăng giá trị theo bidIncrement
  };

  const decreaseBid = () => {
    setBidValue((prevValue) => 
      prevValue - bidIncrement >= currentPrice ? prevValue - bidIncrement : currentPrice
    ); // Giảm giá trị nhưng không được dưới currentPrice
  };

  const placeBid = () => {
    handleBid(bidValue); // Gọi hàm handleBid với giá trị bidValue
  };

  return (
    <div className="bid-form-container">
      <div className="bid-section">
        <Input
          type="text"
          className="bid-input"
          value={bidValue.toLocaleString("en-US")} // Định dạng giá trị cho đẹp
          readOnly // Làm cho ô input không thể chỉnh sửa
        />
        <Button type="primary" onClick={increaseBid}>+</Button>
        <Button type="primary" onClick={decreaseBid}>-</Button>
        <Button type="primary" onClick={placeBid}>Bid</Button>
      </div>
    </div>
  );
};

export default BidForm;
