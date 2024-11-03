import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./detail.css";
import api from "../../config/axios";
import { Table, message, Modal } from "antd";
import BidForm from "../../components/bid-section/bid-ascending";
import FixedPriceBid from "../../components/bid-section/bid-fixed-price"; // Import FixedPriceBid

const Detail = () => {
  const { auctionSessionId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [intervalId, setIntervalId] = useState(null);

  const fetchProductDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`auctionSession/${auctionSessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Product detail from API: ", response.data);
      setProductDetail(response.data);
      setCurrentBid(response.data.currentPrice);

      const historyData = response.data.bids.map((bid) => ({
        date: new Date(bid.bidAt).toLocaleString(),
        bid: bid.bidAmount,
        name: bid.member.fullName,
      }));
      setBidHistory(historyData);

      const startDate = new Date(response.data.startDate);
      const endDate = new Date(response.data.endDate);

      if (response.data.auctionStatus === "COMPLETED") {
        setCountdown("Auction ended");
        if (response.data.winner) {
          setWinnerName(response.data.winner.fullName);
          setIsWinnerModalVisible(true);
        }
      } else if (response.data.auctionStatus === "UPCOMING") {
        const initialCountdown = getCountdown(new Date(), startDate);
        setCountdown(initialCountdown);

        const id = setInterval(() => {
          const updatedCountdown = getCountdown(new Date(), startDate);
          setCountdown(updatedCountdown);
          if (updatedCountdown === "Auction starting soon") {
            clearInterval(id);
            startOngoingCountdown(startDate, endDate);
          }
        }, 1000);
        setIntervalId(id);
      } else {
        startOngoingCountdown(startDate, endDate);
      }
    } catch (error) {
      console.error("Error fetching product detail: ", error);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [auctionSessionId]);

  const getCountdown = (fromDate, toDate) => {
    const offset = 7 * 3600 * 1000; // 7 tiếng tính bằng mili giây
    const totalSeconds = Math.floor((toDate.getTime() - fromDate.getTime() - offset) / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return totalSeconds > 0
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : "Auction starting soon";
  };

  const startOngoingCountdown = (startDate, endDate) => {
    const countdown = getCountdown(startDate, endDate);
    setCountdown(countdown);

    const id = setInterval(() => {
      const updatedCountdown = getCountdown(new Date(), endDate);
      setCountdown(updatedCountdown);
      if (updatedCountdown === "Auction ended") {
        clearInterval(id);
      }
    }, 1000);
    setIntervalId(id);
  };

  const handleBid = async (bidValue) => {
    try {
      const token = localStorage.getItem("token");
      const bidDifference = bidValue - currentBid;
  
      // Các điều kiện để tránh bid không hợp lệ
      if (bidValue > productDetail.buyNowPrice) {
        message.error("Bid amount cannot exceed Buy Now price!");
        return;
      }
  
      if (bidValue === productDetail.buyNowPrice) {
        await handleBuyNow();
        return;
      }
  
      // Gửi yêu cầu bid thông qua API
      const response = await api.post(
        `bid`,
        {
          auctionSessionId,
          bidAmount: bidValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        message.success("Bid placed successfully!");
        fetchProductDetail();
      } else {
        message.error("Failed to place bid.");
      }
    } catch (error) {
      console.error("Error placing bid: ", error);
      message.error("Failed to place bid.");
    }
  };
  
  

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `bid/buyNow`,
        {
          auctionSessionId,
          amount: productDetail.buyNowPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Mua ngay thành công!");
        setWinnerName(response.data.winner.fullName);
        setIsWinnerModalVisible(true);
        fetchProductDetail();
      } else {
        message.error("Mua ngay không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi mua item: ", error);
    }
  };

  if (!productDetail) return <div>Loading...</div>;

  const { koi, auctionStatus, auctionType } = productDetail;

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "red";
      case "UPCOMING":
        return "#ffc107";
      case "ONGOING":
        return "green";
      default:
        return "black";
    }
  };

  return (
    <div>
      <div className="container">
        <div className="product-image">
          <img src={koi.image_url} alt={koi.name} />
        </div>
        <div className="product-detail">
          <h1>{productDetail.title}</h1>
          <div className="time">
            <span style={{ color: "black" }}>Time Remaining:</span>
            <span style={{ color: "red" }}> {countdown}</span>
          </div>
          <div className="product-info-container">
            <div className="info-box">
              <p><strong>Name:</strong> {koi.name}</p>
            </div>
            <div className="info-box">
              <p><strong>Breeder:</strong> {koi.breeder.username}</p>
            </div>
            <div className="info-box">
              <p><strong>Auction Status:</strong> <span style={{ color: getStatusColor(auctionStatus) }}>{auctionStatus}</span></p>
            </div>
            <div className="info-box">
              <p><strong>Auction Type:</strong> {auctionType}</p>
            </div>
            <div className="info-box">
              <p><strong>Length:</strong> {koi.sizeCm} cm</p>
            </div>
            <div className="info-box">
              <p><strong>Sex:</strong> {koi.sex}</p>
            </div>
            <div className="info-box">
              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(koi.bornIn).getFullYear()} years</p>
            </div>
            <div className="info-box">
              <p><strong>Variety:</strong> {koi.varieties && koi.varieties.length > 0 ? koi.varieties.map((variety) => variety.name).join(", ") : "No variety available"}</p>
            </div>
            <div className="info-box">
              <p><strong>Price:</strong> {productDetail.currentPrice.toLocaleString("en-US")}₫</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bid-container">
        {auctionType === "FIXED_PRICE" ? (
          <FixedPriceBid currentPrice={currentBid} handleBid={handleBid} />
        ) : (
          <BidForm
            currentPrice={currentBid}
            bidIncrement={productDetail.bidIncrement}
            buyNowPrice={productDetail.buyNowPrice}
            handleBid={handleBid}
            handleBuyNow={handleBuyNow}
          />
        )}
      </div>

      <div className="additional-info-container">
        <h2>Lịch sử đấu giá</h2>
        <Table
  dataSource={bidHistory}
  columns={[
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Bid", dataIndex: "bid", key: "bid" },
    { title: "Name", dataIndex: "name", key: "name" },
  ]}
  rowKey={(record) => record.date}
  pagination={{ pageSize: 5 }} // Thêm thuộc tính pagination với pageSize là 5
/>
      </div>

      <Modal
        title="Winner"
        visible={isWinnerModalVisible}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={null}
      >
        <p>Congratulations to {winnerName} for winning the auction!</p>
      </Modal>
    </div>
  );
};

export default Detail;
