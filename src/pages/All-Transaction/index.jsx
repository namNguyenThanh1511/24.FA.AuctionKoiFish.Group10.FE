import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Select, DatePicker, Input, message } from "antd";
import api from "../../config/axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Option } = Select;
const { RangePicker } = DatePicker;

const AllTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [filters, setFilters] = useState({
    transactionType: "",
    startDate: null,
    endDate: null,
  });
  const roleEnum = useSelector((state) => state.user.roleEnum);

  const navigate = useNavigate();

  const fetchTransactions = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    console.log(page);
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

      const response = await api.get("/transaction/filter-transactions", {
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
    if (roleEnum !== "MANAGER" && roleEnum != "STAFF") {
      message.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }

    fetchTransactions();
  }, [roleEnum, navigate]);

  useEffect(() => {
    fetchTransactions(1, pagination.pageSize);
  }, [filters]);

  const handleFilterChange = (value, field) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates || [];
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: start ? start.format("YYYY-MM-DD") : null,
      endDate: end ? end.format("YYYY-MM-DD") : null,
    }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchTransactions(pagination.current, pagination.pageSize);
  };

  const handleAllTransactions = () => {
    setFilters({
      transactionType: "",
      fromUserId: "",
      toUserId: "",
      startDate: null,
      endDate: null,
    });
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
        fromAccount && fromAccount.username.toLowerCase() !== "manager" ? (
          `${fromAccount.username}`
        ) : (
          <span style={{ color: "red" }}>System</span>
        ),
    },
    {
      title: "To Account",
      dataIndex: "toAccount",
      key: "toAccount",
      render: (toAccount, record) => {
        if (record.type === "WITHDRAW_FUNDS") {
          return "";
        }

        if (!toAccount || toAccount.username.toLowerCase() === "manager") {
          return <span style={{ color: "red" }}>System</span>;
        }

        return `${toAccount.username}`;
      },
    },

    {
      title: "Auction",
      dataIndex: "auctionSessionId",
      key: "auctionSessionId",
      render: (auctionSessionId) =>
        auctionSessionId ? (
          <Button
            type="link"
            onClick={() => goToAuctionDetail(auctionSessionId)}
            style={{ padding: 0 }}
          >
            <RightOutlined style={{ fontSize: "16px", color: "#1890ff" }} />
          </Button>
        ) : (
          "N/A"
        ),
    },
  ];

  const goToAuctionDetail = (auctionSessionId) => {
    navigate(`/auctions/${auctionSessionId}`);
  };

  return (
    <div style={{ margin: "100px auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Select Transaction Type"
          onChange={(value) => handleFilterChange(value, "transactionType")}
          style={{ width: 200, marginRight: 10 }}
          allowClear
        >
          <Option value="DEPOSIT_FUNDS">DEPOSIT_FUNDS</Option>
          <Option value="TRANSFER_FUNDS">TRANSFER_FUNDS</Option>
          <Option value="FEE_TRANSFER">FEE_TRANSFER</Option>
          <Option value="BID">BID</Option>
          <Option value="WITHDRAW_FUNDS">WITHDRAW_FUNDS</Option>
        </Select>

        <RangePicker onChange={handleDateChange} style={{ marginRight: 10 }} />

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
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default AllTransaction;
