import React, { useState, useEffect } from "react";
import HeaderLogin from "../../components/header-logged-in";
import "./Auction.css"; // Đảm bảo bạn đã nhập file CSS
import { Button } from "antd";
import Card from "../../components/Card/Card";
import Koi from "../../images/Koi1.jpg";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
const Auction = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsData, setCardsData] = useState([]);
  const cardsPerPage = 12;
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
  useEffect(() => {
    const fetchKoiFish = async () => {
      try {
        const response = await api.get("/auctionSession");

        const data = response.data;

        // In thông tin từ API ra console
        console.log("Data fetched from API:", data);

        const transformedData = data.map((item) => {
          const age = calculateAge(item.koi.bornIn); // Tính toán tuổi

          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);
          const countdown = getCountdown(startDate, endDate); // Tính toán countdown

          return {
            auctionSessionId: item.auctionSessionId,
            name: item.koi.name || "Unknown", // Lấy name từ API
            title: item.title || "Unknown", // Lấy title từ API
            breeder: item.koi.breeder.username || "Unknown",
            length: item.koi.sizeCm || "Unknown",
            sex: item.koi.sex || "Unknown",
            bornIn: item.koi.bornIn || "Unknown",
            age: age || "0 years 0 months", // Đặt giá trị mặc định cho tuổi
            price: item.currentPrice || 0,
            likes: 0,
            variety:
              item.koi.varieties.map((v) => v.name).join(", ") || "Unknown",
            image: item.koi.image_url || "",
            startDate: startDate, // Thêm startDate vào đối tượng
            endDate: endDate, // Thêm endDate vào đối tượng
            countdown: countdown, // Thêm countdown vào đối tượng
            auctionStatus: item.auctionStatus || "Unknown", // Thêm auctionStatus
            auctionType: item.auctionType || "Unknown", // Thêm auctionType
          };
        });

        setCardsData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchKoiFish();
  }, []);

  const getCountdown = (startDate, endDate) => {
    const totalSeconds = Math.floor((endDate - new Date()) / 1000); // Sử dụng thời gian hiện tại
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return totalSeconds > 0
      ? `${hours}h ${minutes}m ${seconds}s`
      : "Auction ended"; // Chuỗi countdown
  };

  // Thiết lập interval cho đếm ngược
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCardsData((prevData) =>
        prevData.map((card) => {
          const countdown = getCountdown(card.startDate, card.endDate); // Cập nhật countdown
          return {
            ...card,
            countdown: countdown,
          };
        })
      );
    }, 1000);

    return () => clearInterval(intervalId); // Dọn dẹp interval khi component bị hủy
  }, []);

  // Tính toán các thẻ sẽ hiển thị trên trang hiện tại
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(cardsData.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="auction-form-container">
      <div className="card-grid">
        {currentCards.map((card) => (
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
         likes={card.likes}
         variety={card.variety}
         auctionStatus={card.auctionStatus} // Đảm bảo đây là giá trị trạng thái
         auctionType={card.auctionType} // Đảm bảo đây là giá trị loại
         auctionSessionId={card.auctionSessionId}
         onViewClick={() => {
           navigate(`${card.auctionSessionId}`, { replace: true });
         }}
       />
       
        ))}
      </div>
      <div className="pagination">
        {" "}
        {/* Thêm class cho pagination */}
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"} {/* Nút Quay lại */}
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"} {/* Nút Tiến */}
        </Button>
      </div>
    </div>
  );
};

export default Auction;
