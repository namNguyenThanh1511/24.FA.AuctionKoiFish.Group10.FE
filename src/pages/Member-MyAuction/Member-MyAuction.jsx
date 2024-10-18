import React from "react";
import { Card, Row, Col, Tag, Badge, Button } from "antd";
import {
  HeartOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "../../pages/Member-MyAuction/Member-MyAuction.css"; 

const auctionData = [
  {
    name: "Koi Koi Koi",
    id: "#Aa33639",
    breeder: "NND",
    length: 18,
    sex: "Unknown",
    age: 2,
    stars: 4,
    price: 420000000,
    time: "October 15, 2024 10:00 AM",
    likes: 150,
    variety: "Kōhaku",
    paymentStatus: "Pending Payment", 
  },
  {
    name: "Golden Koi",
    id: "#Bb22412",
    breeder: "AAA",
    length: 22,
    sex: "Male",
    age: 3,
    stars: 5,
    price: 520000000,
    time: "September 20, 2024 02:30 PM",
    likes: 200,
    variety: "Showa",
    paymentStatus: "Paid", 
  },
  {
    name: "Koi Koi Koi",
    id: "#Aa33639",
    breeder: "NND",
    length: 18,
    sex: "Unknown",
    age: 2,
    stars: 4,
    price: 420000000,
    time: "October 15, 2024 10:00 AM",
    likes: 150,
    variety: "Kōhaku",
    paymentStatus: "Pending Payment", 
  },
];

const MyAuction = () => {
  return (
    <div className="my-auction-container">
      <Row gutter={[16, 16]}>
        {auctionData.map((auction, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <Card
              title={`${auction.name} (${auction.variety})`}
              extra={<Tag color="blue">{auction.id}</Tag>}
              hoverable
              actions={[
                <Badge count={auction.likes} showZero>
                  <HeartOutlined style={{ color: "#f5222d" }} />
                </Badge>,
                <Button type="link" icon={<StarOutlined />} disabled>
                  {auction.stars} Stars
                </Button>,
              ]}
            >
              <p>
                <strong>Breeder:</strong> {auction.breeder}
              </p>
              <p>
                <strong>Length:</strong> {auction.length} cm
              </p>
              <p>
                <strong>Sex:</strong> {auction.sex}
              </p>
              <p>
                <strong>Age:</strong> {auction.age} years
              </p>
              <p>
                <strong>Price:</strong> {auction.price.toLocaleString()} VND
              </p>
              <p>
                <strong>Auction Time:</strong> {auction.time}
              </p>

              {/* Trạng thái thanh toán */}
              <p>
                <strong>Payment Status:</strong>{" "}
                {auction.paymentStatus === "Paid" ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Paid
                  </Tag>
                ) : (
                  <Tag icon={<ClockCircleOutlined />} color="warning">
                    Pending Payment
                  </Tag>
                )}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyAuction;
