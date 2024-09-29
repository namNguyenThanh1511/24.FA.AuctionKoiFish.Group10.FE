import React from "react";
import Header from "../components/Header"; // Đảm bảo đường dẫn chính xác đến Header
import Footer from "../components/footer"; // Import Footer
import "./homepage.css"; // Import file CSS cho Homepage
import Nenkoi from "../images/Nenkoi.png"; // Import hình ảnh


const HomePage = () => {
  return (
    <div className="homepage">
      <Header /> {/* Thêm Header ở đây */}
      <section className="banner">
        <img src={Nenkoi} alt="Auction Koi Banner" />{" "}
        {/* Sử dụng hình ảnh đã import */}
      </section>
      <Footer /> {/* Thêm Footer ở đây */}
    </div>
  );
};

export default HomePage;
