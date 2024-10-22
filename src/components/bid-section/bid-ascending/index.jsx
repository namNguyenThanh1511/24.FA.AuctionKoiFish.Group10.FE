import React, { useState } from "react";
import { Button, Input } from "antd"; // Nhập các thành phần từ Ant Design
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
        <Button type="primary" onClick={increaseBid}>+</Button> {/* Sử dụng nút Ant Design */}
        <Button type="primary" onClick={decreaseBid}>-</Button> {/* Sử dụng nút Ant Design */}
        <Button type="primary" onClick={placeBid}>Bid</Button> {/* Nút để đặt bid */}
      </div>
    </div>
  );
};

export default BidForm;
