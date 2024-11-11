import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Form, Tooltip } from "antd";
import api from "../../../config/axios";
import { DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ManageMemberAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const roleEnum = useSelector((state) => state.user.roleEnum);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const fetchAccounts = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/members-pagination", {
        params: {
          page: page - 1,
          size: pageSize,
        },
      });
      console.log("API Response:", response.data);
      const {
        accountResponseList,
        totalElements,
        totalPages,
        pageNumber,
        numberOfElements,
      } = response.data;
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleEnum !== "STAFF") {
      message.error("You do not have permission to access this page.");
      navigate("/");
      return;
    }

    fetchAccounts();
  }, [roleEnum, navigate]);
  
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

  const handleUnlockAccount = async (user_id) => {
    try {
      await api.put(`/account/unlock/${user_id}`);
      message.success("Account unlocked successfully.");
      fetchAccounts();
    } catch (error) {
      message.error("Failed to unlock account.");
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
      render: (createdAt) => dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss"),
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
      title: "Account ",
      key: "Account ",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to disable this account?"
            onConfirm={() => handleBanMemberAccount(record.user_id)} // Xác nhận khóa tài khoản
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Disable
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure to unlock this account?"
            onConfirm={() => handleUnlockAccount(record.user_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<UnlockOutlined />}
              disabled={record.status?.toUpperCase() === "ACTIVE"} // Chuẩn hóa status
            >
              Unlock
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
