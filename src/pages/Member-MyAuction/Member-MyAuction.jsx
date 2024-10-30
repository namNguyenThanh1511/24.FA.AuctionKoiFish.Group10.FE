import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Pagination, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import dayjs from "dayjs";

const { Panel } = Collapse;

const MyAuction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  const navigate = useNavigate();

  const fetchAuctions = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/auctionSession/my-auctions", {
        params: { page: page - 1, size: pageSize },
      });
      const { auctionSessionResponses, totalElements, pageNumber } =
        response.data;
      setAuctions(auctionSessionResponses);
      setPagination({
        current: pageNumber + 1,
        pageSize,
        total: totalElements,
      });
    } catch (error) {
      console.error(
        "Fetch Error:",
        error.response ? error.response.data : error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchAuctions(page, pageSize);
  };

  const getHeaderStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return { backgroundColor: "#4CAF50", color: "white" }; // Green
      case "UPCOMING":
        return { backgroundColor: "#FF0000", color: "white" }; // Red
      case "ONGOING":
        return { backgroundColor: "#FFC107", color: "white" }; // Yellow
      default:
        return { backgroundColor: "#f0f0f0", color: "#333" }; // Default
    }
  };

  const goToAuctionDetail = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };

  return (
    <div
      style={{
        margin: "50px auto",
        padding: "0 20px",
        maxWidth: "1200px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
        My Auctions List
      </h2>
      <Row gutter={[16, 16]}>
        {auctions.map((auction) => (
          <Col key={auction.auctionSessionId} xs={24} sm={12} md={8}>
            <Collapse>
              <Panel
                header={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{auction.title}</span>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<RightOutlined />}
                      size="medium"
                      onClick={() =>
                        goToAuctionDetail(auction.auctionSessionId)
                      }
                      style={{
                        backgroundColor: "black", // Nút màu đen
                        borderColor: "#1890ff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#40a9ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "black")
                      }
                    />
                  </div>
                }
                key={auction.auctionSessionId}
                style={{
                  ...getHeaderStyle(auction.auctionStatus),
                  border: "1px solid black", // Thêm viền đen cho các card
                  borderRadius: "8px", // Bo góc card nếu cần
                }}
              >
                <p>
                  <strong>Auction ID:</strong> {auction.auctionSessionId}
                </p>
                <p>
                  <strong>Starting Price:</strong> {auction.startingPrice} VND
                </p>
                <p>
                  <strong>Current Price:</strong> {auction.currentPrice} VND
                </p>
                <p>
                  <strong>Buy Now Price:</strong> {auction.buyNowPrice} VND
                </p>
                <p>
                  <strong>Start Date:</strong>
                  {auction.startDate
                    ? dayjs(auction.startDate).format("DD-MM-YYYY HH:mm:ss")
                    : "N/A"}
                </p>
                <p>
                  <strong>End Date:</strong>
                  {auction.endDate
                    ? dayjs(auction.endDate).format("DD-MM-YYYY HH:mm:ss")
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    style={{
                      color:
                        auction.auctionStatus === "COMPLETED" ? "green" : "red",
                    }}
                  >
                    {auction.auctionStatus}
                  </span>
                </p>
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
      <Pagination
        style={{ marginTop: "20px" }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default MyAuction;
