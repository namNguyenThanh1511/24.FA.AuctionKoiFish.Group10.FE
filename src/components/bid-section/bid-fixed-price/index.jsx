import React, { useState } from "react";
import { Button, Input } from "antd";
import { useSelector } from "react-redux";
import "./index.css";

const FixedPriceBid = ({ handleBid }) => {
  const currentUser = useSelector((state) => state.user);
  const balance = currentUser?.balance || 0; // Lấy số dư balance từ Redux
  const [bidValue, setBidValue] = useState("");

  const placeBid = () => {
    handleBid(bidValue);
  };

  return (
    <div className="fixed-price-bid-container">
      {/* Hiển thị số dư bên trên ô nhập giá */}
      <div className="balance-section">
        <span className="balance-text">
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
      </div>

      {/* Ô nhập giá ở giữa */}
      <Input
        type="number"
        className="fixed-bid-input"
        placeholder="Enter your bid"
        value={bidValue}
        onChange={(e) => setBidValue(e.target.value)}
      />

      {/* Nút Bid */}
      <Button
        className="button-bid"
        type="primary"
        onClick={placeBid}
        disabled={!bidValue || parseInt(bidValue) > balance}
      >
        Bid
      </Button>
    </div>
  );
};

export default FixedPriceBid;
