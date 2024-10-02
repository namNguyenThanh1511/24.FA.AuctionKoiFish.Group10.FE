

 // Đường dẫn đúng tới file Card.jsx
import Header from "../../components/HeaderLogin";
import Footer from "../../components/footer/Footer";
import Koi from "../../images/Koi1.jpg";
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
          <div className ="Current-bid">
          <span>Current bid: 300.000.000</span>
          </div>
          <p>
            Cá Koi dòng luxury với body chuẩn quốc tế, chiều cao lý tưởng cùng
            với đường nét cơ thể vô cùng tinh xảo lần đầu được bán tại Việt Nam.
          </p>
          <div className="info">
            <h3>Breeder: Omachi</h3>
            <h3>Variety: Minami</h3>
            <h3>Sex: Unknow</h3>
            <h3>Size: 18cm/1m8</h3>
          </div>

          <div className="product-price">
            <span className="sale-price">Start price 42.000.000₫</span> <br/>
            <span className="original-price">Win price: 420.000.000₫</span> <br/>
          </div>

          <div className="bid-section">
            <input type="text" className="bid-input" placeholder="Nhập giá thầu" />
            <button className="bid-btn">Bid</button>
          </div>

          <p className="time"><span>00:36:33</span></p>
        </div>
      </div>
      

      <div className="additional-info-container">
        <h2>Thông tin thêm</h2>
        <p>Chất lượng cá: Đạt tiêu chuẩn quốc tế</p>
        <p>Bảo hành: 1 năm</p>
        <p>Phương thức vận chuyển: Hỗ trợ toàn quốc</p>
      </div>

      <Footer />
    </div>
  );
};

export default Detail;
