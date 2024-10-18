import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import api from "../../../config/axios";
import {
  EditOutlined,
  DeleteOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import "./index.css";

const ManageStaffAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState([]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/staffs");
      const accountsData = response.data;
      setAccounts(accountsData);
    } catch (error) {
      message.error("Error fetching account data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);


const handleBanStaffAccount = async (user_id) => {
  try {
    await api.delete(`/account/${user_id}`);
    message.success("Account deleted successfully");
    fetchAccounts();
  } catch (error) {
    message.error("Failed to disable account.");
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
          onConfirm={() => handleBanStaffAccount(record.user_id)}
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
  <div className="staff-account-container">
    <Table
      className="table-staff-account"
      columns={columns}
      dataSource={accounts}
      loading={loading}
      rowKey={(record) => record.user_id}
      pagination={{ pageSize: 10 }}
    />
  </div>
);
};

export default ManageStaffAccount;
