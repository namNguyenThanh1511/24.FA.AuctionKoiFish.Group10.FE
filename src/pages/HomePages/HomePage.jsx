import Nenkoi from "../../images/NenKoi.png";
import "./HomePage.css";
const HomePage = () => {
  return (
    <div className="homepage">
      <section className="banner">
        <img src={Nenkoi} alt="Auction Koi Banner" /> {/* Sử dụng hình ảnh đã import */}
      </section>
    </div>
  );
};

export default HomePage;
