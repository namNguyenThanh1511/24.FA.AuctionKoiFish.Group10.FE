import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./detail.css";
import api from "../../config/axios";
import { Table, message } from "antd";
import BidForm from "../../components/bid-section/bid-ascending";

const Detail = () => {
  const { auctionSessionId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentBid, setCurrentBid] = useState(0); // Khởi tạo với 0

  // Hàm để lấy thông tin sản phẩm
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
      setCurrentBid(response.data.currentPrice); // Thiết lập giá trị bid ban đầu

      if (response.data.auctionStatus === "COMPLETED") {
        setCountdown("Auction ended");
      } else {
        const startDate = new Date(response.data.startDate);
        const endDate = new Date(response.data.endDate);
        const countdown = getCountdown(startDate, endDate);
        setCountdown(countdown);
      }
    } catch (error) {
      console.error("Error fetching product detail: ", error);
    }
  };

  // Gọi hàm fetchProductDetail khi component mount
  useEffect(() => {
    fetchProductDetail();
  }, [auctionSessionId]);

  const getCountdown = (startDate, endDate) => {
    const totalSeconds = Math.floor((endDate - new Date()) / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return totalSeconds > 0
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : "Auction ended";
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (productDetail) {
        if (productDetail.auctionStatus === "COMPLETED") {
          setCountdown("Auction ended");
        } else {
          const startDate = new Date(productDetail.startDate);
          const endDate = new Date(productDetail.endDate);
          const countdown = getCountdown(startDate, endDate);
          setCountdown(countdown);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [productDetail]);

  const handleBid = async (bidValue) => {
    try {
      const token = localStorage.getItem("token");

      // Tính toán số chênh lệch giữa bidValue và currentPrice từ productDetail
      const bidDifference = bidValue - productDetail.currentPrice;

      // Kiểm tra nếu chênh lệch là hợp lệ (chênh lệch lớn hơn 0)
      if (bidDifference > 0) {
        const response = await api.post(
          `bid`,
          {
            auctionSessionId, // ID phiên đấu giá
            bidAmount: bidDifference, // Giá trị chênh lệch giữa bidValue và currentPrice
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        message.success("Bid placed successfully!");
        console.log("Bid response: ", response.data);

        // Tải lại thông tin sản phẩm sau khi đặt bid thành công
        fetchProductDetail();
      } else {
        message.error("Bid amount must be higher than the current price!");
      }
    } catch (error) {
      console.error("Error placing bid: ", error);
      message.error("Failed to place bid.");
    }
  };

  if (!productDetail) return <div>Loading...</div>;

  const { koi, auctionStatus, auctionType } = productDetail;

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "red";
      case "UPCOMING":
        return "yellow";
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
                <span style={{ color: getStatusColor(auctionStatus) }}>
                  {auctionStatus}
                </span>
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Auction Type:</strong> {auctionType}
              </p>
            </div>
            <div className="info-box">
              <p>
                <strong>Length:</strong> {koi.sizeCm} cm
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
                {new Date().getFullYear() - new Date(koi.bornIn).getFullYear()}{" "}
                years
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
                <strong>Price:</strong>{" "}
                {productDetail.currentPrice.toLocaleString("en-US")}₫
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phần bid và lịch sử đấu giá nằm dưới */}
      <div className="bid-container">
        <BidForm
          currentPrice={currentBid}
          bidIncrement={productDetail.bidIncrement}
          handleBid={handleBid} // Truyền hàm handleBid
        />
      </div>

      <div className="additional-info-container">
        <h2>Lịch sử đấu giá</h2>
        <Table
          dataSource={[]} // Dữ liệu mẫu hoặc dữ liệu thực tế nếu có
          columns={[
            { title: "Date", dataIndex: "date", key: "date" },
            { title: "Bid", dataIndex: "bid", key: "bid" },
            { title: "Name", dataIndex: "name", key: "name" },
          ]}
          rowKey="date"
        />
      </div>
    </div>
  );
};

export default Detail;
