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

  // Data processing for charts
  const auctionRevenueData = data["Auction Session Revenue"].map((item) => ({
    auctionId: item["Auction Session ID"] || "Unknown",
    revenue: item["Total revenue"],
  }));

  const systemRevenueData = data["System Revenue"].map((item) => ({
    month: `${item["Month"]}/${item["Year"]}`,
    balance: item["Balance"],
  }));

  const topVarietiesData = data["Top Varieties"].map((variety) => ({
    name: variety["Name"],
    participants: variety["Number of participant(s)"],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Income Overview
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Auction Sessions"
              value={data["Total number of Auction Sessions"]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Completed Auction Sessions"
              value={data["Total number of completed auction session"]}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Bids per Session"
              value={data["Average number of bids per auction session"]}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

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
                      fill={COLORS[index % COLORS.length]}
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
            <ul>
              {data["Top Bidder Amounts"].map((bidder) => (
                <li key={bidder["User ID"]}>
                  <strong>{bidder.Username}</strong>:{" "}
                  {bidder["Total bid amount"]} VND
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Additional Statistics">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic
                  title="Total Members"
                  value={data["Total members"]}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Total Koi Breeders"
                  value={data["Total koi breeders"]}
                />
              </Col>
              <Col span={6}>
                <Statistic title="Total Staffs" value={data["Total staffs"]} />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Auction Success Rate"
                  value={(
                    data[
                      "Successful rate of all auction session (except upcoming )"
                    ] * 100
                  ).toFixed(2)}
                  suffix="%"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IncomeOverview;
