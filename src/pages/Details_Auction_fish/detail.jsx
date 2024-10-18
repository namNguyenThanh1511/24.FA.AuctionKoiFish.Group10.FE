import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Nhập useParams
import "./detail.css";
import api from "../../config/axios"; // Đảm bảo bạn đã nhập axios
import { Table } from "antd"; // Nếu bạn đang sử dụng Ant Design

const Detail = () => {
  const { auctionSessionId } = useParams(); // Lấy auctionSessionId từ URL
  const [productDetail, setProductDetail] = useState(null); // State cho thông tin sản phẩm
  const [countdown, setCountdown] = useState(""); // State cho countdown

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`auctionSession/${auctionSessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Product detail from API: ", response.data); // In ra thông tin từ API

        setProductDetail(response.data); // Lưu thông tin phiên đấu giá

        // Tính toán countdown khi nhận được thông tin chi tiết
        const startDate = new Date(response.data.startDate);
        const endDate = new Date(response.data.endDate);
        const countdown = getCountdown(startDate, endDate);
        setCountdown(countdown);
      } catch (error) {
        console.error("Error fetching product detail: ", error);
      }
    };

    fetchProductDetail();
  }, [auctionSessionId]);

  const getCountdown = (startDate, endDate) => {
    const totalSeconds = Math.floor((endDate - new Date()) / 1000); // Sử dụng thời gian hiện tại
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return totalSeconds > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : "Auction ended"; // Chuỗi countdown
  };

  

  // Thiết lập interval cho countdown
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (productDetail) {
        const startDate = new Date(productDetail.startDate);
        const endDate = new Date(productDetail.endDate);
        const countdown = getCountdown(startDate, endDate);
        setCountdown(countdown);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Dọn dẹp interval khi component bị hủy
  }, [productDetail]);

  // Kiểm tra nếu thông tin sản phẩm chưa được tải
  if (!productDetail) return <div>Loading...</div>;

  const { koi, auctionStatus, auctionType } = productDetail; // Lấy thông tin cá Koi

  return (


    <div className="container">
  
      <div className="product-detail">
        <div className="product-image">
          <img src={koi.image_url} alt={koi.name} /> {/* Hiển thị hình ảnh */}
        </div>
        <div className="product-info-container">
          <h1>{productDetail.title}</h1>
          <h2>{koi.name}</h2>
          <p>Breeder: {koi.breeder.username}</p>
          <p>Length: {koi.sizeCm} cm</p>
          <p>Sex: {koi.sex}</p>
          <p>
            Age: {new Date().getFullYear() - new Date(koi.bornIn).getFullYear()}{" "}
            years
          </p>
          <p>Price: {productDetail.currentPrice.toLocaleString("en-US")}₫</p>
          <p>Likes: {/* Cần có thông tin về likes ở đây nếu có */}</p>
          <p>Variety: {/* Thay thế bằng tên variety cụ thể nếu có */}</p>
          <p>Auction Status: {auctionStatus}</p>
          <p>Auction Type: {auctionType}</p>
          <p>Time Remaining: {countdown}</p> {/* Hiển thị countdown */}
        </div>
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
