import Header from "../components/header"; // Đảm bảo đường dẫn chính xác đến Header
import Footer from "../components/footer"; // Import Footer
import Koi from "../images/Koi.jpg"; // Import hình ảnh
import "./detail.css";
const Detail = () => {
  return (
    <div className="container">
      <Header />
      <div className="product-detail">
        <div className="product-image">
          <img src={Koi} alt="Sản phẩm" />
        </div>
        <div className="product-info">
          <h1>Koi Koi Koi #Aa33639</h1>
          <p>
            cá Koi dòng luxury với body chuẩn quốc tế, chiều cao lí tưởng cùng
            với đường nét cơ thể vô cùng tinh xảo lần đầu được bán tại Việt Nam
          </p>
          <div className="info">
            <h3>Breeder: Omachi</h3>
            <h3>Variety: Minami</h3>
            <h3>Sex: Unknow</h3>
            <h3>Size: 18cm/1m8</h3>
          </div>

          <div className="product-price">
            <span className="original-price">420.000.000₫</span>
            <span className="sale-price">42.000.000₫</span>
            <span className="discount">-90%</span>
          </div>
          <button className="buy-now-btn">Lụm ngay về nhà</button>
          <p className="flash-sale">Kết thúc trong: 00:36:33</p>
        </div>
      </div>
      <Footer /> {/* Để Footer nằm ngay ở đây */}
    </div>
  );
};

export default Detail;
