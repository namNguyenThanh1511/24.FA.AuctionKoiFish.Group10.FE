import React, { useEffect, useState } from "react";
import { Table, Button, Pagination } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import dayjs from "dayjs";

const MyAuction = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return { color: "green" }; // Green
      case "UPCOMING":
        return { color: "red" }; // Red
      case "ONGOING":
        return { color: "orange" }; // Yellow
      case "COMPLETED_WITH_BUYNOW":
        return { color: "green" }; // Yellow
      default:
        return { color: "#333" }; // Default
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return { color: "green" }; // Green
      case "DELIVERING":
        return { color: "yellow" }; // Yellow
      case "CANCELLED":
        return { color: "red" }; // Red
      default:
        return { color: "#333" }; // Default color
    }
  };

  const goToAuctionDetail = (auctionId) => {
    navigate(`/auctions/${auctionId}`);
  };

  const columns = [
    {
      title: "Auction ID",
      dataIndex: "auctionSessionId",
      key: "auctionSessionId",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Starting Price",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: (text) => `${text} VND`,
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (text) => `${text} VND`,
    },
    {
      title: "Buy Now Price",
      dataIndex: "buyNowPrice",
      key: "buyNowPrice",
      render: (text) => `${text} VND`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) =>
        text ? dayjs(text).format("DD-MM-YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) =>
        text ? dayjs(text).format("DD-MM-YYYY HH:mm:ss") : "N/A",
    },
    {
      title: "Auction Status",
      dataIndex: "auctionStatus",
      key: "auctionStatus",
      render: (status) => <span style={getStatusColor(status)}>{status}</span>,
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (status) => (
        <span style={getDeliveryStatusColor(status)}>{status}</span>
      ),
    },
    {
      title: "Auction",
      dataIndex: "auctionSessionId",
      key: "auctionSessionId",
      render: (auctionSessionId) => (
        <Button
          type="link"
          onClick={() => goToAuctionDetail(auctionSessionId)}
          style={{ padding: 0 }}
        >
          <RightOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        margin: "100px auto",
        padding: "0 20px",
        maxWidth: "1200px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
        My Auctions List
      </h2>

      <Table
        loading={loading}
        dataSource={auctions}
        columns={columns}
        rowKey="auctionSessionId"
        pagination={false}
        bordered
      />

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
