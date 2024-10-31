import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Statistic, message } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../../config/axios";

const { Title } = Typography;

// Hàm tạo màu ngẫu nhiên
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const IncomeOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/statistic");
      setData(response.data);
    } catch (error) {
      message.error("Failed to load statistics data");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) return <p>Loading...</p>;

  // Tổng hợp doanh thu của các phiên đấu giá
  const auctionRevenueData = Object.values(
    data["Auction Session Revenue"].reduce((acc, item) => {
      const auctionId = item["Auction Session ID"];
      if (!acc[auctionId]) {
        acc[auctionId] = { auctionId, revenue: 0 };
      }
      acc[auctionId].revenue += item["Total revenue"];
      return acc;
    }, {})
  );

  // Dữ liệu doanh thu hệ thống
  const systemRevenueData = data["System Revenue"].map((item) => ({
    month: `${item["Month"]}/${item["Year"]}`,
    balance: item["Balance"],
  }));

  // Lấy balance gần nhất
  const latestBalance =
    data["System Revenue"][data["System Revenue"].length - 1]["Balance"];

  // Dữ liệu các giống cá top
  const topVarietiesData = data["Top Varieties"].map((variety) => ({
    name: variety["Name"],
    participants: variety["Number of participant(s)"],
  }));

  // Màu sắc cho biểu đồ Pie
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Tính toán màu sắc cho Auction Success Rate
  const auctionSuccessRate = (
    data["Successful rate of all auction session (except upcoming )"] * 100
  ).toFixed(2);

  let auctionRateColor = "";
  if (auctionSuccessRate < 40) {
    auctionRateColor = "red";
  } else if (auctionSuccessRate < 60) {
    auctionRateColor = "yellow";
  } else {
    auctionRateColor = "green";
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Income Overview
      </Title>

      {/* Hàng đầu chứa 4 trường dữ liệu*/}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{ backgroundColor: "#e6f7ff" }}>
            {" "}
            <Statistic
              title="Total Auction Sessions"
              value={data["Total number of Auction Sessions"]}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fffbe6" }}>
            {" "}
            <Statistic
              title="Completed Auction Sessions"
              value={data["Total number of completed auction session"]}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fff0f6" }}>
            {" "}
            <Statistic
              title="Average Bids per Session"
              value={data["Average number of bids per auction session"]}
              precision={2}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#f6ffed" }}>
            {" "}
            <Statistic
              title="Auction Success Rate"
              value={auctionSuccessRate}
              suffix="%"
              valueStyle={{ color: auctionRateColor }} // Màu chữ dựa trên giá trị
            />
          </Card>
        </Col>
      </Row>

      {/* Các thống kê bổ sung */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={6}>
          <Card style={{ backgroundColor: "#e6fffb" }}>
            {" "}
            <Statistic
              title="Total Members"
              value={data["Total members"]}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#e6f7ff" }}>
            {" "}
            <Statistic
              title="Total Koi Breeders"
              value={data["Total koi breeders"]}
              valueStyle={{ color: "#0050b3" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fff1f0" }}>
            {" "}
            <Statistic
              title="Total Staffs"
              value={data["Total staffs"]}
              valueStyle={{ color: "#d4380d" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fff7e6" }}>
            {" "}
            <Statistic
              title="Latest Balance"
              value={latestBalance} // Lấy balance gần nhất của hệ thống
              valueStyle={{ color: "#ff7300" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu phiên đấu giá và doanh thu hệ thống */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Auction Session Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={auctionRevenueData}>
                <XAxis
                  dataKey="auctionId"
                  label={{
                    value: "Auction ID",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Revenue (VND)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="System Revenue Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemRevenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ giống cá top và người trả giá top */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Top Auction Varieties by Participants">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topVarietiesData}
                  dataKey="participants"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {topVarietiesData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index] || getRandomColor()}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top Bidder Amounts">
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {data["Top Bidder Amounts"].map((bidder, index) => (
                <li key={bidder["User ID"]} style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        index === 0 ? "gold" : index === 1 ? "silver" : "black",
                    }}
                  >
                    Top {index + 1}
                  </span>{" "}
                  <strong>{bidder.Username}</strong>:{" "}
                  {bidder["Total bid amount"]} VND
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IncomeOverview;
