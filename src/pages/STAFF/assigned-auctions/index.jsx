import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import api from "../../../config/axios"; // Đường dẫn đến file cấu hình API
import dayjs from "dayjs";

const AssignedAuctions = ({ staffId }) => {
  // Đảm bảo staffId được truyền vào
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchAssignedAuctions = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      // Chỉnh sửa đường dẫn để bao gồm staffId
      const response = await api.get(`/auctionSession/staff/${staffId}`, {
        params: {
          page: page - 1, // API thường yêu cầu chỉ số trang bắt đầu từ 0
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);
      const { auctionSessionResponses, totalElements, pageNumber } =
        response.data;

      // Cập nhật dữ liệu và phân trang
      setAuctions(auctionSessionResponses);
      setPagination({
        current: pageNumber + 1, // API trả về số trang bắt đầu từ 0, nên cộng 1
        pageSize: pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Failed to load assigned auctions");
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedAuctions();
  }, [staffId]);

  const handleTableChange = (pagination) => {
    fetchAssignedAuctions(pagination.current, pagination.pageSize); // Gọi lại hàm với trang và kích thước trang
  };

  const columns = [
    {
      title: "Auction Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Starting Price (VND)",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Current Price (VND)",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Buy Now Price (VND)",
      dataIndex: "buyNowPrice",
      key: "buyNowPrice",
      render: (price) => price.toLocaleString(),
    },
    {
      title: "Auction Status",
      dataIndex: "auctionStatus",
      key: "auctionStatus",
      render: (status) => (
        <Tag color={status === "COMPLETED" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div style={{ padding: "50px" }}>
      <h2 style={{ textAlign: "center" }}>Assigned Auctions</h2>
      <Table
        dataSource={auctions}
        columns={columns}
        rowKey="auctionSessionId"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default AssignedAuctions;
