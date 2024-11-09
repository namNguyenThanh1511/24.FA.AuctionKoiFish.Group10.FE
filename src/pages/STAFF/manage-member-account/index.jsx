import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Form, Tooltip } from "antd";
import api from "../../../config/axios";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ManageMemberAccount = () => {
  const [accounts, setAccounts] = useState([]); // State lưu danh sách tài khoản
  const [loading, setLoading] = useState(false); // State quản lý loading
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });

  const [form] = Form.useForm();
  // Hàm fetch dữ liệu tài khoản từ API
  const fetchAccounts = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await api.get("/members-pagination", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);
      const { accountResponseList, totalElements, totalPages, pageNumber, numberOfElements } =
        response.data;
      setAccounts(accountResponseList);
      setPagination({
        current: pageNumber + 1,
        pageSize: pageSize,
        total: totalElements,
      });
    } catch (error) {
      message.error("Error fetching account data.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleBanMemberAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`);
      message.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      message.error("Failed to disable account.");
    }
  };

  const handleTableChange = (pagination) => {
    console.log(pagination);
    fetchAccounts(pagination, pagination.pageSize);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => (
        <Tooltip title={dayjs(date).format("MMMM D, YYYY, h:mm A")}>
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Role",
      dataIndex: "roleEnum",
      key: "roleEnum",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "ACTIVE" ? "green" : "red" }}>{status}</span>
      ),
    },
    {
      title: "Account Lock",
      key: "Account Lock",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to disable this account?"
            onConfirm={() => handleBanMemberAccount(record.user_id)} // Xác nhận khóa tài khoản
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Disable
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="member-account-container" style={{ margin: "100px auto" }}>
      <Table
        className="table-member-account"
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey={(record) => record.user_id}
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

export default ManageMemberAccount;
