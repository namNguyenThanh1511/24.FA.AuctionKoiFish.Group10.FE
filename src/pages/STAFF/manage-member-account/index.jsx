import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import api from "../../../config/axios";
import { DeleteOutlined } from "@ant-design/icons";

const ManageMemberAccount = () => {
  const [accounts, setAccounts] = useState([]); // State lưu danh sách tài khoản
  const [loading, setLoading] = useState(false); // State quản lý loading

  // Hàm fetch dữ liệu tài khoản từ API
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/members"); // Gọi API lấy danh sách tài khoản
      const accountsData = response.data;
      setAccounts(accountsData);
    } catch (error) {
      message.error("Error fetching account data.");
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
    }
  };

  useEffect(() => {
    fetchAccounts(); // Fetch dữ liệu khi component được mount
  }, []);

  // Hàm khóa tài khoản member
  const handleBanMemberAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`);
      message.success("Account deleted successfully");
      fetchAccounts(); // Fetch lại danh sách sau khi khóa tài khoản thành công
    } catch (error) {
      message.error("Failed to disable account.");
    }
  };

  // Định nghĩa các cột cho bảng
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
      dataIndex: "createdDate",
      key: "createdDate",
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
        <span style={{ color: status === "ACTIVE" ? "green" : "red" }}>
          {status}
        </span>
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
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ManageMemberAccount;
