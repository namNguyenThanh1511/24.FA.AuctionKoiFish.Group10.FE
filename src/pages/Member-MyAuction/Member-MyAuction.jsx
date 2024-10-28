import React, { useEffect, useState } from "react";
import { Card, Row, Col, Pagination, message } from "antd";
import api from "../../config/axios";
import dayjs from "dayjs";

const MyAuction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  const fetchAuctions = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/auctionSession/my-auctions", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);

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
            <Card
              title={auction.title}
              loading={loading}
              hoverable
              bordered={true}
              style={{
                borderRadius: "10px",
                border: "1px solid #1890ff",
                overflow: "hidden",
                transition: "transform 0.3s ease",
              }}
              bodyStyle={{
                fontSize: "16px",
                color: "#555",
              }}
              headStyle={{
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid 1890ff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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
                <strong>Buy Now Price</strong> {auction.buyNowPrice} VND
              </p>
              <p>
                <strong>Bid Increment:</strong> {auction.bidIncrement} VND
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {auction.startDate
                  ? dayjs(auction.startDate).format("DD-MM-YYYY HH:mm:ss")
                  : "N/A"}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {auction.endDate
                  ? dayjs(auction.endDate).format("DD-MM-YYYY HH:mm:ss")
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      auction.auctionStatus === "COMPLETED" ? "green" : "red",
                  }}
                >
                  {auction.auctionStatus}
                </span>
              </p>
            </Card>
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
