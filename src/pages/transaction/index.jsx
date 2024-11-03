import React, { useState } from "react";
import { Table, Tag, Button, Select, DatePicker, message } from "antd";
import api from "../../config/axios"; // Đường dẫn tới API đã cấu hình
import dayjs from "dayjs";

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

  const fetchTransactions = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const { transactionType, startDate, endDate } = filters;
      const params = {
        transactionType,
        startDate,
        endDate,
        page: page - 1, // API pagination thường bắt đầu từ 0
        size: pageSize,
      };
      const response = await api.get("/transaction/my-transactions", {
        params,
      });
      console.log("API Response:", response.data);
      const { transactionResponseList, totalElements } = response.data;

      setTransactions(transactionResponseList);
      setPagination({
        current: page,
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
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "From Account",
      dataIndex: "fromAccount",
      key: "fromAccount",
      render: (fromAccount) =>
        fromAccount ? `${fromAccount.fullName} (${fromAccount.username})` : "N/A",
    },
    {
      title: "To Account",
      dataIndex: "toAccount",
      key: "toAccount",
      render: (toAccount) => (toAccount ? `${toAccount.fullName} (${toAccount.username})` : "N/A"),
    },
    {
      title: "Auction Session ID",
      dataIndex: "auctionSessionId",
      key: "auctionSessionId",
    },
  ];

  return (
    <div style={{ margin: "100px auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select Transaction Type"
          onChange={(value) => handleFilterChange(value, "transactionType")}
          style={{ width: 200, marginRight: 10 }}
        >
          <Option value="DEPOSIT_FUNDS">DEPOSIT_FUNDS</Option>
          <Option value="TRANSFER_FUNDS">TRANSFER_FUNDS</Option>
          <Option value="FAILED">FAILED</Option>
          <Option value="BID">BID</Option>
          <Option value="WITHDRAW_PENDING">WITHDRAW_PENDING</Option>
          <Option value="WITHDRAW_REJECT">WITHDRAW_REJECT</Option>
          <Option value="WITHDRAW_SUCCESS">WITHDRAW_SUCCESS</Option>
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: 10 }} />
        <Button type="primary" onClick={() => fetchTransactions(1)}>
          Filter
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
