import React, { useState, useEffect } from "react";
import { Input } from "antd"; // Giữ lại Input từ Ant Design
import "./index.css";
import api from "../../../config/axios"; // Đảm bảo đường dẫn đúng đến file API

const BidForm = ({ currentPrice, bidIncrement, buyNowPrice, handleBid, handleBuyNow }) => {
  const [bidValue, setBidValue] = useState(currentPrice);
  const [balance, setBalance] = useState(0); // Khởi tạo trạng thái balance để lưu từ API

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("user/balance"); // Gọi API để lấy balance
        setBalance(response.data.balance); // Cập nhật balance từ phản hồi API
      } catch (error) {
        console.error("Lỗi khi lấy số dư:", error);
      }
    };

    fetchBalance();
  }, []); // Chỉ gọi API một lần khi component được tải lên

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
        <button className="bid-adjust-button" onClick={decreaseBid}>-</button>
        <input
          type="text"
          className="bid-input"
          value={bidValue.toLocaleString("en-US")}
          readOnly
        />
        <button className="bid-adjust-button" onClick={increaseBid}>+</button>
        <button className="button-bid" onClick={placeBid}>Bid</button>
        <span className="balance-section">
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
      </div>
  
      <div className="buy-now-section">
        <div className="buy-now-price-box">
          <span className="buy-now-price">{buyNowPrice.toLocaleString("en-US")}₫</span>
        </div>
        <button className="button-buy-now" type="button" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default BidForm;
