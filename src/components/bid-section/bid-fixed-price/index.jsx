import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { useSelector } from "react-redux";
import "./index.css";
import api from "../../../config/axios";

const FixedPriceBid = ({ currentPrice, handleBid }) => {
  const [bidValue, setBidValue] = useState(currentPrice);
  const [balance, setBalance] = useState(0);

  // Lấy role từ Redux store
  const roleEnum = useSelector((state) => state.user.roleEnum);

  // Lấy balance khi component được mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceResponse = await api.get("user/balance");
        setBalance(balanceResponse.data.balance);
      } catch (error) {
        console.error("Lỗi khi lấy số dư:", error);
      }
    };

    fetchBalance();
  }, []);

  const placeBid = () => {
    // Kiểm tra nếu người dùng không phải là "MEMBER"
    if (roleEnum !== "MEMBER") {
      message.error("Bạn không có quyền đặt giá thầu!");
      return;
    }

    handleBid(bidValue);
  };

  return (
    <div className="fixed-price-bid-container">
      {/* Hiển thị số dư */}
      <div className="balance-section">
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
      </div>

      {/* Ô nhập giá, chỉ hiển thị giá trị mặc định và không thể chỉnh sửa */}
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
        disabled={bidValue > balance || roleEnum !== "MEMBER"}
        style={{ marginLeft: "10px" }}
      >
        Bid
      </Button>
    </div>
  );
};

export default FixedPriceBid;
