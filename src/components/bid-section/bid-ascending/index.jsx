import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { useSelector } from "react-redux";
import "./index.css";
import api from "../../../config/axios";

const BidForm = ({
  currentPrice,
  bidIncrement,
  buyNowPrice,
  handleBid,
  handleBuyNow,
  auctionSessionId,
}) => {
  const [bidValue, setBidValue] = useState(currentPrice);
  const [balance, setBalance] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const roleEnum = useSelector((state) => state.user.roleEnum);
  const [incrementAmount1, setIncrementAmount1] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("user/balance");
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Lỗi khi lấy số dư:", error);
      }
    };

    fetchBalance();
  }, []);

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
    const incrementAmount = bidValue - currentPrice;
    handleBid(incrementAmount);
  };

  useEffect(() => {
    const calculateLost = async () => {
      const lostResponse = await api.post(`bid/estimate-total-lost`, {
        auctionSessionId: auctionSessionId,
        bidAmount: bidValue - currentPrice, 
      });
      setTotalLost(lostResponse.data);
    };
    calculateLost();
  }, [bidValue]);

  return (
    <div className="bid-form-container">
      <div className="bid-section">
        <button
          className="bid-adjust-button"
          onClick={decreaseBid}
          disabled={roleEnum !== "MEMBER"}
        >
          -
        </button>
        <input
          type="text"
          className="bid-input"
          value={bidValue.toLocaleString("en-US")}
          readOnly
        />
        <button
          className="bid-adjust-button"
          onClick={increaseBid}
          disabled={roleEnum !== "MEMBER"}
        >
          +
        </button>
        <button
          className="button-bid"
          onClick={placeBid}
          disabled={roleEnum !== "MEMBER"}
        >
          Bid
        </button>
        <span className="balance-section">
          Balance: {balance.toLocaleString("en-US")}₫
        </span>
        <span className="total-lost-section">
          Total Lost: {totalLost.toLocaleString("en-US")}₫
        </span>
      </div>

      <div className="buy-now-section">
        <div className="buy-now-price-box">
          <span className="buy-now-price">
            {buyNowPrice.toLocaleString("en-US")}₫
          </span>
        </div>
        <button
          className="button-buy-now"
          type="button"
          onClick={handleBuyNow}
          disabled={roleEnum !== "MEMBER"}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default BidForm;
