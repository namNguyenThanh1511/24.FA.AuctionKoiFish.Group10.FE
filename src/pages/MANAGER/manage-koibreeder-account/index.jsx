import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import api from "../../../config/axios";
import {
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import "./index.css";

const ManageKoiBreederAccount = () => {
  const [accounts, setAccounts] = useState([]); // Dữ liệu các tài khoản
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  // Lấy dữ liệu từ API và đổ vào state
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/breeders");
      const accountsData = response.data;
      setAccounts(accountsData); // Gán dữ liệu tài khoản vào state
    } catch (error) {
      message.error("Error fetching account data."); // Thông báo lỗi nếu có
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi dữ liệu được load
    }
  };

  useEffect(() => {
    fetchAccounts(); // Gọi hàm fetchAccounts khi component được render lần đầu
  }, []);

  // Xử lý khi xóa tài khoản
  const handleBanAccount = async (user_id) => {
    try {
      await api.delete(`/account/${user_id}`); // Gọi API xóa tài khoản
      message.success("Account deleted successfully");
      fetchAccounts(); // Tải lại danh sách tài khoản sau khi xóa
    } catch (error) {
      message.error("Failed to delete account.");
    }
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
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
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
            onConfirm={() => handleBanAccount(record.user_id)}
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
    <div className="manage-account-container">
      <Table
        className="table-account"
        columns={columns}
        dataSource={accounts}
        loading={loading}
        rowKey={(record) => record.user_id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ManageKoiBreederAccount;
