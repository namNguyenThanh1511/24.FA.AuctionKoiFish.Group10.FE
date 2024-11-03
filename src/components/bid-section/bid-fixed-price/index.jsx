import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import "./index.css";
import api from "../../../config/axios";

const FixedPriceBid = ({ currentPrice, handleBid }) => {
  const [bidValue, setBidValue] = useState(currentPrice); // Giá mặc định là currentPrice
  const [balance, setBalance] = useState(0); // Khởi tạo trạng thái balance

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get(`user/balance`); // Gọi API để lấy balance
        setBalance(response.data.balance); // Cập nhật balance từ phản hồi API
      } catch (error) {
        console.error("Lỗi khi lấy số dư:", error);
      }
    };

    fetchBalance();
  }, []); // Chỉ gọi API một lần khi component được tải lên

  const placeBid = () => {
    handleBid(bidValue);
  };

  return (
    <div className="fixed-price-bid-container">
      {/* Hiển thị thông tin balance bên trái */}
      <div className="balance-section">
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
      </div>

      {/* Ô nhập giá ở giữa, chỉ hiển thị giá trị mặc định và không thể chỉnh sửa */}
      <Input
        type="text"
        className="bid-input"
        value={bidValue.toLocaleString("en-US")}
        readOnly
        style={{ width: "100px", textAlign: "center", marginLeft: "10px" }}
      />

      {/* Nút Bid */}
      <Button
        className="button-bid"
        type="primary"
        onClick={placeBid}
        disabled={bidValue > balance} // Nút sẽ bị vô hiệu nếu giá trị bid lớn hơn balance
        style={{ marginLeft: "10px" }}
      >
        Bid
      </Button>
    </div>
  );
};

export default FixedPriceBid;
