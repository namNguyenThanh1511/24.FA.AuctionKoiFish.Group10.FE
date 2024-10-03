import React, { useState, useEffect } from "react";
import HeaderLogin from "../../components/header-logged-in";
import Footer from '../../components/footer/Footer'; // Đường dẫn đến Footer
import "./Auction.css";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Radio,
  Slider,
  Row,
  Col,
} from "antd";
import Card from "../../components/Card/Card";
import Koi from "../../images/Koi1.jpg";

const { Option } = Select;

const Auction = () => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const allCards = [
    {
      name: "Koi Koi Koi",
      id: "#Aa33639",
      breeder: "NND",
      length: 18,
      sex: "Unknown",
      age: 2,
      stars: 4,
      price: 420000000,
      time: "October 15, 2024 10:00 AM", // Định dạng thời gian hợp lệ
      likes: 150,
      variety: "Kōhaku",
    },
    {
      name: "Moi Moi Moi",
      id: "#Aa33640",
      breeder: "Marushin",
      length: 25,
      sex: "Male",
      age: 1,
      stars: 5,
      price: 500000000,
      time: "October 16, 2024 1:00 PM", // Định dạng thời gian hợp lệ
      likes: 200,
      variety: "Showa",
    },
    {
      name: "Koi Koi Koi",
      id: "#Aa33641",
      breeder: "Sakai",
      length: 30,
      sex: "Female",
      age: 3,
      stars: 3,
      price: 300000000,
      time: "October 17, 2024 3:00 PM", // Định dạng thời gian hợp lệ
      likes: 100,
      variety: "Asagi",
    },
    {
      name: "Nishikigoi A",
      id: "#Aa33642",
      breeder: "Isa",
      length: 22,
      sex: "Male",
      age: 4,
      stars: 5,
      price: 600000000,
      time: "October 18, 2024 5:00 PM", // Định dạng thời gian hợp lệ
      likes: 250,
      variety: "Sanke",
    },
    {
      name: "Nishikigoi B",
      id: "#Aa33643",
      breeder: "Maruhiro",
      length: 28,
      sex: "Female",
      age: 2,
      stars: 4,
      price: 480000000,
      time: "October 19, 2024 8:00 AM", // Định dạng thời gian hợp lệ
      likes: 180,
      variety: "Shusui",
    },
    {
      name: "Nishikigoi C",
      id: "#Aa33644",
      breeder: "Torazo",
      length: 35,
      sex: "Male",
      age: 5,
      stars: 5,
      price: 750000000,
      time: "October 20, 2024 9:00 AM", // Định dạng thời gian hợp lệ
      likes: 300,
      variety: "Ogon",
    },
    {
      name: "Nishikigoi D",
      id: "#Aa33645",
      breeder: "Shinoda",
      length: 20,
      sex: "Male",
      age: 3,
      stars: 4,
      price: 550000000,
      time: "October 21, 2024 10:00 AM", // Định dạng thời gian hợp lệ
      likes: 220,
      variety: "Koromo",
    },
    {
      name: "Nishikigoi E",
      id: "#Aa33646",
      breeder: "Kanno",
      length: 40,
      sex: "Female",
      age: 6,
      stars: 5,
      price: 800000000,
      time: "October 22, 2024 11:00 AM", // Định dạng thời gian hợp lệ
      likes: 350,
      variety: "Showa",
    },
    {
      name: "Nishikigoi F",
      id: "#Aa33647",
      breeder: "Dainichi",
      length: 30,
      sex: "Female",
      age: 4,
      stars: 3,
      price: 650000000,
      time: "October 23, 2024 12:00 PM", // Định dạng thời gian hợp lệ
      likes: 280,
      variety: "Shusui",
    },
    {
      name: "Nishikigoi G",
      id: "#Aa33648",
      breeder: "Omosako",
      length: 32,
      sex: "Male",
      age: 2,
      stars: 4,
      price: 700000000,
      time: "October 24, 2024 1:00 PM", // Định dạng thời gian hợp lệ
      likes: 400,
      variety: "Asagi",
    },
    {
      name: "Nishikigoi H",
      id: "#Aa33649",
      breeder: "Izumiya",
      length: 38,
      sex: "Female",
      age: 3,
      stars: 5,
      price: 850000000,
      time: "October 25, 2024 2:00 PM", // Định dạng thời gian hợp lệ
      likes: 320,
      variety: "Sanke",
    },
    {
      name: "Nishikigoi I",
      id: "#Aa33650",
      breeder: "Marudo",
      length: 25,
      sex: "Unknown",
      age: 1,
      stars: 4,
      price: 500000000,
      time: "October 26, 2024 3:00 PM", // Định dạng thời gian hợp lệ
      likes: 180,
      variety: "Ogon",
    },
    {
      name: "Nishikigoi J",
      id: "#Aa33651",
      breeder: "Marujyu",
      length: 36,
      sex: "Male",
      age: 5,
      stars: 5,
      price: 900000000,
      time: "October 27, 2024 4:00 PM", // Định dạng thời gian hợp lệ
      likes: 420,
      variety: "Showa",
    },
    {
      name: "Nishikigoi K",
      id: "#Aa33652",
      breeder: "Shintaro",
      length: 45,
      sex: "Female",
      age: 7,
      stars: 5,
      price: 1000000000,
      time: "October 28, 2024 5:00 PM", // Định dạng thời gian hợp lệ
      likes: 500,
      variety: "Kōhaku",
    },
  ];

  const [filteredCards, setFilteredCards] = useState(allCards);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredCards((prevCards) =>
        prevCards.map((card) => ({
          ...card,
          timeLeft: calculateTimeLeft(card.time),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (timeString) => {
    const auctionEndTime = new Date(timeString).getTime();
    const currentTime = new Date().getTime();
    const difference = auctionEndTime - currentTime;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  const onFinish = (values) => {
    console.log("Nhận giá trị từ form: ", values);
    const { length, variety, sex, name, breeder, startPrice } = values;

    const filtered = allCards.filter((card) => {
      const sizeMatch = length ? card.length >= length : true;
      const varietyMatch = variety ? card.variety === variety : true;
      const sexMatch = sex ? card.sex === sex : true;
      const nameMatch = name
        ? card.name.toLowerCase().includes(name.toLowerCase())
        : true;
      const breederMatch = breeder ? card.breeder === breeder : true;
      const priceMatch = startPrice ? card.price >= startPrice : true;

      return (
        sizeMatch &&
        varietyMatch &&
        sexMatch &&
        nameMatch &&
        breederMatch &&
        priceMatch
      );
    });

    setFilteredCards(
      filtered.map((card) => ({
        ...card,
        timeLeft: calculateTimeLeft(card.time),
      }))
    );
    setCurrentPage(1);
  };

  // Tính toán các thẻ sẽ hiển thị trên trang hiện tại
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      
      <div className="auction-form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="auction-form"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="breeder" label="Breeder">
                <Select placeholder="Select breeder">
                  {/* Các Option ở đây */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="startPrice" label="Start Price">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter start price"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="variety" label="Variety">
                <Select placeholder="Select variety">
                  {/* Các Option ở đây */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sex" label="Sex">
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="length" label="Length (cm)">
            <Slider min={0} max={100} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="card-grid">
        {currentCards.map((card, index) => (
          <Card
            key={index}
            image={Koi}
            title={card.name}
            id={card.id}
            breeder={card.breeder}
            length={card.length}
            sex={card.sex}
            age={card.age}
            stars={card.stars}
            price={card.price.toLocaleString("en-US")}
            time={card.time}
            likes={card.likes}
            variety={card.variety}
            timeLeft={card.timeLeft}
          />
        ))}
      </div>
      <div className="pagination">
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1} // Disable nút nếu đang ở trang đầu tiên
        >
          {"<"} {/* Nút Quay lại */}
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`} // Áp dụng class CSS
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </Button>
        ))}
        {totalPages > 1 && (
          <>
            {currentPage > 3 && <span>...</span>}
            {currentPage < totalPages - 2 && <span>...</span>}
          </>
        )}
        <Button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages} // Disable nút nếu đang ở trang cuối
        >
          {">"} {/* Nút Tiếp theo */}
        </Button>
      </div>

     
    </div>
  );
};

export default Auction;
