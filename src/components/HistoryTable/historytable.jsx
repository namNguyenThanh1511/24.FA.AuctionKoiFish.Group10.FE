import Koi from "../../images/Koi1.jpg";
import "./detail.css";
import HistoryTable from "../HistoryTable";

const Detail = () => {
  // Dữ liệu cố định cho bảng
  const fixedBidHistory = [
    { date: "2024-10-01 10:00:00", bid: "300.000.000", name: "Người A" },
    { date: "2024-10-02 11:30:00", bid: "350.000.000", name: "Người B" },
    { date: "2024-10-03 09:15:00", bid: "400.000.000", name: "Người C" },
  ];

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-image">
          <img src={Koi} alt="Sản phẩm" />
        </div>
        <div className="product-info">
          <h1>Koi Koi Koi #Aa33639</h1>
          <div className="Current-bid">
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
            <span className="sale-price">Start price 42.000.000₫</span> <br />
            <span className="original-price">Win price: 420.000.000₫</span>{" "}
            <br />
          </div>
          <div className="bid-section">
            <input
              type="text"
              className="bid-input"
              placeholder="Nhập giá thầu"
            />
            <button className="bid-btn">Bid</button>
          </div>
          <p className="time">
            <span>00:36:33</span>
          </p>
        </div>
      </div>

      <div className="additional-info-container">
        <h2>Lịch sử đấu giá</h2>
        <HistoryTable data={fixedBidHistory} />{" "}
        {/* Gọi component HistoryTable */}
      </div>
    </div>
  );
};

export default Detail;
