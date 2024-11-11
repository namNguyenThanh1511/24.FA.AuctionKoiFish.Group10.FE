import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./detail.css";
import api from "../../config/axios";
import { Table, message, Modal } from "antd";
import BidForm from "../../components/bid-section/bid-ascending";
import FixedPriceBid from "../../components/bid-section/bid-fixed-price";
import formatToVND from "../../utils/currency";
import useRealtime from "../../hooks/useRealTime";

const Detail = () => {
  const { auctionSessionId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);

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
        bid: formatToVND(bid.bidAmount),
        name: bid.member.fullName,
      }));
      setBidHistory(historyData);

      const startDate = new Date(response.data.startDate);
      const endDate = new Date(response.data.endDate);

      if (
        response.data.auctionStatus === "COMPLETED" ||
        response.data.auctionStatus === "DRAWN" ||
        response.data.auctionStatus === "NO_WINNER"||
        response.data.auctionStatus === "COMPLETED_WITH_BUYNOW"
      ) {
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
        }, 1000);
        setIntervalId(id);
      } else if (response.data.auctionStatus === "ONGOING") {
        startOngoingCountdown(startDate, endDate);
      }
    } catch (error) {
      console.error("Error fetching product detail: ", error);
    }
  };

  useRealtime((message) => {
    // Only process messages related to the current auction session
    if (message.body === "CREATED NEW BID".trim()) {
      fetchProductDetail();
    }
  }, auctionSessionId);
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

    if (totalSeconds > 0) {
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

  
    return "Auction starting soon";
  };

  const startOngoingCountdown = (startDate, endDate) => {
    const countdown = getCountdown(new Date(), endDate);
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

      if (bidValue > productDetail.buyNowPrice) {
        message.error("Bid amount cannot exceed Buy Now price!");
        return;
      }

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
      console.error("Error placing bid: " + error.response.data);
      message.error("Failed to place bid." + error.response.data);
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `bid/buyNow`,
        {
          auctionSessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Buy Now success");
        setWinnerName(response.data.winner.fullName);
        setIsWinnerModalVisible(true);
        fetchProductDetail();
      } else {
        message.error("Buy Now Erorr.");
      }
    } catch (error) {
      console.error("Erorr to buy: ", error);
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
  const showVideoModal = () => {
    setIsVideoModalVisible(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalVisible(false);
  };

  return (
    <div>
      <div className="container-detail">
        <div className="product-image">
          <img src={koi.image_url} alt={koi.name} />
          {productDetail?.koi?.video_url && (
            <button onClick={showVideoModal} className="video-button">
              Video
            </button>
          )}
        </div>

        <Modal
          title="Koi Auction Video"
          open={isVideoModalVisible}
          onCancel={handleVideoModalClose}
          footer={null}
          centered
          width={800} 
        >
          {productDetail?.koi?.video_url && (
            <div className="video-container">
              <iframe
                src={
                  productDetail.koi.video_url.includes("watch?v=")
                    ? productDetail.koi.video_url.replace("watch?v=", "embed/")
                    : productDetail.koi.video_url
                }
                title="Koi Auction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </Modal>

        <div className="product-detail">
          <h1>{productDetail.title + "#" + productDetail.auctionSessionId} </h1>
          <div className="time">
            <span style={{ color: "black" }}>Time Remaining:</span>
            <span style={{ color: "red" }}> {countdown}</span>
          </div>
          <div className="product-info-container">
            <div className="info-box">
              <p>
                <strong>Name:</strong> {koi.name}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Breeder:</strong> {koi.breeder.username}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Auction Status:</strong>{" "}
                <span style={{ color: getStatusColor(auctionStatus) }}>{auctionStatus}</span>
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Auction Type:</strong> {auctionType}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Size:</strong> {koi.sizeCm} cm
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Sex:</strong> {koi.sex}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Age:</strong>{" "}
                {new Date().getFullYear() - new Date(koi.bornIn).getFullYear()} years
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Variety:</strong>{" "}
                {koi.varieties && koi.varieties.length > 0
                  ? koi.varieties.map((variety) => variety.name).join(", ")
                  : "No variety available"}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Price:</strong> {productDetail.currentPrice.toLocaleString("en-US")}₫
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Weight:</strong> {koi.weightKg} {"kg"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bid-container">
        {auctionType === "FIXED_PRICE" ? (
          <FixedPriceBid currentPrice={currentBid} handleBid={handleBid} />
        ) : (
          <BidForm
            key={currentBid}
            currentPrice={currentBid}
            bidIncrement={productDetail.bidIncrement}
            buyNowPrice={productDetail.buyNowPrice}
            handleBid={handleBid}
            handleBuyNow={handleBuyNow}
            auctionSessionId={auctionSessionId}
          />
        )}
      </div>

      <div className="additional-info-container">
        <h2>Bid History</h2>
        <Table
          dataSource={bidHistory}
          columns={[
            { title: "Date", dataIndex: "date", key: "date" },
            { title: "Bid", dataIndex: "bid", key: "bid" },
            { title: "Name", dataIndex: "name", key: "name" },
          ]}
          rowKey={(record) => record.date}
          pagination={{ pageSize: 5 }}

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
