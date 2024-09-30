import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Nenkoi from "../../images/NenKoi.png";

const HomePage = () => {
  return (
    <div className="homepage">
      <Header /> {/* Thêm Header ở đây */}
      <section className="banner">
        <img src={Nenkoi} alt="Auction Koi Banner" /> {/* Sử dụng hình ảnh đã import */}
      </section>
      <Footer /> {/* Thêm Footer ở đây */}
    </div>
  );
};

export default HomePage;
