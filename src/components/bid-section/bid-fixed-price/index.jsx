import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { useSelector } from "react-redux";
import "./index.css";
import api from "../../../config/axios";

const FixedPriceBid = ({ currentPrice, handleBid }) => {
  const [bidValue, setBidValue] = useState(currentPrice);
  const [balance, setBalance] = useState(0);

  const roleEnum = useSelector((state) => state.user.roleEnum);

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
    if (roleEnum !== "MEMBER") {
      message.error("Bạn không có quyền đặt giá thầu!");
      return;
    }

    handleBid(bidValue);
  };

  return (
    <div className="fixed-price-bid-container">
      <div className="balance-section">
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
      </div>

      <Input
        type="text"
        className="bid-input"
        value={bidValue.toLocaleString("en-US")}
        readOnly
        style={{ width: "100px", textAlign: "center", marginLeft: "10px" }}
      />

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
