import React, { useState, useEffect } from "react";
import HeaderLogin from "../../components/header-logged-in";
import "./Auction.css"; // Đảm bảo bạn đã nhập file CSS
import { Button } from "antd";
import Card from "../../components/Card/Card";
import Koi from "../../images/Koi1.jpg";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

const Auction = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsData, setCardsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // Thêm trạng thái tổng số trang
  const cardsPerPage = 8;
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Hàm tính toán tuổi theo định dạng "x years y months"
  const calculateAge = (dateOfBirth) => {
    const now = new Date();
    const birthDate = new Date(dateOfBirth);

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    // Nếu tháng hiện tại nhỏ hơn tháng sinh nhật, trừ một năm và điều chỉnh tháng
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} years ${months} months`;
  };

  // Lấy dữ liệu từ API
  const fetchKoiFish = async (page) => {
    try {
      const response = await api.get(
        `/auctionSession/auction-sessions-pagination`,
        {
          params: {
            page: page,
            size: cardsPerPage,
          },
        }
      );

      console.log("Response from API:", response.data); // Log phản hồi từ API

      const data = response.data.auctionSessionResponses;
      const totalPages = response.data.totalPages;

      // Kiểm tra dữ liệu
      console.log("Data fetched from API:", data);
      console.log("Total Pages:", totalPages);

      // Nếu dữ liệu rỗng, thông báo
      if (data.length === 0) {
        console.warn(`No data found for page ${page}`);
      }

      const transformedData = data.map((item) => {
        const age = calculateAge(item.koi.bornIn);
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const countdown = getCountdown(startDate, endDate, item.auctionStatus);

        return {
          auctionSessionId: item.auctionSessionId,
          name: item.koi.name || "Unknown",
          title: item.title || "Unknown",
          breeder: item.koi.breeder.username || "Unknown",
          length: item.koi.sizeCm || "Unknown",
          sex: item.koi.sex || "Unknown",
          bornIn: item.koi.bornIn || "Unknown",
          age: age || "0 years 0 months",
          price: item.currentPrice || 0,
          variety:
            item.koi.varieties.map((v) => v.name).join(", ") || "Unknown",
          image: item.koi.image_url || "",
          startDate: startDate,
          endDate: endDate,
          countdown: countdown,
          auctionStatus: item.auctionStatus || "Unknown",
          auctionType: item.auctionType || "Unknown",
        };
      });

      setCardsData(transformedData);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("There was an error fetching data. Please try again.");
    }
  };

  useEffect(() => {
    fetchKoiFish(currentPage); // Gọi hàm với trang hiện tại
  }, [currentPage]); // Thay đổi trang hiện tại sẽ gọi lại useEffect

  const getCountdown = (startDate, endDate, auctionStatus) => {
    if (auctionStatus === "COMPLETED") {
      return "Auction ended";
    }

    const offset = 7 * 3600 * 1000; // Điều chỉnh múi giờ
    let totalSeconds;

    if (auctionStatus === "UPCOMING") {
      totalSeconds = Math.floor((startDate - Date.now() - offset) / 1000); // Đếm ngược đến startDate
    } else {
      totalSeconds = Math.floor((endDate - Date.now() - offset) / 1000); // Đếm ngược đến endDate
    }

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return totalSeconds > 0
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : "Auction ended";
  };

  // Thiết lập interval cho đếm ngược
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCardsData((prevData) =>
        prevData.map((card) => {
          const countdown = getCountdown(
            card.startDate,
            card.endDate,
            card.auctionStatus
          );
          return {
            ...card,
            countdown: countdown,
          };
        })
      );
    }, 1000);

    return () => clearInterval(intervalId); // Dọn dẹp interval khi component bị hủy
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber); // Cập nhật trang hiện tại
    }
  };

  return (
    <div className="auction-form-container">
      <div className="card-grid">
        {cardsData.map((card) => (
          <Card
            key={card.auctionSessionId}
            image={card.image || Koi}
            title={card.title}
            name={card.name}
            breeder={card.breeder}
            length={card.length}
            sex={card.sex}
            age={card.age}
            countdown={card.countdown}
            price={card.price.toLocaleString("en-US")}
            variety={card.variety}
            auctionStatus={card.auctionStatus}
            auctionType={card.auctionType}
            auctionSessionId={card.auctionSessionId}
            onViewClick={() => {
              navigate(`${card.auctionSessionId}`, { replace: true });
            }}
          />
        ))}
      </div>
      <div className="pagination">
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0} // Chỉ vô hiệu hóa khi đang ở trang đầu tiên
        >
          {"<"}
        </Button>

        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            className={`pagination-button ${
              currentPage === index ? "active" : ""
            }`}
            onClick={() => handlePageChange(index)}
          >
            {index + 1} {/* Hiển thị số trang bắt đầu từ 1 */}
          </Button>
        ))}

        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1} // Chỉ vô hiệu hóa khi ở trang cuối
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default Auction;
