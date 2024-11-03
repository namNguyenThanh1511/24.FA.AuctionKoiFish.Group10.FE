import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Select, DatePicker, message } from "antd";
import api from "../../config/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    transactionType: "",
    startDate: null,
    endDate: null,
  });

  const fetchTransactions = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const { transactionType, startDate, endDate } = filters;
      const params = {
        transactionType,
        startDate,
        endDate,
        page: page - 1,
        size: pageSize,
      };
      const response = await api.get("/transaction/my-transactions", {
        params,
      });
      const { transactionResponseList, totalElements, pageNumber } =
        response.data;

      setTransactions(transactionResponseList);
      setPagination({
        current: pageNumber + 1,
        pageSize: pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Failed to load transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFilterChange = (value, field) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates || [];
    setFilters({
      ...filters,
      startDate: start ? start.format("YYYY-MM-DD") : null,
      endDate: end ? end.format("YYYY-MM-DD") : null,
    });
  };

  const handleTableChange = (pagination) => {
    fetchTransactions(pagination, pagination.pageSize);
  };

  const handleAllTransactions = () => {
    setFilters({
      transactionType: "",
      startDate: null,
      endDate: null,
    });
    fetchTransactions(1); // Load lại tất cả giao dịch
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        let color = type === "TRANSFER_FUNDS" ? "blue" : "volcano";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => {
        const formattedAmount =
          record.type === "BID"
            ? `- ${amount.toLocaleString()} VND`
            : `${amount.toLocaleString()} VND`;
        return formattedAmount;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => {
        // Sử dụng regular expression để tìm giá trị số trong mô tả
        const match = description.match(/[-+]?\d*\.?\d+/); // Tìm số
        if (match) {
          // Nếu tìm thấy số, thêm "VND" vào sau
          const amount = parseFloat(match[0]); // Chuyển đổi thành số
          return `${description.replace(
            match[0],
            amount.toLocaleString()
          )} VND`; // Thay thế giá trị số trong mô tả và thêm "VND"
        }
        // Nếu không tìm thấy số, trả về giá trị gốc
        return description;
      },
    },

    {
      title: "From Account",
      dataIndex: "fromAccount",
      key: "fromAccount",
      render: (fromAccount) =>
        fromAccount
          ? `${fromAccount.fullName} (${fromAccount.username})`
          : "N/A",
    },
    {
      title: "To Account",
      dataIndex: "toAccount",
      key: "toAccount",
      render: (toAccount) =>
        toAccount ? `${toAccount.fullName} (${toAccount.username})` : "N/A",
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
  const navigate = useNavigate();

  const goToAuctionDetail = (auctionSessionId) => {
    navigate(`/auctions/${auctionSessionId}`);
  };

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select Transaction Type"
          onChange={(value) => handleFilterChange(value, "transactionType")}
          style={{ width: 200, marginRight: 10 }}
          allowClear
        >
          <Option value="DEPOSIT_FUNDS">DEPOSIT_FUNDS</Option>
          <Option value="TRANSFER_FUNDS">TRANSFER_FUNDS</Option>
          <Option value="BID">BID</Option>
          <Option value="WITHDRAW_FUNDS">WITHDRAW_FUNDS</Option>
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: 10 }} />
        <Button type="primary" onClick={() => fetchTransactions(1)}>
          Filter
        </Button>
        <Button onClick={handleAllTransactions} style={{ marginLeft: 10 }}>
          All
        </Button>
      </div>

      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleTableChange,
          showSizeChanger: false,
        }}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default Transaction;
