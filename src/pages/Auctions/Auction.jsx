import React, { useState } from "react";
import Header from "../../components/HeaderLogin";
import Footer from "../../components/footer/Footer";
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

  // Sample data for the cards
  const allCards = [
    {
      name: "Koi Koi Koi", // Tách name
      id: "#Aa33639", // Tách id
      breeder: "Omachi",
      length: 18,
      sex: "Unknown",
      age: 2,
      stars: 4,
      price: 420000000,
      status: "Available",
      likes: 150,
      size: 50,
      variety: "Kōhaku",
    },
    {
      name: "Moi Moi Moi", // Tách name
      id: "#Aa33640", // Tách id
      breeder: "Omachi",
      length: 25,
      sex: "Male",
      age: 1,
      stars: 5,
      price: 500000000,
      status: "Available",
      likes: 200,
      size: 60,
      variety: "Showa",
    },
    {
      name: "Koi Koi Koi", // Tách name
      id: "#Aa33641", // Tách id
      breeder: "Yamamoto",
      length: 30,
      sex: "Female",
      age: 3,
      stars: 3,
      price: 300000000,
      status: "Available",
      likes: 100,
      size: 70,
      variety: "Asagi",
    },
    {
      name: "Nishikigoi A", // Thêm cá mới
      id: "#Aa33642", // ID mới
      breeder: "Tanaka",
      length: 22,
      sex: "Male",
      age: 4,
      stars: 5,
      price: 600000000,
      status: "Available",
      likes: 250,
      size: 55,
      variety: "Sanke",
    },
    {
      name: "Nishikigoi B", // Thêm cá mới
      id: "#Aa33643", // ID mới
      breeder: "Suzuki",
      length: 28,
      sex: "Female",
      age: 2,
      stars: 4,
      price: 480000000,
      status: "Available",
      likes: 180,
      size: 65,
      variety: "Shusui",
    },
    {
      name: "Nishikigoi C", // Thêm cá mới
      id: "#Aa33644", // ID mới
      breeder: "Kobayashi",
      length: 35,
      sex: "Male",
      age: 5,
      stars: 5,
      price: 750000000,
      status: "Available",
      likes: 300,
      size: 75,
      variety: "Ogon",
    },
  ];

  const [filteredCards, setFilteredCards] = useState(allCards); // Initialize with all cards

  const onFinish = (values) => {
    console.log("Nhận giá trị từ form: ", values);

    const { length, variety, sex, name, id } = values;

    const filtered = allCards.filter((card) => {
      const sizeMatch = length ? card.length >= length : true; // Kiểm tra kích thước >= length
      const varietyMatch = variety ? card.variety === variety : true; // Kiểm tra giống loài
      const sexMatch = sex ? card.sex === sex : true; // Kiểm tra giới tính
      const nameMatch = name
        ? card.name.toLowerCase().includes(name.toLowerCase())
        : true; // Kiểm tra tên
      const idMatch = id
        ? card.id.toLowerCase().includes(id.toLowerCase())
        : true; // Kiểm tra ID

      return sizeMatch && varietyMatch && sexMatch && nameMatch && idMatch;
    });

    setFilteredCards(filtered); // Cập nhật thẻ cá đã lọc
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Auction Form */}
      <div className="auction-form-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="auction-form"
        >
          {/* Name, Id, Breeder Field cùng một hàng */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="name" label="Name">
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item name="breeder" label="Breeder">
                <Input placeholder="Enter breeder name" />
              </Form.Item>
            </Col>
          </Row>

          {/* Start Price, Variety Field cùng một hàng */}
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
                  <Option value="Showa">Showa</Option>
                  <Option value="Kōhaku">Kōhaku</Option>
                  <Option value="Asagi">Asagi</Option>
                  <Option value="Shusui">Shusui</Option>
                  <Option value="Koromo">Koromo</Option>
                  <Option value="Ogon">Ogon</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Sex Field */}
            <Col span={8}>
              <Form.Item name="sex" label="Sex">
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Size Field */}
          <Form.Item name="length" label="length (cm)">
            <Slider min={0} max={100} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Cards Container */}
      <div className="card-grid">
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            image={Koi} // Thay thế bằng card.image nếu có hình ảnh khác nhau
            title={card.name} // Sử dụng name
            id={card.id} // Truyền id
            breeder={card.breeder}
            length={card.length}
            sex={card.sex}
            age={card.age}
            stars={card.stars}
            price={card.price.toLocaleString("en-US")}
            status={card.status}
            likes={card.likes}
            variety={card.variety}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Auction;
